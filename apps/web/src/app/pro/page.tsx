"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">PSYCHOLOGIST DASHBOARD</h1>
        <button
          onClick={logout}
          disabled={loading}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
        >
          {loading ? "..." : "Logout"}
        </button>
      </div>

      <p className="mt-4 text-gray-600">
        Базовая страница психолога. Далее onboarding/availability/bookings.
      </p>
    </main>
  );
}
