"use client";

import { useEffect, useRef, useState } from "react";

type Lang = "hy" | "ru" | "en";

export function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function setLang(lang: Lang) {
    setLoading(true);
    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang })
      });

      // client-side fallback too
      document.cookie = `ivixhub_lang=${lang}; path=/; SameSite=Lax`;

      // hard reload
      window.location.href = window.location.pathname + window.location.search;
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="h-10 w-10 rounded-xl border bg-white hover:bg-gray-50 grid place-items-center"
        aria-label="Language"
        disabled={loading}
      >
        🌐
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border bg-white shadow-sm overflow-hidden">
          <button onClick={() => setLang("hy")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Հայերեն (HY)</button>
          <button onClick={() => setLang("ru")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Русский (RU)</button>
          <button onClick={() => setLang("en")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">English (EN)</button>
        </div>
      )}
    </div>
  );
}
