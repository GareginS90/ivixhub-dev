"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState
} from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type Mode = "client" | "psychologist";

type ReviewItem = {
  id: number;
  bookingId: number;
  targetRole: string;
  rating: number;
  comment: string | null;
  authorDisplayName: string;
  createdAt: string;
  replyComment: string | null;
  repliedAt: string | null;
};

const TXT = {
  hy: {
    backClient: "Վերադառնալ անձնական էջ",
    backPsychologist:
      "Վերադառնալ հոգեբանի էջ",
    eyebrow: "IviXHub Reviews",
    titleClient: "Ձեր մասին կարծիքներ",
    titlePsychologist:
      "Ձեր մասին կարծիքներ",
    subtitleClient:
      "Այստեղ հավաքված են հոգեբանների կողմից ձեր մասին՝ որպես հաճախորդ, թողնված կարծիքները։",
    subtitlePsychologist:
      "Այստեղ հավաքված են հաճախորդների կողմից ձեր մասին՝ որպես հոգեբան, թողնված կարծիքները։",
    loading:
      "Կարծիքները բեռնվում են…",
    empty: "Կարծիքներ դեռ չկան",
    emptyHint:
      "Ավարտված հանդիպումներից հետո ստացված կարծիքները կհայտնվեն այստեղ։",
    loadError:
      "Չհաջողվեց բեռնել կարծիքները։",
    rating: "Միջին գնահատական",
    reviews: "Կարծիքներ",
    booking: "Ամրագրում",
    received: "Ստացվել է",
    yourReply:
      "Ձեր պաշտոնական պատասխանը",
    replyPlaceholderClient:
      "Գրեք ձեր պաշտոնական պատասխանը հոգեբանի կարծիքին…",
    replyPlaceholderPsychologist:
      "Գրեք ձեր պաշտոնական պատասխանը հաճախորդի կարծիքին…",
    reply: "Պատասխանել",
    replying: "Ուղարկվում է…",
    replyError:
      "Չհաջողվեց ուղարկել պատասխանը։",
    noComment:
      "Մեկնաբանություն չի թողնվել։",
    openBooking: "Բացել ամրագրումը",
    replied: "Պատասխանված է",
    replyAvailable:
      "Կարող եք հրապարակել մեկ պաշտոնական պատասխան։",
    characters: "նիշ",
    from: "Հեղինակ"
  },

  ru: {
    backClient: "Вернуться в кабинет",
    backPsychologist:
      "Вернуться в кабинет психолога",
    eyebrow: "IviXHub Reviews",
    titleClient: "Отзывы о вас",
    titlePsychologist: "Отзывы о вас",
    subtitleClient:
      "Здесь собраны отзывы, которые психологи оставили о вас как о клиенте.",
    subtitlePsychologist:
      "Здесь собраны отзывы, которые клиенты оставили о вас как о психологе.",
    loading: "Загружаем отзывы…",
    empty: "Отзывов пока нет",
    emptyHint:
      "Отзывы после завершённых встреч появятся здесь.",
    loadError:
      "Не удалось загрузить отзывы.",
    rating: "Средняя оценка",
    reviews: "Отзывы",
    booking: "Бронирование",
    received: "Получено",
    yourReply:
      "Ваш официальный ответ",
    replyPlaceholderClient:
      "Напишите официальный ответ на отзыв психолога…",
    replyPlaceholderPsychologist:
      "Напишите официальный ответ на отзыв клиента…",
    reply: "Ответить",
    replying: "Отправка…",
    replyError:
      "Не удалось отправить ответ.",
    noComment:
      "Комментарий не оставлен.",
    openBooking: "Открыть бронирование",
    replied: "Ответ опубликован",
    replyAvailable:
      "Вы можете опубликовать один официальный ответ.",
    characters: "символов",
    from: "Автор"
  },

  en: {
    backClient: "Back to dashboard",
    backPsychologist:
      "Back to psychologist dashboard",
    eyebrow: "IviXHub Reviews",
    titleClient: "Reviews about you",
    titlePsychologist:
      "Reviews about you",
    subtitleClient:
      "Here you can see reviews psychologists left about you as a client.",
    subtitlePsychologist:
      "Here you can see reviews clients left about you as a psychologist.",
    loading: "Loading reviews…",
    empty: "No reviews yet",
    emptyHint:
      "Reviews received after completed sessions will appear here.",
    loadError:
      "Failed to load reviews.",
    rating: "Average rating",
    reviews: "Reviews",
    booking: "Booking",
    received: "Received",
    yourReply: "Your official reply",
    replyPlaceholderClient:
      "Write your official reply to the psychologist's review…",
    replyPlaceholderPsychologist:
      "Write your official reply to the client's review…",
    reply: "Reply",
    replying: "Sending…",
    replyError:
      "Failed to send reply.",
    noComment:
      "No comment was provided.",
    openBooking: "Open booking",
    replied: "Reply published",
    replyAvailable:
      "You can publish one official reply.",
    characters: "characters",
    from: "Author"
  }
} as const;

