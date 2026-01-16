import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/browse/:id" element={user ? <div className="text-white p-10">Movie Details Page (Coming Soon)</div> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;