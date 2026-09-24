"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useState
} from "react";
import { getUiLangFromCookie } from "@/i18n/client";
import VideoSessionClient from "@/components/sessions/VideoSessionClient";

type Lang = "hy" | "ru" | "en";

const TXT = {
  hy: {
    back: "Վերադառնալ հանդիպմանը",
    eyebrow: "IviXHub Video",
    title: "Ձեր առցանց հանդիպումը",
    subtitle:
      "Մուտք գործեք տեսասենյակ, երբ հոգեբանը սկսի սեանսը։",
    booking: "Ամրագրում"
  },

  ru: {
    back: "Вернуться к сессии",
    eyebrow: "IviXHub Video",
    title: "Ваша онлайн-встреча",
    subtitle:
      "Войдите в видеокомнату после того, как психолог начнёт сессию.",
    booking: "Бронирование"
  },

  en: {
    back: "Back to session",
    eyebrow: "IviXHub Video",
    title: "Your online session",
    subtitle:
      "Enter the video room after the psychologist starts the session.",
    booking: "Booking"
  }
} as const;

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export default function ClientBookingVideoPage() {
  const params =
    useParams<{ id: string }>();

  const bookingId =
    params?.id || "";

  const [lang, setLang] =
    useState<Lang>("hy");

  const tr = TXT[lang];

  useEffect(() => {
    const syncLang = () => {
      setLang(
        getUiLangFromCookie() as Lang
      );
    };

    syncLang();

    const onFocus = () =>
      syncLang();

    const onVisible = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        syncLang();
      }
    };

    window.addEventListener(
      "focus",
      onFocus
    );

    document.addEventListener(
      "visibilitychange",
      onVisible
    );

    const timer =
      window.setInterval(
        syncLang,
        700
      );

    return () => {
      window.removeEventListener(
        "focus",
        onFocus
      );

      document.removeEventListener(
        "visibilitychange",
        onVisible
      );

      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_4%_6%,rgba(18,184,196,0.13),transparent_28%),radial-gradient(circle_at_96%_8%,rgba(118,87,223,0.10),transparent_31%),radial-gradient(circle_at_52%_42%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <Link
          href={`/app/bookings/${bookingId}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.back}
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_22px_65px_rgba(7,63,67,0.06)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/9 blur-3xl" />

          <div className="relative">
            <div className="inline-flex rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
              {tr.eyebrow}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-[38px]">
              {tr.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73898b]">
              {tr.subtitle}
            </p>

            <div className="mt-4 inline-flex rounded-full bg-[#f1f7f7] px-3 py-1.5 text-xs font-extrabold text-[#617b7d]">
              {tr.booking} #{bookingId}
            </div>
          </div>
        </section>

        <div className="mt-6">
          <VideoSessionClient
            bookingId={bookingId}
            lang={lang}
            role="CLIENT"
          />
        </div>
      </div>
    </main>
  );
}