function formatDate(
  value: string,
  lang: Lang
) {
  try {
    const locale =
      lang === "ru"
        ? "ru-RU"
        : lang === "hy"
          ? "hy-AM"
          : "en-US";

    return new Intl.DateTimeFormat(
      locale,
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    ).format(new Date(value));
  } catch {
    return value;
  }
}

function safeRating(
  rating: number
) {
  return Math.max(
    0,
    Math.min(5, rating || 0)
  );
}

function Stars({
  rating,
  size = "normal"
}: {
  rating: number;
  size?: "normal" | "large";
}) {
  const normalized =
    safeRating(rating);

  return (
    <div
      className={`flex items-center gap-0.5 ${
        size === "large"
          ? "text-xl"
          : "text-base"
      }`}
      aria-label={`${normalized} / 5`}
    >
      {Array.from({
        length: 5
      }).map((_, index) => (
        <span
          key={index}
          className={
            index < normalized
              ? "text-amber-400"
              : "text-[#dce5e5]"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
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

function StarIcon({
  size = 20
}: {
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2.8 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.4 6.3-.9Z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.3-4A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
      />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
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

export default function ReviewsInboxPage({
  mode
}: {
  mode: Mode;
}) {
  const [lang, setLang] =
    useState<Lang>("hy");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [items, setItems] =
    useState<ReviewItem[]>([]);

  const [replyingId, setReplyingId] =
    useState<number | null>(null);

  const [replyDrafts, setReplyDrafts] =
    useState<
      Record<number, string>
    >({});

  useEffect(() => {
    const syncLang = () => {
      setLang(
        getUiLangFromCookie()
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

  const tr = TXT[lang];

  const backHref =
    mode === "psychologist"
      ? "/pro"
      : "/app";

  const backText =
    mode === "psychologist"
      ? tr.backPsychologist
      : tr.backClient;

  const title =
    mode === "psychologist"
      ? tr.titlePsychologist
      : tr.titleClient;

  const subtitle =
    mode === "psychologist"
      ? tr.subtitlePsychologist
      : tr.subtitleClient;

  const replyPlaceholder =
    mode === "psychologist"
      ? tr.replyPlaceholderPsychologist
      : tr.replyPlaceholderClient;

  async function loadReviews() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/reviews/me/received",
        {
          cache: "no-store"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message ||
            tr.loadError
        );
        return;
      }

      const data = Array.isArray(
        payload
      )
        ? payload
        : [];

      setItems(data);

      setReplyDrafts(
        Object.fromEntries(
          data.map(
            (item: ReviewItem) => [
              item.id,
              ""
            ]
          )
        )
      );
    } catch {
      setError(tr.loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function submitReply(
    reviewId: number
  ) {
    const comment = (
      replyDrafts[reviewId] || ""
    ).trim();

    if (!comment || replyingId) {
      return;
    }

    try {
      setReplyingId(reviewId);
      setError(null);

      const response = await fetch(
        `/api/reviews/${reviewId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            comment
          })
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const details =
          typeof payload?.details ===
            "string" &&
          payload.details.trim()
            ? payload.details
            : payload?.message ||
              tr.replyError;

        setError(details);
        return;
      }

      setItems((previous) =>
        previous.map((item) =>
          item.id === reviewId
            ? {
                ...item,
                replyComment:
                  payload.replyComment ??
                  comment,
                repliedAt:
                  payload.repliedAt ??
                  new Date().toISOString()
              }
            : item
        )
      );

      setReplyDrafts(
        (previous) => ({
          ...previous,
          [reviewId]: ""
        })
      );
    } catch {
      setError(tr.replyError);
    } finally {
      setReplyingId(null);
    }
  }

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      ),
    [items]
  );

  const averageRating =
    useMemo(() => {
      if (!items.length) {
        return 0;
      }

      const total = items.reduce(
        (sum, item) =>
          sum +
          safeRating(item.rating),
        0
      );

      return total / items.length;
    }, [items]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_4%_7%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_8%,rgba(118,87,223,0.09),transparent_31%),radial-gradient(circle_at_52%_38%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {backText}
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_65px_rgba(7,63,67,0.07)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/9 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
              <StarIcon size={16} />
              {tr.eyebrow}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-[38px]">
              {title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73898b]">
              {subtitle}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[26px] border border-[#12b8c4]/12 bg-gradient-to-br from-[#effbf9] to-white p-5 shadow-[0_14px_40px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,63,67,0.07)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-[#70888a]">
                {tr.rating}
              </div>

              <div className="flex size-9 items-center justify-center rounded-[13px] bg-amber-50 text-amber-500">
                <StarIcon size={18} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div className="text-3xl font-black tracking-[-0.04em] text-[#073f43]">
                {items.length
                  ? averageRating.toFixed(
                      1
                    )
                  : "—"}
              </div>

              {items.length > 0 && (
                <div className="pb-1">
                  <Stars
                    rating={Math.round(
                      averageRating
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[26px] border border-[#3977e8]/10 bg-gradient-to-br from-[#f2f6ff] to-white p-5 shadow-[0_14px_40px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,63,67,0.07)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-[#70888a]">
                {tr.reviews}
              </div>

              <div className="flex size-9 items-center justify-center rounded-[13px] bg-[#eaf0ff] text-[#3977e8]">
                <MessageIcon />
              </div>
            </div>

            <div className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43]">
              {items.length}
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <section className="mt-6 flex min-h-[300px] items-center justify-center rounded-[30px] border border-[#073f43]/7 bg-white shadow-[0_20px_60px_rgba(7,63,67,0.06)]">
            <div className="text-center">
              <div className="mx-auto size-7 animate-spin rounded-full border-[3px] border-[#12b8c4]/15 border-t-[#078b7b]" />

              <div className="mt-4 text-sm font-bold text-[#6d8587]">
                {tr.loading}
              </div>
            </div>
          </section>
        ) : sortedItems.length ===
          0 ? (
          <section className="mt-6 flex min-h-[320px] items-center justify-center rounded-[30px] border border-[#073f43]/7 bg-white p-6 shadow-[0_20px_60px_rgba(7,63,67,0.06)]">
            <div className="max-w-md text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#fff8e8] text-amber-500">
                <StarIcon size={28} />
              </div>

              <h2 className="mt-5 text-base font-black text-[#31595b]">
                {tr.empty}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#839697]">
                {tr.emptyHint}
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-6 space-y-5">
            {sortedItems.map(
              (item) => {
                const bookingHref =
                  mode ===
                  "psychologist"
                    ? `/pro/bookings/${item.bookingId}`
                    : `/app/bookings/${item.bookingId}`;

                const draft =
                  replyDrafts[
                    item.id
                  ] || "";

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[30px] border border-[#073f43]/7 bg-white shadow-[0_18px_55px_rgba(7,63,67,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(7,63,67,0.075)]"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#e8f8f5] to-[#edf3ff] text-[#078b7b]">
                            <UserIcon />
                          </div>

                          <div className="min-w-0">
                            <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#99a8a9]">
                              {tr.from}
                            </div>

                            <div className="mt-0.5 truncate text-sm font-black text-[#31595b]">
                              {item.authorDisplayName}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-[#93a3a4]">
                          {formatDate(
                            item.createdAt,
                            lang
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Stars
                          rating={
                            item.rating
                          }
                          size="large"
                        />

                        <span className="rounded-full bg-[#fff8e8] px-3 py-1.5 text-xs font-black text-amber-700">
                          {safeRating(
                            item.rating
                          )}{" "}
                          / 5
                        </span>
                      </div>

                      <div className="mt-5 rounded-[22px] border border-[#073f43]/6 bg-[#f8fbfb] p-5">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-[#536f71]">
                          {item.comment?.trim() ||
                            tr.noComment}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8b9c9d]">
                          <CalendarIcon />
                          {tr.received}:{" "}
                          {formatDate(
                            item.createdAt,
                            lang
                          )}
                        </div>

                        <Link
                          href={
                            bookingHref
                          }
                          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#12b8c4]/15 bg-[#f1faf8] px-4 text-xs font-extrabold text-[#078b7b] transition-all hover:-translate-y-0.5 hover:border-[#12b8c4]/30"
                        >
                          {tr.booking} #
                          {item.bookingId}
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>

                    <div className="border-t border-[#073f43]/6 bg-[#fbfdfd] p-5 sm:p-6">
                      {item.replyComment ? (
                        <div className="rounded-[22px] border border-[#12b8c4]/12 bg-gradient-to-br from-[#effbf9] to-white p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-black text-[#078b7b]">
                              <span className="flex size-7 items-center justify-center rounded-full bg-[#def5f1]">
                                <CheckIcon />
                              </span>

                              {tr.yourReply}
                            </div>

                            <span className="rounded-full bg-[#e7f7f4] px-3 py-1 text-[10px] font-black text-[#078b7b]">
                              {tr.replied}
                            </span>
                          </div>

                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#536f71]">
                            {
                              item.replyComment
                            }
                          </p>

                          {item.repliedAt && (
                            <div className="mt-3 text-[11px] font-bold text-[#93a3a4]">
                              {formatDate(
                                item.repliedAt,
                                lang
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-black text-[#31595b]">
                              {tr.yourReply}
                            </div>

                            <div className="text-xs leading-5 text-[#8a9c9d]">
                              {
                                tr.replyAvailable
                              }
                            </div>
                          </div>

                          <textarea
                            value={draft}
                            onChange={(
                              event
                            ) =>
                              setReplyDrafts(
                                (
                                  previous
                                ) => ({
                                  ...previous,
                                  [item.id]:
                                    event
                                      .target
                                      .value
                                })
                              )
                            }
                            maxLength={
                              2000
                            }
                            rows={4}
                            placeholder={
                              replyPlaceholder
                            }
                            className="mt-4 w-full resize-y rounded-[20px] border border-[#073f43]/10 bg-white px-4 py-3.5 text-sm leading-6 text-[#31595b] outline-none transition-all placeholder:text-[#a4b1b2] focus:border-[#12b8c4]/45 focus:ring-4 focus:ring-[#12b8c4]/8"
                          />

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[10px] font-bold text-[#9aa9aa]">
                              {
                                draft.length
                              }{" "}
                              / 2000{" "}
                              {
                                tr.characters
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                void submitReply(
                                  item.id
                                )
                              }
                              disabled={
                                replyingId ===
                                  item.id ||
                                !draft.trim()
                              }
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-5 text-sm font-black text-white shadow-[0_10px_25px_rgba(21,159,175,0.18)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                            >
                              <MessageIcon />

                              {replyingId ===
                              item.id
                                ? tr.replying
                                : tr.reply}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}
      </div>
    </main>
  );
}
