// Vercel Serverless Function for backlog storage
// Stores conversation history in a database

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Database connection (using environment variables)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'backlog_entries';

// CORS headers - Allow requests from ki-vergabe.de and localhost
const getAllowedOrigin = (origin: string | undefined): string => {
  if (!origin) return '*';
  
  // Normalize origin (remove trailing slash, handle http/https)
  const normalizedOrigin = origin.replace(/\/$/, '');
  
  // Allow ki-vergabe.de (both http and https)
  if (normalizedOrigin.includes('ki-vergabe.de')) {
    return normalizedOrigin;
  }
  
  // Allow localhost for development
  if (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1')) {
    return normalizedOrigin;
  }
  
  // Allow GitHub Pages domain
  if (normalizedOrigin.includes('github.io')) {
    return normalizedOrigin;
  }
  
  // Default: allow all origins (for development)
  return '*';
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Get origin from request (check multiple headers)
  const origin = req.headers.origin || 
                 req.headers.referer?.replace(/\/[^/]*$/, '') || 
                 req.headers['x-forwarded-host'] ||
                 undefined;
  
  const allowedOrigin = getAllowedOrigin(origin);
  
  // ALWAYS set CORS headers FIRST, before ANY other logic
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Log for debugging
  console.log('=== CORS DEBUG ===');
  console.log('Request method:', req.method);
  console.log('Origin header:', req.headers.origin);
  console.log('Referer header:', req.headers.referer);
  console.log('Allowed origin:', allowedOrigin);
  console.log('==================');
  
  // Handle CORS preflight OPTIONS request - MUST return early
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request - returning 200');
    return res.status(200).end();
  }

  try {
    // Log configuration status
    console.log('=== Configuration Check ===');
    console.log('SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('SUPABASE_KEY:', SUPABASE_KEY ? 'SET' : 'NOT SET');
    console.log('SUPABASE_TABLE:', SUPABASE_TABLE);
    console.log('Request method:', req.method);
    console.log('=======================');

    // If Supabase is configured, use it
    if (SUPABASE_URL && SUPABASE_KEY) {
      console.log('Using Supabase backend');
      return await handleSupabase(req, res);
    }

    // Otherwise, use a simple JSON file approach (not recommended for production)
    console.log('Using simple in-memory backend (Supabase not configured)');
    return handleSimple(req, res);
  } catch (error) {
    console.error('Backlog API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Handle with Supabase
async function handleSupabase(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Create new entry
    const entry = req.body;

    console.log('=== Supabase POST Request ===');
    console.log('Supabase URL:', SUPABASE_URL);
    console.log('Table:', SUPABASE_TABLE);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);
    console.log('Entry data:', JSON.stringify(entry, null, 2));

    // Validate required fields
    if (!entry || !entry.sessionId || !entry.question || !entry.answer) {
      console.error('Missing required fields:', {
        hasEntry: !!entry,
        hasSessionId: !!entry?.sessionId,
        hasQuestion: !!entry?.question,
        hasAnswer: !!entry?.answer
      });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['sessionId', 'question', 'answer']
      });
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY!,
          'Authorization': `Bearer ${SUPABASE_KEY!}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          session_id: entry.sessionId,
          company_id: entry.companyId || null,
          timestamp: new Date(entry.timestamp || Date.now()).toISOString(),
          pdf_file_name: entry.pdfFileName || null,
          question: entry.question,
          answer: entry.answer,
          is_pricing_question: entry.isPricingQuestion || false,
          error: entry.error || null,
        }),
      });

      console.log('Supabase response status:', response.status);
      console.log('Supabase response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Supabase error:', errorText);
        return res.status(response.status).json({ 
          error: 'Failed to save entry', 
          details: errorText,
          supabaseUrl: SUPABASE_URL,
          table: SUPABASE_TABLE
        });
      }

      const data = await response.json();
      console.log('Supabase success, saved entry:', data);
      return res.status(201).json({ success: true, entry: data[0] });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ 
        error: 'Failed to save entry', 
        details: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        type: 'fetch_error'
      });
    }
  }

  if (req.method === 'GET') {
    // Get entries (optionally filtered by companyId)
    const { companyId } = req.query;
    
    let url = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?order=timestamp.desc`;
    
    if (companyId) {
      url += `&company_id=eq.${companyId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: 'Failed to fetch entries', details: error });
    }

    const data = await response.json();
    
    // Transform Supabase format to our format
    const entries = data.map((row: any) => ({
      id: row.id,
      sessionId: row.session_id,
      companyId: row.company_id,
      timestamp: new Date(row.timestamp).getTime(),
      pdfFileName: row.pdf_file_name,
      question: row.question,
      answer: row.answer,
      isPricingQuestion: row.is_pricing_question || false,
      error: row.error,
    }));

    return res.status(200).json({ entries });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Simple fallback (in-memory storage - not persistent)
const simpleStorage: any[] = [];

async function handleSimple(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const entry = req.body;
    const newEntry = {
      id: crypto.randomUUID(),
      ...entry,
      timestamp: entry.timestamp || Date.now(),
    };
    simpleStorage.push(newEntry);
    return res.status(201).json({ success: true, entry: newEntry });
  }

  if (req.method === 'GET') {
    const { companyId } = req.query;
    let entries = [...simpleStorage];
    
    if (companyId) {
      entries = entries.filter((e: any) => e.companyId === companyId);
    }
    
    return res.status(200).json({ entries });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
