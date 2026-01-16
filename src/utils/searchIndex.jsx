export function buildSearchIndex(shows) {
  const index = {
    byName: {},
    byId: {},
    byYear: {},
    allShows: []
  };

  for (const show of shows) {
    index.allShows.push(show);

    if (show.name) {
      const nameLower = show.name.toLowerCase();
      index.byName[nameLower] = show;

      const words = nameLower.split(' ');
      words.forEach(word => {
        if (word.length >= 2) {
          if (!index.byName[word]) index.byName[word] = [];
          if (Array.isArray(index.byName[word])) {
            index.byName[word].push(show);
          } else {
            index.byName[word] = [index.byName[word], show];
          }
        }
      });
    }

    if (show.id) {
      index.byId[show.id.toLowerCase()] = show;
    }

    if (show.year) {
      const yearStr = String(show.year);
      if (!index.byYear[yearStr]) {
        index.byYear[yearStr] = [];
      }
      index.byYear[yearStr].push(show);
    }
  }

  return index;
}

export function searchInIndex(index, query) {
  const results = new Map();
  const queryLower = query.toLowerCase().trim();

  if (!queryLower) return [];

  Object.keys(index.byId).forEach(id => {
    if (id.includes(queryLower)) {
      results.set(index.byId[id].id, index.byId[id]);
    }
  });

  Object.keys(index.byName).forEach(key => {
    if (key.includes(queryLower)) {
      const item = index.byName[key];
      if (Array.isArray(item)) {
        item.forEach(show => results.set(show.id, show));
      } else {
        results.set(item.id, item);
      }
    }
  });

  if (/^\d{4}$/.test(queryLower)) {
    const yearShows = index.byYear[queryLower];
    if (yearShows) {
      yearShows.forEach(show => results.set(show.id, show));
    }
  }

  return Array.from(results.values());
}
