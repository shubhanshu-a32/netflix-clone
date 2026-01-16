import { useEffect, useRef, useState, useCallback } from "react";
import ShowCard from "./ShowCard";
import Loader from "./Loader";
import { fetchShowsPage } from "../api/tvShowsApi";
import { normalizeShow } from "../utils/normalizeShow";

export default function ShowGrid() {
  const [shows, setShows] = useState([]);
  const [currentSort, setCurrentSort] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const sortMethods = [
    'SORT_BY_POPULARITY',
    'SORT_BY_USER_RATING',
    'SORT_BY_RELEASE_DATE',
    'SORT_BY_USER_RATING_COUNT',
    'SORT_BY_YEAR'
  ];

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const raw = await fetchShowsPage(sortMethods[currentSort], page);

      if (raw.length === 0) {
        if (currentSort < sortMethods.length - 1) {
          setCurrentSort(currentSort + 1);
          setPage(1);
        } else {
          setHasMore(false);
        }
      } else {
        const normalized = raw.map(normalizeShow);

        setShows(prev => {
          const newShows = normalized.filter(n => !prev.some(p => p.id === n.id));
          return [...prev, ...newShows];
        });

        if (page >= 20) {
          if (currentSort < sortMethods.length - 1) {
            setCurrentSort(currentSort + 1);
            setPage(1);
          } else {
            setHasMore(false);
          }
        } else {
          setPage(page + 1);
        }
      }
    } catch (err) {
      console.error("Failed to load more shows", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, currentSort, loading, hasMore, sortMethods]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
        {shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="py-4">
          <Loader />
        </div>
      )}

      {!hasMore && shows.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          All content loaded ({shows.length} unique items)
        </div>
      )}
    </>
  );
}
