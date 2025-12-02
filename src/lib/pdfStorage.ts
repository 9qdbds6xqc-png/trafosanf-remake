// Storage utility for sharing PDF data between pages
const STORAGE_KEY = 'uploaded_pdfs';

export interface PDFData {
  text: string;
  fileNames: string[];
}

export const savePDFs = (text: string, fileNames: string[]) => {
  try {
    const data: PDFData = { text, fileNames };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving PDFs to storage:', error);
  }
};

export const getPDFs = (): PDFData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading PDFs from storage:', error);
    return null;
  }
};

export const clearPDFs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing PDFs from storage:', error);
  }
};

