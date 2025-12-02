import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getExpectedAdminToken } from './utils/admin-token';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE_NAME = process.env.COMPANY_DOCS_TABLE || 'company_documents';
const BUCKET_NAME = process.env.COMPANY_PDF_BUCKET || 'company-pdfs';
const BASE_SITE_URL = process.env.SITE_BASE_URL || 'https://ki-vergabe.de';

interface CompanyDocRow {
  company_id: string;
  display_name: string;
  pdf_file_name: string;
  pdf_file_url: string;
  pdf_text: string;
  uploaded_at: string;
  updated_at?: string;
}

type InsertRow = Omit<
  CompanyDocRow,
  'uploaded_at'
> & {
  uploaded_by?: string;
  uploaded_at?: string;
};

interface CompanyListRow {
  company_id: string;
  display_name: string;
  uploaded_at: string;
}

interface IncomingFilePayload {
  name: string;
  base64: string;
  text: string;
}

const withError = (res: VercelResponse, status: number, error: string) =>
  res.status(status).json({ error });

const ensureConfig = (res: VercelResponse) => {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    withError(res, 500, 'Supabase configuration missing');
    return false;
  }
  return true;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-');

const decodeBase64ToBuffer = (base64: string) =>
  Buffer.from(base64.replace(/^data:application\/pdf;base64,/, ''), 'base64');

const uploadToStorage = async (
  companyId: string,
  fileName: string,
  base64: string,
) => {
  const objectName = `${companyId}/${Date.now()}-${sanitizeFileName(fileName)}`;
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(BUCKET_NAME)}/${encodeURIComponent(objectName)}`,
    {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/pdf',
        'x-upsert': 'true',
      },
      body: decodeBase64ToBuffer(base64),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Storage upload failed: ${details || response.statusText}`);
  }

  return objectName;
};

const deleteCompanyRows = async (companyId: string) => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?company_id=eq.${companyId}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to delete previous docs: ${details || response.statusText}`);
  }
};

const insertRows = async (rows: InsertRow[]) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to save company docs: ${details || response.statusText}`);
  }

  return (await response.json()) as CompanyDocRow[];
};

const fetchCompanyDocs = async (companyId: string): Promise<CompanyDocRow[]> => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?company_id=eq.${companyId}&order=uploaded_at.desc`,
    {
      headers: {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || response.statusText);
  }

  return (await response.json()) as CompanyListRow[];
};

const fetchCompanies = async (): Promise<CompanyListRow[]> => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=company_id,display_name,uploaded_at&order=uploaded_at.desc`,
    {
      headers: {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || response.statusText);
  }

  return response.json();
};

const expectedAdminToken = getExpectedAdminToken();

const verifyAdmin = (req: VercelRequest) => {
  const header =
    (req.headers['x-admin-token'] as string | undefined) ||
    (req.headers['X-Admin-Token'] as string | undefined);
  const headerToken = Array.isArray(header) ? header[0] : header;
  return headerToken && headerToken === expectedAdminToken;
};

const setCorsHeaders = (req: VercelRequest, res: VercelResponse) => {
  const originHeader = Array.isArray(req.headers.origin)
    ? req.headers.origin[0]
    : req.headers.origin;

  const allowedOrigin =
    originHeader &&
    (originHeader.includes('ki-vergabe.de') ||
      originHeader.includes('localhost') ||
      originHeader.includes('github.io') ||
      originHeader.includes('vercel.app'))
      ? originHeader
      : '*';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!ensureConfig(res)) {
    return;
  }

  try {
    if (req.method === 'GET') {
      const { companyId, list } = req.query;

      if (typeof list === 'string' && list === 'companies') {
        const rows = await fetchCompanies();
        const uniqueMap = new Map<string, { companyId: string; displayName: string; updatedAt?: string }>();
        rows.forEach((row) => {
          if (!uniqueMap.has(row.company_id)) {
            uniqueMap.set(row.company_id, {
              companyId: row.company_id,
              displayName: row.display_name,
              updatedAt: row.uploaded_at,
            });
          }
        });
        return res.status(200).json({ companies: Array.from(uniqueMap.values()) });
      }

      if (!companyId || typeof companyId !== 'string') {
        return withError(res, 400, 'companyId is required');
      }

      const sanitizedCompanyId = slugify(companyId);
      const docs = await fetchCompanyDocs(sanitizedCompanyId);

      if (!docs || docs.length === 0) {
        return withError(res, 404, 'No documents found for this company');
      }

      const combinedText = docs.map((doc: CompanyDocRow) => doc.pdf_text).join('\n\n---\n\n');
      const fileNames = docs.map((doc: CompanyDocRow) => doc.pdf_file_name);
      const displayName = docs[0]?.display_name || sanitizedCompanyId;

      return res.status(200).json({
        companyId: sanitizedCompanyId,
        displayName,
        fileNames,
        combinedText,
        shareUrl: `${BASE_SITE_URL.replace(/\/$/, '')}/?company=${sanitizedCompanyId}`,
      });
    }

    if (req.method === 'POST') {
      if (!verifyAdmin(req)) {
        return withError(res, 401, 'Unauthorized');
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const {
        companyId,
        displayName,
        files,
        replaceExisting = true,
      }: {
        companyId?: string;
        displayName?: string;
        files?: IncomingFilePayload[];
        replaceExisting?: boolean;
      } = body || {};

      if (!companyId || !displayName) {
        return withError(res, 400, 'companyId and displayName are required');
      }

      if (!Array.isArray(files) || files.length === 0) {
        return withError(res, 400, 'At least one file is required');
      }

      const sanitizedCompanyId = slugify(companyId);

      if (replaceExisting) {
        await deleteCompanyRows(sanitizedCompanyId);
      }

      const rows: CompanyDocRow[] = [];
      for (const file of files) {
        if (!file?.name || !file?.base64 || !file?.text) {
          return withError(res, 400, 'Each file requires name, base64, and text');
        }

        const storagePath = await uploadToStorage(sanitizedCompanyId, file.name, file.base64);

        rows.push({
          company_id: sanitizedCompanyId,
          display_name: displayName,
          pdf_file_name: file.name,
          pdf_file_url: storagePath,
          pdf_text: file.text,
          uploaded_by: 'admin',
          uploaded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      await insertRows(rows);

      return res.status(201).json({
        success: true,
        companyId: sanitizedCompanyId,
        shareUrl: `${BASE_SITE_URL.replace(/\/$/, '')}/?company=${sanitizedCompanyId}`,
      });
    }

    return withError(res, 405, 'Method not allowed');
  } catch (error) {
    console.error('company-docs error:', error);
    return withError(
      res,
      500,
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
}

