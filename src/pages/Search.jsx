import { useEffect, useState } from "react";
import { fetchShowsPage } from "../api/tvShowsApi";
import { normalizeShow } from "../utils/normalizeShow";
import { buildSearchIndex, searchInIndex } from "../utils/searchIndex";
import ShowCard from "../components/ShowCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIndex() {
      setLoading(true);
      try {
        const allShows = [];
        const sortMethods = ['SORT_BY_POPULARITY', 'SORT_BY_USER_RATING', 'SORT_BY_RELEASE_DATE'];

        for (const method of sortMethods) {
          const raw = await fetchShowsPage(method, 1);
          const normalized = raw.map(normalizeShow);

          normalized.forEach(show => {
            if (!allShows.find(s => s.id === show.id)) {
              allShows.push(show);
            }
          });
        }

        const searchIndex = buildSearchIndex(allShows);
        setIndex(searchIndex);
        console.log(`Search index built with ${allShows.length} items`);
      } catch (err) {
        console.error("Failed to build search index:", err);
      } finally {
        setLoading(false);
      }
    }
    loadIndex();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim() || !index) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    const searchResults = searchInIndex(index, value);

    setSuggestions(searchResults.slice(0, 5).map(s => s.name));

    setResults(searchResults.slice(0, 50));
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    const searchResults = searchInIndex(index, suggestion);
    setResults(searchResults.slice(0, 50));
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="relative mb-6">
          <input
            className="w-full p-4 bg-zinc-800 text-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Search by name, ID, or year..."
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-3 hover:bg-zinc-700 cursor-pointer border-b border-zinc-700 last:border-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-white">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">
            Building search index...
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-gray-400">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </h2>
              <span className="text-sm text-gray-500">
                Hashmap search (instant)
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map(show => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </>
        ) : query && !loading ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-xl mb-2">No results found for "{query}"</p>
            <p className="text-sm">Try searching by:</p>
            <ul className="text-sm mt-2">
              <li>• Movie/Show name</li>
              <li>• IMDb ID (e.g., tt1234567)</li>
              <li>• Release year (e.g., 2020)</li>
            </ul>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>Start typing to search through {index?.allShows?.length || 0} items</p>
          </div>
        )}
      </div>
    </div>
  );
}
