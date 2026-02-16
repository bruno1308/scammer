const STORAGE_KEY = 'scammer_sim_openai_api_key';

export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key) {
  localStorage.setItem(STORAGE_KEY, key);
}

export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey() {
  return !!localStorage.getItem(STORAGE_KEY);
}
