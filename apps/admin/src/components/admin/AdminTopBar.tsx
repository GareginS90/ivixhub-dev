"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminLang } from "@/lib/admin-i18n";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4 12h16M12 4c2.2 2.2 3.3 4.9 3.3 8S14.2 17.8 12 20M12 4c-2.2 2.2-3.3 4.9-3.3 8S9.8 17.8 12 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 8l4 4-4 4M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-20"
      />
      <path
        d="M20 12a8 8 0 0 0-8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminTopBar({
  lang,
  labels
}: {
  lang: AdminLang;
  labels: {
    ru: string;
    hy: string;
    en: string;
  };
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function switchLang(nextLang: AdminLang) {
    document.cookie = `ivixhub_lang=${nextLang}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  async function logout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store"
      });
    } finally {
      window.location.replace("/login");
    }
  }

  const buttonClass = (value: AdminLang) =>
    value === lang
      ? "relative inline-flex min-w-[42px] items-center justify-center rounded-xl bg-[#073f43] px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(7,63,67,.16)] transition"
      : "inline-flex min-w-[42px] items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-[#607d80] transition duration-200 hover:bg-white hover:text-[#078b7b]";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#073f43]/7 bg-white/85 p-2.5 shadow-[0_8px_28px_rgba(7,63,67,.045)] backdrop-blur-xl">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f8f6] text-[#078b7b]">
          <GlobeIcon />
        </div>

        <div className="hidden sm:block">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91a3a5]">
            Language
          </div>
          <div className="text-xs font-semibold text-[#315e61]">
            {lang.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-[15px] bg-[#f3f7f7] p-1">
          <button
            type="button"
            onClick={() => switchLang("hy")}
            className={buttonClass("hy")}
            aria-pressed={lang === "hy"}
          >
            {labels.hy}
          </button>

          <button
            type="button"
            onClick={() => switchLang("ru")}
            className={buttonClass("ru")}
            aria-pressed={lang === "ru"}
          >
            {labels.ru}
          </button>

          <button
            type="button"
            onClick={() => switchLang("en")}
            className={buttonClass("en")}
            aria-pressed={lang === "en"}
          >
            {labels.en}
          </button>
        </div>

        <div className="mx-0.5 hidden h-7 w-px bg-[#073f43]/8 sm:block" />

        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[14px] border border-rose-200/80 bg-rose-50/70 px-3.5 text-xs font-semibold text-rose-600 transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
        >
          {isLoggingOut ? <SpinnerIcon /> : <LogoutIcon />}
          <span className="hidden sm:inline">
            {isLoggingOut ? "..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}
