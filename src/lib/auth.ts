// Simple password authentication for protected pages
// Note: This is client-side only and not highly secure, but sufficient for basic protection

const AUTH_KEY = 'ki_vergabe_auth';

// Fixed password - cannot be changed
const FIXED_PASSWORD = 'Meryem';

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

// Get the fixed password hash
const getFixedPasswordHash = (): string => {
  return simpleHash(FIXED_PASSWORD);
};

// Set the password (deprecated - password is now fixed)
export const setPassword = (password: string): void => {
  // Password is fixed, cannot be changed
};

// Check if password is set (always true now)
export const hasPassword = (): boolean => {
  return true;
};

// Verify password and set authentication
export const login = (password: string): boolean => {
  // Compare with fixed password
  if (password === FIXED_PASSWORD) {
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

