import { saveCache, getCache, CACHE_KEYS, updateLastSync } from '../utils/cacheManager.jsx';

const BASE = import.meta.env.VITE_IMDB_API_BASE;

const isOnline = () => navigator.onLine;

const getCacheKey = (sortMethod, page) => {
  const sortKey = CACHE_KEYS[`SHOWS_BY_${sortMethod.replace('SORT_BY_', '')}`] || 'shows_default';
  return `${sortKey}_page_${page}`;
};

export async function fetchAllMovies() {
  const cacheKey = CACHE_KEYS.ALL_MOVIES;

  if (isOnline()) {
    try {
      const allItems = [];
      const uniqueIds = new Set();

      const sortMethods = [
        'SORT_BY_POPULARITY',
        'SORT_BY_USER_RATING',
        'SORT_BY_RELEASE_DATE',
        'SORT_BY_USER_RATING_COUNT',
        'SORT_BY_YEAR'
      ];

      for (const sortBy of sortMethods) {
        for (let page = 1; page <= 20; page++) {
          try {
            const res = await fetch(`${BASE}/titles?sortBy=${sortBy}&limit=100&page=${page}`);

            if (!res.ok) break;

            const json = await res.json();
            if (!json?.titles || json.titles.length === 0) break;

            for (const item of json.titles) {
              if (!uniqueIds.has(item.id)) {
                uniqueIds.add(item.id);
                allItems.push(item);
              }
            }

            if (json.titles.length === 0) break;
          } catch (err) {
            console.error(`API Error at ${sortBy} page ${page}:`, err);
            break;
          }
        }
      }

      console.log(`✅ Total unique items fetched: ${allItems.length}`);

      if (allItems.length > 0) {
        saveCache(cacheKey, allItems);
        updateLastSync();
      }

      return allItems;
    } catch (error) {
      console.error('❌ fetchAllMovies network error:', error);
    }
  }

  const cached = getCache(cacheKey);
  if (cached) {
    console.log('📦 Returning cached movies (offline mode)');
    return cached;
  }

  console.warn('⚠️ No cached data available');
  return [];
}

export async function fetchShowsPage(sortMethod = 'SORT_BY_POPULARITY', page = 1) {
  const cacheKey = getCacheKey(sortMethod, page);

  if (isOnline()) {
    try {
      const res = await fetch(`${BASE}/titles?sortBy=${sortMethod}&limit=100&page=${page}`);

      if (res.ok) {
        const json = await res.json();
        const titles = json?.titles || [];

        if (titles.length > 0) {
          saveCache(cacheKey, titles);
          updateLastSync();
        }

        console.log(`✅ Fetched ${titles.length} shows for ${sortMethod} page ${page}`);
        return titles;
      }
    } catch (err) {
      console.error(`❌ API Fetch Error for ${sortMethod}:`, err);
    }
  }

  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`📦 Returning cached shows for ${sortMethod} page ${page}`);
    return cached;
  }

  console.warn(`⚠️ No cached data for ${sortMethod} page ${page}`);
  return [];
}

export async function fetchMovies(limit = 100) {
  return fetchShowsPage('SORT_BY_POPULARITY', 1);
}

export async function searchTitles(query) {
  const cacheKey = `${CACHE_KEYS.SEARCH_RESULTS}_${encodeURIComponent(query)}`;

  if (isOnline()) {
    try {
      const res = await fetch(`${BASE}/search/titles?query=${encodeURIComponent(query)}`);

      if (res.ok) {
        const json = await res.json();
        const titles = json?.titles || [];

        if (titles.length > 0) {
          saveCache(cacheKey, titles);
        }

        console.log(`✅ Search results for "${query}": ${titles.length} items`);
        return titles;
      }
    } catch (err) {
      console.error("❌ Search Error:", err);
    }
  }

  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`📦 Returning cached search results for "${query}"`);
    return cached;
  }

  console.warn(`⚠️ No cached search results for "${query}"`);
  return [];
}

export async function syncOfflineData() {
  if (!isOnline()) {
    console.log('⚠️ Cannot sync - still offline');
    return false;
  }

  console.log('🔄 Syncing data...');

  try {
    await fetchShowsPage('SORT_BY_POPULARITY', 1);
    await fetchShowsPage('SORT_BY_USER_RATING', 1);

    console.log('✅ Sync complete');
    return true;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return false;
  }
}
