// Backlog management with local storage and remote database sync
import { savePDFs } from './pdfStorage';

export interface BacklogEntry {
  id: string;
  sessionId: string;
  timestamp: number;
  pdfFileName?: string;
  question: string;
  answer: string;
  isPricingQuestion: boolean;
  error?: string;
  companyId?: string; // Optional: To track different companies
}

const BACKLOG_KEY = 'chat_backlog';
const MAX_BACKLOG_ENTRIES = 1000;
const API_URL = import.meta.env.VITE_BACKLOG_API_URL || '';

// Generate a unique session ID
export const generateSessionId = (): string => {
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
};

// Get company ID (can be set via URL parameter or localStorage)
export const getCompanyId = (): string | undefined => {
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get('company');
  if (companyId) {
    localStorage.setItem('company_id', companyId);
    return companyId;
  }
  // Otherwise use stored value
  return localStorage.getItem('company_id') || undefined;
};

// Save to local storage
const saveToLocalStorage = (entry: Omit<BacklogEntry, 'id' | 'timestamp'>) => {
  const backlog = getBacklog();
  const newEntry: BacklogEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...entry,
  };
  backlog.unshift(newEntry);

  if (backlog.length > MAX_BACKLOG_ENTRIES) {
    backlog.splice(MAX_BACKLOG_ENTRIES);
  }

  localStorage.setItem(BACKLOG_KEY, JSON.stringify(backlog));
};

// Save to remote database via API
const saveToDatabase = async (entry: Omit<BacklogEntry, 'id' | 'timestamp'>) => {
  if (!API_URL) {
    console.warn('Backlog API URL not configured. Entries will only be stored locally.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...entry,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to save backlog entry to database:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving backlog entry to database:', error);
    // Don't throw - we still want to save locally even if remote save fails
  }
};

// Save to backlog (both local and remote)
export const saveToBacklog = async (
  question: string,
  answer: string,
  pdfFileName?: string,
  isPricingQuestion: boolean = false,
  error?: string
) => {
  const sessionId = generateSessionId();
  const companyId = getCompanyId();

  const entry = {
    sessionId,
    pdfFileName,
    question,
    answer,
    isPricingQuestion,
    error,
    companyId,
  };

  // Save locally immediately
  saveToLocalStorage(entry);

  // Try to save to database (async, don't block)
  saveToDatabase(entry).catch(err => {
    console.error('Failed to sync to database:', err);
  });
};

// Get backlog from local storage
export const getBacklog = (): BacklogEntry[] => {
  const stored = localStorage.getItem(BACKLOG_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Get backlog from remote database (all entries or filtered by company)
export const getBacklogFromDatabase = async (companyId?: string): Promise<BacklogEntry[]> => {
  if (!API_URL) {
    return getBacklog(); // Fallback to local storage
  }

  try {
    const url = companyId 
      ? `${API_URL}/entries?companyId=${companyId}`
      : `${API_URL}/entries`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch backlog from database:', response.statusText);
      return getBacklog(); // Fallback to local storage
    }

    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error('Error fetching backlog from database:', error);
    return getBacklog(); // Fallback to local storage
  }
};

// Clear backlog
export const clearBacklog = () => {
  localStorage.removeItem(BACKLOG_KEY);
};

// Export backlog as JSON
export const exportBacklog = (entries?: BacklogEntry[]): string => {
  const backlog = entries || getBacklog();
  return JSON.stringify(backlog, null, 2);
};

// Format timestamp for display
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
