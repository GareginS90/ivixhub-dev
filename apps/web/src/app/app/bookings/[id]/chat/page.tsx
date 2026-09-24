"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState
} from "react";
import { getUiLangFromCookie } from "@/i18n/client";
import PsychologistName from "@/components/psychologists/PsychologistName";
import BookingChatClient from "@/components/chat/BookingChatClient";

type Lang = "hy" | "ru" | "en";

type Booking = {
  id: number;
  psychologistId: number;
  startAtUtc: string;
  endAtUtc: string;
  type: string;
  language: string;
  status: string;
};

const TXT = {
  hy: {
    back: "Վերադառնալ հանդիպմանը",
    eyebrow: "Անվտանգ հաղորդակցություն",
    title: "Զրույց հոգեբանի հետ",
    subtitle:
      "Հաղորդագրությունները կապված են միայն այս հանդիպման հետ։",
    booking: "Ամրագրում",
    psychologist: "Հոգեբան",
    openBooking: "Հանդիպման տվյալներ",
    openVideo: "Տեսասեանս",
    videoUnavailable:
      "Տեսասեանսը հասանելի կլինի հաստատված հանդիպման համար։",
    loadError:
      "Չհաջողվեց բեռնել ամրագրումը։",
    loading:
      "Բեռնվում են հանդիպման տվյալները…",
    status: "Կարգավիճակ",
    confirmed: "Հաստատված",
    completed: "Ավարտված",
    pending: "Սպասում է վճարման",
    cancelled: "Չեղարկված",
    active: "Ընթացիկ"
  },

  ru: {
    back: "Вернуться к сессии",
    eyebrow: "Безопасное общение",
    title: "Чат с психологом",
    subtitle:
      "Сообщения относятся только к этой сессии.",
    booking: "Бронирование",
    psychologist: "Психолог",
    openBooking: "Детали сессии",
    openVideo: "Видеосессия",
    videoUnavailable:
      "Видеосессия будет доступна для подтверждённой встречи.",
    loadError:
      "Не удалось загрузить бронирование.",
    loading:
      "Загружаем данные сессии…",
    status: "Статус",
    confirmed: "Подтверждено",
    completed: "Завершено",
    pending: "Ожидает оплаты",
    cancelled: "Отменено",
    active: "Активно"
  },

  en: {
    back: "Back to session",
    eyebrow: "Secure communication",
    title: "Chat with psychologist",
    subtitle:
      "Messages are connected only to this session.",
    booking: "Booking",
    psychologist: "Psychologist",
    openBooking: "Session details",
    openVideo: "Video session",
    videoUnavailable:
      "Video will be available for a confirmed session.",
    loadError:
      "Failed to load booking.",
    loading:
      "Loading session details…",
    status: "Status",
    confirmed: "Confirmed",
    completed: "Completed",
    pending: "Pending payment",
    cancelled: "Cancelled",
    active: "Active"
  }
} as const;

function isClosedStatus(
  status: string | undefined
) {
  const value = (
    status || ""
  ).toUpperCase();

  return (
    value === "CANCELLED" ||
    value === "CANCELLED_BY_CLIENT" ||
    value === "CANCELLED_BY_PSYCHOLOGIST" ||
    value === "EXPIRED_PAYMENT" ||
    value === "COMPLETED"
  );
}

function statusLabel(
  status: string | undefined,
  tr: (typeof TXT)[Lang]
) {
  const value = (
    status || ""
  ).toUpperCase();

  if (value === "CONFIRMED") {
    return tr.confirmed;
  }

  if (value === "COMPLETED") {
    return tr.completed;
  }

  if (
    value === "CREATED" ||
    value === "INITIATED" ||
    value === "PENDING_PAYMENT"
  ) {
    return tr.pending;
  }

  if (
    value === "CANCELLED" ||
    value === "CANCELLED_BY_CLIENT" ||
    value === "CANCELLED_BY_PSYCHOLOGIST" ||
    value === "EXPIRED_PAYMENT"
  ) {
    return tr.cancelled;
  }

  return tr.active;
}

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

function ArrowRightIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="6"
        width="13"
        height="12"
        rx="3"
      />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}

export default function ClientBookingChatPage() {
  const params =
    useParams<{ id: string }>();

  const bookingId =
    params?.id || "";

  const [lang, setLang] =
    useState<Lang>("hy");

  const tr = TXT[lang];

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/bookings/my",
            {
              cache:
                "no-store" as RequestCache
            }
          );

        if (!response.ok) {
          if (active) {
            setError(
              TXT[lang].loadError
            );
          }

          return;
        }

        const data =
          await response.json();

        const list: Booking[] =
          Array.isArray(data)
            ? data
            : [];

        const found =
          list.find(
            (item) =>
              String(item.id) ===
              String(bookingId)
          ) || null;

        if (active) {
          setBooking(found);
        }
      } catch {
        if (active) {
          setError(
            TXT[lang].loadError
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [bookingId, lang]);

  const isClosed = useMemo(
    () =>
      isClosedStatus(
        booking?.status
      ),
    [booking?.status]
  );

  const canOpenVideo =
    useMemo(() => {
      if (!booking) return false;

      const status =
        booking.status.toUpperCase();

      return (
        status === "CONFIRMED" ||
        status === "COMPLETED"
      );
    }, [booking]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[700px] bg-[radial-gradient(circle_at_2%_8%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_12%,rgba(118,87,223,0.09),transparent_31%),radial-gradient(circle_at_55%_40%,rgba(57,119,232,0.04),transparent_32%)]" />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <Link
          href={`/app/bookings/${bookingId}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.back}
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_65px_rgba(7,63,67,0.07)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/9 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                {tr.eyebrow}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-[38px]">
                {tr.title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#73898b]">
                {tr.subtitle}
              </p>

              {booking && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-extrabold">
                  <span className="rounded-full bg-[#f1f7f7] px-3 py-1.5 text-[#617b7d]">
                    {tr.booking} #
                    {booking.id}
                  </span>

                  <span className="rounded-full bg-[#e9f8f5] px-3 py-1.5 text-[#078b7b]">
                    {tr.psychologist}:{" "}
                    <PsychologistName
                      psychologistId={
                        booking.psychologistId
                      }
                    />
                  </span>

                  <span className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-[#3977e8]">
                    {tr.status}:{" "}
                    {statusLabel(
                      booking.status,
                      tr
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/app/bookings/${bookingId}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#073f43]/8 bg-white px-5 text-sm font-extrabold text-[#557173] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b]"
              >
                {tr.openBooking}
                <ArrowRightIcon />
              </Link>

              {canOpenVideo ? (
                <Link
                  href={`/app/bookings/${bookingId}/video`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(21,159,175,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <VideoIcon />
                  {tr.openVideo}
                </Link>
              ) : (
                <div
                  title={
                    tr.videoUnavailable
                  }
                  className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#073f43]/7 bg-[#f4f7f7] px-5 text-sm font-extrabold text-[#a1aeaf]"
                >
                  <VideoIcon />
                  {tr.openVideo}
                </div>
              )}
            </div>
          </div>
        </section>

        {loading && (
          <div className="mt-6 rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(7,63,67,0.05)]">
            <div className="flex items-center gap-3 text-sm font-bold text-[#60797b]">
              <span className="size-5 animate-spin rounded-full border-2 border-[#12b8c4]/20 border-t-[#078b7b]" />
              {tr.loading}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6">
          <BookingChatClient
            bookingId={bookingId}
            lang={lang}
            viewRole="CLIENT"
            isClosed={isClosed}
          />
        </div>
      </div>
    </main>
  );
}
