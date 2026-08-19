const AUTHORIZATION_KEY = 'Authorization';
const LEGACY_TOKEN_KEY = 'token';
const STORE_KEY = 'store';
const PREVIOUS_URL_KEY = 'PreUrl';

export function getAuthToken() {
  return localStorage.getItem(AUTHORIZATION_KEY) || '';
}

export function setAuthToken(token) {
  if (!token) {
    clearAuthStorage();
    return;
  }

  localStorage.setItem(AUTHORIZATION_KEY, token);
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTHORIZATION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(STORE_KEY);
}

export function savePreviousUrl(path) {
  if (isSafeInternalPath(path) && path !== '/signIn') {
    localStorage.setItem(PREVIOUS_URL_KEY, path);
  }
}

export function takePreviousUrl(fallback = '/') {
  const path = localStorage.getItem(PREVIOUS_URL_KEY);
  localStorage.removeItem(PREVIOUS_URL_KEY);
  return isSafeInternalPath(path) && path !== '/signIn' ? path : fallback;
}

function isSafeInternalPath(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}
