"use client";

import { useRouter } from "next/navigation";
import type { AdminLang } from "@/lib/admin-i18n";

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

  function switchLang(nextLang: AdminLang) {
    document.cookie = `ivixhub_lang=${nextLang}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  const buttonClass = (value: AdminLang) =>
    value === lang
      ? "rounded-2xl border border-black bg-black px-4 py-2 text-sm text-white"
      : "rounded-2xl border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50";

  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">Language</div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => switchLang("ru")} className={buttonClass("ru")}>
            {labels.ru}
          </button>
          <button type="button" onClick={() => switchLang("hy")} className={buttonClass("hy")}>
            {labels.hy}
          </button>
          <button type="button" onClick={() => switchLang("en")} className={buttonClass("en")}>
            {labels.en}
          </button>
        </div>
      </div>
    </div>
  );
}
