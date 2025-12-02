// Separate OPTIONS handler for CORS preflight
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const origin = req.headers.origin || req.headers.referer || '*';
  
  // Allow ki-vergabe.de and other origins
  const allowedOrigin = origin.includes('ki-vergabe.de') || 
                       origin.includes('localhost') || 
                       origin.includes('github.io')
    ? origin
    : '*';
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  return res.status(200).end();
}

