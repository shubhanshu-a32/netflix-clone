import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";

export default function Profile() {
  const [history, setHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("history")) || []);
    setWatchlist(JSON.parse(localStorage.getItem("watchlist")) || []);
  }, []);

  return (
    <div className="p-6 pt-24 min-h-screen bg-black text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 px-6 py-2 rounded font-semibold hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-xl text-gray-400 mb-4 border-b border-gray-800 pb-2">My Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="text-gray-500 italic">Your watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlist.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl text-gray-400 mb-4 border-b border-gray-800 pb-2">Watch History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 italic">No history yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {history.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
