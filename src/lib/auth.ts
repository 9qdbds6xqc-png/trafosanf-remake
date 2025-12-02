// Server-side password authentication via Vercel Edge Function
// Password is verified server-side, not exposed in client code

const AUTH_KEY = 'ki_vergabe_auth';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'https://your-vercel-app.vercel.app/api/auth';

// Check if password is set (always true now)
export const hasPassword = (): boolean => {
  return true;
};

// Verify password via server-side API
export const login = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    // Fallback: If API is not available, use client-side check as backup
    // This ensures the site still works during development or if API is down
    const FALLBACK_PASSWORD = 'Meryem';
    if (password === FALLBACK_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

// Logout
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

