export const CACHE_KEYS = {
  SHOWS_BY_POPULARITY: 'shows_popularity',
  SHOWS_BY_RATING: 'shows_rating',
  SHOWS_BY_RELEASE: 'shows_release',
  SHOWS_BY_RATING_COUNT: 'shows_rating_count',
  SHOWS_BY_YEAR: 'shows_year',
  SEARCH_RESULTS: 'search_results',
  ALL_MOVIES: 'all_movies',
  LAST_SYNC: 'last_sync_timestamp'
};

export const saveCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache save error:', error);
  }
};

export const getCache = (key, maxAge = null) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    if (maxAge && Date.now() - timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

export const setCacheWithTimestamp = (key, data) => {
  saveCache(key, data);
};

export const getCacheWithTimestamp = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    return JSON.parse(cached);
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

export const clearExpiredCache = (maxAge = 7 * 24 * 60 * 60 * 1000) => {
  try {
    const now = Date.now();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('shows_') || key.startsWith('search_')) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (now - timestamp > maxAge) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
};

export const updateLastSync = () => {
  localStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
};

export const getLastSync = () => {
  const lastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
  return lastSync ? parseInt(lastSync, 10) : null;
};