"use client";

import { useState } from "react";
import { clearToken } from "@/lib/api";

const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "hy", label: "Հայերեն" },
  { code: "en", label: "English" },
];

export default function TopBar() {
  const [open, setOpen] = useState(false);

  function logout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <div className="w-full h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      
      {/* LOGO */}
      <div
        onClick={() => (window.location.href = "/")}
        className="cursor-pointer flex flex-col"
      >
        <span className="font-bold text-lg">IviXHUB</span>
        <span className="text-xs text-zinc-500">Admin Panel</span>
      </div>

      <div className="flex items-center gap-4">

        {/* LANGUAGE */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="text-xl"
          >
            🌐
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-md">
              {LANGS.map((l) => (
                <div
                  key={l.code}
                  className="px-4 py-2 hover:bg-zinc-100 cursor-pointer text-sm"
                >
                  {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="text-sm text-red-500"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
