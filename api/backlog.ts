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
    // If Supabase is configured, use it
    if (SUPABASE_URL && SUPABASE_KEY) {
      return handleSupabase(req, res);
    }

    // Otherwise, use a simple JSON file approach (not recommended for production)
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

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
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

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: 'Failed to save entry', details: error });
    }

    const data = await response.json();
    return res.status(201).json({ success: true, entry: data[0] });
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
