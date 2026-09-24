"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const languages = [
  { code: "hy", label: "Հայերեն" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function changeLang(code: string) {
    document.cookie = `admin_lang=${code}; path=/`;
    router.refresh();
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-xl border px-3 py-2 hover:bg-gray-100"
      >
        🌐
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
