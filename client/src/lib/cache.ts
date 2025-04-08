type StorageType = "localStorage" | "sessionStorage";

type CacheOptions = {
  key: string;
  ttl?: number; // milliseconds
  storage?: StorageType;
};

type CacheData<T> = {
  data: T;
  timestamp: number;
};

export function getCache<T = unknown>({
  key,
  ttl = 1000 * 60 * 10,
  storage = "sessionStorage",
}: CacheOptions): T | null {
  const raw = window[storage].getItem(key);
  if (!raw) return null;

  try {
    const { data, timestamp }: CacheData<T> = JSON.parse(raw);
    if (Date.now() - timestamp > ttl) {
      window[storage].removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    console.warn(`❌ Failed to parse cached data for key: ${key}`, e);
    return null;
  }
}

export function setCache<T = unknown>({
  key,
  data,
  storage = "sessionStorage",
}: CacheOptions & { data: T }) {
  const payload: CacheData<T> = {
    data,
    timestamp: Date.now(),
  };

  try {
    window[storage].setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.warn(`❌ Failed to save cache for key: ${key}`, e);
  }
}
