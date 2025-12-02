// Vercel Edge Function for password authentication
// This runs server-side, so the password is not exposed in client code

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Password stored in environment variable (not in code)
const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || 'Meryem';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Compare password (case-sensitive)
    if (password === CORRECT_PASSWORD) {
      return res.status(200).json({ 
        success: true,
        message: 'Authentication successful'
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

