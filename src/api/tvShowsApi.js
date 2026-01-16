const BASE = import.meta.env.VITE_IMDB_API_BASE;

export async function fetchAllMovies() {
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

  console.log(`Total unique items fetched: ${allItems.length}`);
  return allItems;
}

export async function fetchShowsPage(sortMethod = 'SORT_BY_POPULARITY', page = 1) {
  try {
    const res = await fetch(`${BASE}/titles?sortBy=${sortMethod}&limit=100&page=${page}`);
    if (!res.ok) return [];

    const json = await res.json();
    return json?.titles || [];
  } catch (err) {
    console.error(`API Fetch Error:`, err);
    return [];
  }
}

export async function fetchMovies(limit = 100) {
  return fetchShowsPage('SORT_BY_POPULARITY', 1);
}

export async function searchTitles(query) {
  try {
    const res = await fetch(`${BASE}/search/titles?query=${encodeURIComponent(query)}`);
    const json = await res.json();
    return json?.titles || [];
  } catch (err) {
    console.error("Search Error:", err);
    return [];
  }
}
