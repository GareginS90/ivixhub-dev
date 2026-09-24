"use client";

import { useEffect, useRef, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "hy" | "ru" | "en";

const languages: Array<{
  code: Lang;
  short: string;
  label: string;
}> = [
  { code: "hy", short: "HY", label: "Հայերեն" },
  { code: "ru", short: "RU", label: "Русский" },
  { code: "en", short: "EN", label: "English" }
];

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.45 3.6 5.45 3.6 9S14.4 18.55 12 21" />
      <path d="M12 3C9.6 5.45 8.4 8.45 8.4 12S9.6 18.55 12 21" />
    </svg>
  );
}

export function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>("hy");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveLang(getUiLangFromCookie());

    function onDocumentMouseDown(event: MouseEvent) {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function setLang(lang: Lang) {
    if (lang === activeLang) {
      setOpen(false);
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lang })
      });

      document.cookie = `ivixhub_lang=${lang}; path=/; SameSite=Lax`;
      window.location.href =
        window.location.pathname + window.location.search;
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={loading}
        aria-label="Փոխել լեզուն"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex size-11 items-center justify-center rounded-full border border-[#073f43]/12 bg-white text-[#075f62] shadow-sm transition duration-200 hover:border-[#12b8c4]/35 hover:bg-[#edf9f8] hover:text-[#078b7b] disabled:cursor-wait disabled:opacity-60"
      >
        <GlobeIcon />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-[80] mt-3 w-48 overflow-hidden rounded-2xl border border-[#073f43]/10 bg-white p-1.5 shadow-[0_18px_55px_rgba(7,63,67,0.15)]"
        >
          {languages.map((language) => {
            const active = language.code === activeLang;

            return (
              <button
                key={language.code}
                type="button"
                role="menuitem"
                onClick={() => setLang(language.code)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#e9f8f6] text-[#078b7b]"
                    : "text-[#425f61] hover:bg-[#f2f8f7] hover:text-[#073f43]"
                }`}
              >
                <span>{language.label}</span>

                <span
                  className={`text-[11px] font-extrabold tracking-[0.08em] ${
                    active ? "text-[#078b7b]" : "text-[#8aa0a1]"
                  }`}
                >
                  {language.short}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
