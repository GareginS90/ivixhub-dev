"use client";

import { useState } from "react";
import { setToken } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      setToken(data.accessToken);

      window.location.href = "/";
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-[320px]">
        <h1 className="text-xl font-bold mb-6 text-center">Admin Login</h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-500 text-sm mb-3">{error}</div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          Login
        </button>
      </div>
    </div>
  );
}
