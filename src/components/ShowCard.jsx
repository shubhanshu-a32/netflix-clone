import { useNavigate } from "react-router-dom";
import useWishlist from "../hooks/useWishlist";

export default function ShowCard({ show }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(show.id);

  return (
    <div
      className="relative group bg-zinc-900 rounded-md overflow-hidden hover:z-50 hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => navigate(`/browse/${show.id}`)}
    >
      <img
        src={show.image}
        alt={show.name}
        className="w-full h-[300px] object-cover"
      />

      <button
        className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 transition"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(show);
        }}
      >
        <span className={`text-xl ${inWishlist ? 'text-red-600' : 'text-white'}`}>
          {inWishlist ? '♥' : '♡'}
        </span>
      </button>

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="font-bold text-white text-lg">{show.name}</h3>
        <div className="flex justify-between items-center text-xs text-gray-300 mt-2">
          <span>{show.year}</span>
          <span className="border border-gray-500 px-1 rounded">{show.rating}</span>
        </div>
      </div>
    </div>
  );
}
