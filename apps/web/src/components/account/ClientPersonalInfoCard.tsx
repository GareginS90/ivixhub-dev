"use client";

import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";

type MeResponse = {
  id: number;
  email: string;
  fullName: string | null;
  username: string;
  birthDate: string;
  phone: string | null;
  phoneVerified: boolean;
  role: string;
  active: boolean;
};

const TXT = {
  ru: {
    title: "Личные данные",
    fullName: "Имя и фамилия",
    username: "Никнейм",
    birthDate: "Дата рождения",
    email: "Email",
    phone: "Телефон",
    phoneVerified: "Телефон подтверждён",
    yes: "Да",
    no: "Нет",
    empty: "Не указано",
    loading: "Загрузка..."
  },
  en: {
    title: "Personal information",
    fullName: "Full name",
    username: "Username",
    birthDate: "Date of birth",
    email: "Email",
    phone: "Phone",
    phoneVerified: "Phone verified",
    yes: "Yes",
    no: "No",
    empty: "Not specified",
    loading: "Loading..."
  },
  hy: {
    title: "Անձնական տվյալներ",
    fullName: "Անուն և ազգանուն",
    username: "Նիք",
    birthDate: "Ծննդյան ամսաթիվ",
    email: "Email",
    phone: "Հեռախոս",
    phoneVerified: "Հեռախոսը հաստատված է",
    yes: "Այո",
    no: "Ոչ",
    empty: "Նշված չէ",
    loading: "Բեռնվում է..."
  }
} as const;

function formatBirthDate(value: string, lang: Lang) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const locale =
    lang === "ru" ? "ru-RU" :
    lang === "hy" ? "hy-AM" :
    "en-GB";

  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export default function ClientPersonalInfoCard() {
  const [lang, setLang] = useState<Lang>("ru");
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie() as Lang);
    syncLang();
    const timer = window.setInterval(syncLang, 700);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/me", { cache: "no-store" as any });
        if (!r.ok) return;
        const j = await r.json();
        setData(j);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tr = TXT[lang];

  return (
    <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{tr.title}</h2>

      {loading ? (
        <div className="mt-4 text-sm text-gray-600">{tr.loading}</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.fullName}</div>
            <div className="mt-1 font-medium">{data?.fullName || tr.empty}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.username}</div>
            <div className="mt-1 font-medium">{data?.username || tr.empty}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.birthDate}</div>
            <div className="mt-1 font-medium">
              {data?.birthDate ? formatBirthDate(data.birthDate, lang) : tr.empty}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.email}</div>
            <div className="mt-1 font-medium break-all">{data?.email || tr.empty}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.phone}</div>
            <div className="mt-1 font-medium">{data?.phone || tr.empty}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.phoneVerified}</div>
            <div className="mt-1 font-medium">{data?.phoneVerified ? tr.yes : tr.no}</div>
          </div>
        </div>
      )}
    </section>
  );
}
