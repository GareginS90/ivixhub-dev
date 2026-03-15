"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    title: "Регистрация психолога",
    subtitle:
      "Для специалистов используется отдельный onboarding-путь с профессиональным профилем, документами и последующей верификацией.",
    step1: "1. Создайте аккаунт психолога или войдите в существующий.",
    step2: "2. Подтвердите телефон и примите правила платформы.",
    step3: "3. Заполните профессиональный профиль психолога.",
    step4: "4. Загрузите документы и дождитесь верификации.",
    note:
      "Этот путь обязателен для специалистов и отличается от обычной клиентской регистрации.",
    login: "У меня уже есть аккаунт",
    registerPsych: "Создать аккаунт психолога",
    profile: "Перейти к профилю психолога",
    back: "Вернуться назад"
  },
  en: {
    title: "Psychologist registration",
    subtitle:
      "Specialists use a separate onboarding path with professional profile data, documents, and later verification.",
    step1: "1. Create a psychologist account or sign in to an existing one.",
    step2: "2. Verify your phone and accept platform rules.",
    step3: "3. Complete your professional psychologist profile.",
    step4: "4. Upload documents and wait for verification.",
    note:
      "This path is required for specialists and differs from normal client registration.",
    login: "I already have an account",
    registerPsych: "Create psychologist account",
    profile: "Go to psychologist profile",
    back: "Go back"
  },
  hy: {
    title: "Հոգեբանի գրանցում",
    subtitle:
      "Մասնագետների համար օգտագործվում է առանձին onboarding հոսք՝ մասնագիտական պրոֆիլով, փաստաթղթերով և հետագա վերիֆիկացիայով։",
    step1: "1. Ստեղծեք հոգեբանի հաշիվ կամ մուտք գործեք առկա հաշվով։",
    step2: "2. Հաստատեք հեռախոսահամարը և ընդունեք հարթակի կանոնները։",
    step3: "3. Լրացրեք հոգեբանի մասնագիտական պրոֆիլը։",
    step4: "4. Վերբեռնեք փաստաթղթերը և սպասեք վերիֆիկացիային։",
    note:
      "Այս ուղին պարտադիր է մասնագետների համար և տարբերվում է սովորական հաճախորդի գրանցումից։",
    login: "Ես արդեն ունեմ հաշիվ",
    registerPsych: "Ստեղծել հոգեբանի հաշիվ",
    profile: "Անցնել հոգեբանի պրոֆիլին",
    back: "Վերադառնալ"
  }
} as const;

type Lang = keyof typeof TXT;

export default function PsychologistOnboardingEntryPage() {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();

    const onFocus = () => syncLang();
    const onVisible = () => {
      if (document.visibilityState === "visible") syncLang();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(syncLang, 700);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, []);

  const tr = TXT[lang];

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">IvixHUB</div>
        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{tr.subtitle}</p>

        <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-gray-700">
          <div className="rounded-2xl bg-slate-50 p-4">{tr.step1}</div>
          <div className="rounded-2xl bg-slate-50 p-4">{tr.step2}</div>
          <div className="rounded-2xl bg-slate-50 p-4">{tr.step3}</div>
          <div className="rounded-2xl bg-slate-50 p-4">{tr.step4}</div>
        </div>

        <div className="mt-6 rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
          {tr.note}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/login?next=/psychologists/onboarding/profile"
            className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90"
          >
            {tr.login}
          </Link>

          <Link
            href="/auth/register?role=psychologist"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.registerPsych}
          </Link>

          <Link
            href="/psychologists/onboarding/profile"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.profile}
          </Link>

          <Link
            href="/"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.back}
          </Link>

          <Link
            href="/psychologists/account/delete"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.deleteAccount}
          </Link>
        </div>
      </div>
    </main>
  );
}
