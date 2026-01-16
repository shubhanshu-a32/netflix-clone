import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-96 p-6 bg-zinc-900 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>

        <input
          className="w-full p-2 mb-3 rounded bg-zinc-800"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 rounded bg-zinc-800"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-red-600 py-2 rounded mb-2"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full border border-gray-600 py-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
