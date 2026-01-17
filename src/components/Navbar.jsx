import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import useNetworkStatus from "../hooks/useOffline";

export default function Navbar({ current, onNavigate }) {
  const { isOnline } = useNetworkStatus();

  const navItem = (name) =>
    `cursor-pointer ${current === name ? "text-white" : "text-gray-400"
    } hover:text-white transition`;

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-red-600">NETFLEX</h1>

        <span className={navItem("home")} onClick={() => onNavigate("home")}>
          Home
        </span>
        <span className={navItem("search")} onClick={() => onNavigate("search")}>
          Search
        </span>
        <span
          className={navItem("profile")}
          onClick={() => onNavigate("profile")}
        >
          Profile
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${isOnline
            ? "text-green-400 bg-green-600/20 border-green-600/50"
            : "text-red-400 bg-red-600/20 border-red-600/50"
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
          {isOnline ? "Online" : "Offline"}
        </span>

        <button
          onClick={() => signOut(auth)}
          className="border px-4 py-1 rounded hover:bg-white hover:text-black transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
