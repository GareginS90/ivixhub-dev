"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    title: "Восстановление доступа",
    subtitle:
      "Если номер уже привязан к существующему аккаунту, войдите в этот аккаунт. Если доступ утерян, обратитесь в поддержку для ручного восстановления.",
    login: "Войти в существующий аккаунт",
    register: "Назад к регистрации",
    home: "На главную"
  },
  en: {
    title: "Account recovery",
    subtitle:
      "If the phone number is already linked to an existing account, sign in to that account. If access is lost, contact support for manual recovery.",
    login: "Sign in to existing account",
    register: "Back to registration",
    home: "Home"
  },
  hy: {
    title: "Հասանելիության վերականգնում",
    subtitle:
      "Եթե հեռախոսահամարը արդեն կապված է գոյություն ունեցող հաշվի հետ, մուտք գործեք այդ հաշիվ։ Եթե հասանելիությունը կորցրել եք, դիմեք աջակցությանը ձեռքով վերականգնման համար։",
    login: "Մուտք գործել առկա հաշիվ",
    register: "Վերադառնալ գրանցմանը",
    home: "Գլխավոր էջ"
  }
} as const;

type Lang = keyof typeof TXT;

export default function RecoveryPage() {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();
    const timer = window.setInterval(syncLang, 700);
    return () => window.clearInterval(timer);
  }, []);

  const tr = TXT[lang];

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">IvixHUB</div>
        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{tr.subtitle}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/login"
            className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90"
          >
            {tr.login}
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.register}
          </Link>

          <Link
            href="/"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
