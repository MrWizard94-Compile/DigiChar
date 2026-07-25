export const DIGICHAR_STORAGE_KEYS = {
  transactions: 'digichar_transactions',
  subscriptions: 'digichar_subscriptions',
  benchmarks: 'digichar_benchmarks',
  preferences: 'digichar_preferences',
} as const;

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }

  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export function clearDigiCharStorage(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  Object.values(DIGICHAR_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
