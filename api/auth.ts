// Vercel Edge Function for password authentication
// This runs server-side, so the password is not exposed in client code

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminTokenFromPassword } from './utils/admin-token.js';

// Password stored in environment variable (not in code)
const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || 'Meryem';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS - Allow requests from ki-vergabe.de
  // Headers can be string | string[] | undefined, so we need to handle arrays
  const getHeaderValue = (header: string | string[] | undefined): string | undefined => {
    if (!header) return undefined;
    if (Array.isArray(header)) return header[0];
    return header;
  };

  const origin = getHeaderValue(req.headers.origin);
  const allowedOrigin = origin && (origin.includes('ki-vergabe.de') || origin.includes('localhost') || origin.includes('github.io'))
    ? origin
    : '*';
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Compare password (case-sensitive)
    if (password === CORRECT_PASSWORD) {
      const token = createAdminTokenFromPassword(password);
      return res.status(200).json({ 
        success: true,
        message: 'Authentication successful',
        token
      });
    } else {
      // Add small delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.status(401).json({ 
        success: false,
        error: 'Invalid password' 
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}

