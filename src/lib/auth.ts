// Simple password authentication for protected pages
// Note: This is client-side only and not highly secure, but sufficient for basic protection

const AUTH_KEY = 'ki_vergabe_auth';
const PASSWORD_KEY = 'ki_vergabe_password_hash';

// Simple hash function (not cryptographically secure, but good enough for basic protection)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

// Set the password (first time setup or change)
export const setPassword = (password: string): void => {
  const hash = simpleHash(password);
  localStorage.setItem(PASSWORD_KEY, hash);
};

// Check if password is set
export const hasPassword = (): boolean => {
  return localStorage.getItem(PASSWORD_KEY) !== null;
};

// Verify password and set authentication
export const login = (password: string): boolean => {
  const storedHash = localStorage.getItem(PASSWORD_KEY);
  if (!storedHash) {
    // If no password is set, allow first-time access with any password and save it
    setPassword(password);
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  
  const inputHash = simpleHash(password);
  if (inputHash === storedHash) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

// Logout
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

