import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import useNetworkStatus from "../hooks/useOffline";

export default function Navbar({ current, onNavigate }) {
  const online = useNetworkStatus();

  const navItem = (name) =>
    `cursor-pointer ${
      current === name ? "text-white" : "text-gray-400"
    } hover:text-white transition`;

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-red-600">NETFLIX</h1>

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
          className={`text-sm ${
            online ? "text-green-400" : "text-red-400"
          }`}
        >
          {online ? "Online" : "Offline"}
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
