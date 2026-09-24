"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type Gender = "MALE" | "FEMALE" | "UNSPECIFIED";

type MeResponse = {
  id: number;
  email: string;
  fullName: string | null;
  username: string;
  birthDate: string;
  gender: Gender;
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
    gender: "Пол",
    email: "Email",
    phone: "Телефон",
    phoneVerified: "Телефон подтверждён",
    edit: "Редактировать профиль",
    yes: "Да",
    no: "Нет",
    empty: "Не указано",
    loading: "Загрузка...",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано"
  },
  en: {
    title: "Personal information",
    fullName: "Full name",
    username: "Username",
    birthDate: "Date of birth",
    gender: "Gender",
    email: "Email",
    phone: "Phone",
    phoneVerified: "Phone verified",
    edit: "Edit profile",
    yes: "Yes",
    no: "No",
    empty: "Not specified",
    loading: "Loading...",
    male: "Male",
    female: "Female",
    unspecified: "Not specified"
  },
  hy: {
    title: "Անձնական տվյալներ",
    fullName: "Անուն և ազգանուն",
    username: "Նիք",
    birthDate: "Ծննդյան ամսաթիվ",
    gender: "Սեռ",
    email: "Email",
    phone: "Հեռախոս",
    phoneVerified: "Հեռախոսը հաստատված է",
    edit: "Խմբագրել պրոֆիլը",
    yes: "Այո",
    no: "Ոչ",
    empty: "Նշված չէ",
    loading: "Բեռնվում է...",
    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ"
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

function genderLabel(value: Gender | null | undefined, tr: (typeof TXT)[Lang]) {
  if (value === "MALE") return tr.male;
  if (value === "FEMALE") return tr.female;
  return tr.unspecified;
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
        const r = await fetch("/api/me", { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as MeResponse;
        setData(j);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tr = TXT[lang];

  return (
    <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">{tr.title}</h2>

        <Link
          href="/app/account/profile"
          className="inline-flex justify-center rounded-2xl border px-4 py-3 text-sm hover:bg-gray-50"
        >
          {tr.edit}
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-gray-600">{tr.loading}</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
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
            <div className="text-gray-500">{tr.gender}</div>
            <div className="mt-1 font-medium">{genderLabel(data?.gender, tr)}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.email}</div>
            <div className="mt-1 break-all font-medium">{data?.email || tr.empty}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-gray-500">{tr.phone}</div>
            <div className="mt-1 font-medium">{data?.phone || tr.empty}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
            <div className="text-gray-500">{tr.phoneVerified}</div>
            <div className="mt-1 font-medium">{data?.phoneVerified ? tr.yes : tr.no}</div>
          </div>
        </div>
      )}
    </section>
  );
}
