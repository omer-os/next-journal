import { JournalEntry } from "./types";

interface CachedResponse {
  response: string;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const CACHE_KEY = "next-journal-cache";

export const clearCache = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
};

export const getCache = (): Record<string, CachedResponse> => {
  if (typeof window === "undefined") return {};

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};

    // Clear old cache format
    clearCache();
    return {};
  } catch (error) {
    console.error("Error reading cache:", error);
    return {};
  }
};

export const saveToCache = (key: string, value: CachedResponse): void => {
  if (typeof window === "undefined") return;

  try {
    const cache = getCache();
    cache[key] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
};

export const generateCacheKey = (
  entries: JournalEntry[],
  question: string,
  isBriefMode: boolean
): string => {
  const entryIds = entries
    .map((entry) => entry.id)
    .sort()
    .join(",");
  return `${entryIds}-${question}-${isBriefMode}`;
};

export const getCachedResponse = (key: string): CachedResponse | null => {
  const cache = getCache();
  const cached = cache[key];

  if (!cached) return null;

  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    delete cache[key];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return null;
  }

  return cached;
};
