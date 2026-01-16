import { useEffect, useState } from "react";
import { fetchShowsPage } from "../api/tvShowsApi";
import { normalizeShow } from "../utils/normalizeShow";
import useWishlist from "../hooks/useWishlist";

export default function TodayTopShow() {
  const [top, setTop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function load() {
      try {
        const raw = await fetchShowsPage('SORT_BY_USER_RATING', 1);
        const shows = raw.map(normalizeShow);

        if (shows.length > 0) {
          setTop(shows[0]);
        }
      } catch (err) {
        console.error("Failed to load hero show:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="relative h-[60vh] bg-gradient-to-r from-black to-gray-900 flex items-end">
        <div className="relative z-10 p-8 text-white">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-48"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!top) return null;

  const inWishlist = isInWishlist(top.id);

  return (
    <section
      className="relative h-[60vh] bg-cover bg-center flex items-end"
      style={{ backgroundImage: `url(${top.image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      <div className="relative z-10 p-8 max-w-xl text-white">
        <h2 className="text-sm uppercase text-gray-300 mb-2">
          Today's Top Show
        </h2>

        <h1 className="text-4xl font-bold mb-4">{top.name}</h1>

        <p className="text-sm text-gray-300 mb-6">
          Year: {top.year} • Rating: ⭐ {top.rating}
        </p>

        <div className="flex gap-4">
          <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition">
            ▶ Play
          </button>
          <button
            className={`px-6 py-2 rounded transition flex items-center gap-2 ${inWishlist ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700/80 text-white hover:bg-gray-600'}`}
            onClick={() => toggleWishlist(top)}
          >
            {inWishlist ? '✔ Added to Watchlist' : '+ Watchlist'}
          </button>
        </div>
      </div>
    </section>
  );
}
