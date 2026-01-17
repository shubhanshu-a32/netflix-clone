import { useEffect, useState, useRef } from "react";
import { fetchShowsPage } from "../api/tvShowsApi";
import { normalizeShow } from "../utils/normalizeShow";
import { useNavigate } from "react-router-dom";
import useWishlist from "../hooks/useWishlist";

export default function TodayTopShow() {
  const [topShows, setTopShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const raw = await fetchShowsPage('SORT_BY_USER_RATING', 1);
        const shows = raw.map(normalizeShow);
        setTopShows(shows);
      } catch (err) {
        console.error("Failed to load top shows:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="relative bg-black py-8 px-4 md:px-8">
        <h2 className="text-white text-2xl font-bold mb-4">Today's Top Shows</h2>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[300px] h-[400px] bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (topShows.length === 0) return null;

  return (
    <section className="relative bg-black py-8 px-4 md:px-8">
      <h2 className="text-white text-2xl font-bold mb-4">Today's Top Shows</h2>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topShows.map((show, index) => (
            <div
              key={show.id}
              className="relative min-w-[280px] md:min-w-[320px] flex-shrink-0 group/card cursor-pointer"
            >
              <div className="absolute -left-3 -top-3 z-10 bg-red-600 text-white font-bold text-xl px-3 py-1 rounded-full shadow-lg">
                #{index + 1}
              </div>

              <div
                className="relative bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                onClick={() => navigate(`/browse/${show.id}`)}
              >
                <img
                  src={show.image}
                  alt={show.name}
                  className="w-full h-[400px] object-cover"
                />

                <button
                  className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(show);
                  }}
                >
                  <span className={`text-xl ${isInWishlist(show.id) ? 'text-red-600' : 'text-white'}`}>
                    {isInWishlist(show.id) ? '♥' : '♡'}
                  </span>
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <h3 className="font-bold text-white text-xl mb-2">{show.name}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <span>Year: {show.year}</span>
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      {show.rating}
                    </span>
                  </div>
                  <button className="mt-3 bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200 transition text-sm">
                    ▶ Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
