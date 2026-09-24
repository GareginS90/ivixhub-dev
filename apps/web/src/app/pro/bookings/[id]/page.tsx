"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";
import PsychologistName from "@/components/psychologists/PsychologistName";
import ReviewFormCard from "@/components/reviews/ReviewFormCard";

type Lang = "ru" | "en" | "hy";

type Booking = {
  id: number;
  clientUserId?: number;
  psychologistId: number;
  clientDisplayName?: string | null;
  clientUsername?: string | null;
  clientBirthDate?: string | null;
  clientGender?: string | null;
  startAtUtc: string;
  endAtUtc: string;
  type: string;
  language: string;
  status: string;
};

type ClientReviewSummary = {
  ratingAvg: number | null;
  reviewsCount: number;
  recentReviews: Array<{
    id: number;
    rating: number;
    comment: string | null;
    authorDisplayName: string;
    createdAt: string;
    replyComment?: string | null;
    repliedAt?: string | null;
  }>;
};

const TXT = {
  ru: {
    back: "← Назад в кабинет психолога",
    title: "Бронь психолога",
    psychologist: "Психолог",
    client: "Клиент",
    clientUsername: "Ник клиента",
    clientAge: "Возраст клиента",
    clientGender: "Пол клиента",
    clientReputation: "Репутация клиента",
    start: "Начало",
    end: "Конец",
    type: "Тип",
    language: "Язык",
    status: "Статус",
    operations: "Операции",
    openChat: "Открыть чат",
    openVideo: "Открыть видео-сессию",
    cancel: "Отменить бронь",
    cancelling: "Отмена…",
    notFound: "Бронь не найдена.",
    loadError: "Не удалось загрузить бронь психолога.",
    cancelledOk: "Бронь отменена. Клиент получит 100% возврат.",
    refundNote: "Если психолог отменяет сессию, клиент получает 100% возврат.",
    videoLocked: "Видео-сессия доступна только для подтверждённых или завершённых броней.",
    rating: "Рейтинг",
    reviews: "Отзывы",
    noReviews: "Пока отзывов о клиенте нет.",
    withoutComment: "Без комментария.",
    reply: "Ответ",
    unknown: "—",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано"
  },
  en: {
    back: "← Back to psychologist dashboard",
    title: "Psychologist booking",
    psychologist: "Psychologist",
    client: "Client",
    clientUsername: "Client username",
    clientAge: "Client age",
    clientGender: "Client gender",
    clientReputation: "Client reputation",
    start: "Start",
    end: "End",
    type: "Type",
    language: "Language",
    status: "Status",
    operations: "Operations",
    openChat: "Open chat",
    openVideo: "Open video session",
    cancel: "Cancel booking",
    cancelling: "Cancelling…",
    notFound: "Booking not found.",
    loadError: "Failed to load psychologist booking.",
    cancelledOk: "Booking cancelled. The client will receive a 100% refund.",
    refundNote: "If the psychologist cancels the session, the client receives a 100% refund.",
    videoLocked: "Video session is available only for confirmed or completed bookings.",
    rating: "Rating",
    reviews: "Reviews",
    noReviews: "No reviews about this client yet.",
    withoutComment: "No comment.",
    reply: "Reply",
    unknown: "—",
    male: "Male",
    female: "Female",
    unspecified: "Not specified"
  },
  hy: {
    back: "← Վերադառնալ հոգեբանի էջ",
    title: "Հոգեբանի ամրագրում",
    psychologist: "Հոգեբան",
    client: "Հաճախորդ",
    clientUsername: "Հաճախորդի նիք",
    clientAge: "Հաճախորդի տարիք",
    clientGender: "Հաճախորդի սեռ",
    clientReputation: "Հաճախորդի հեղինակություն",
    start: "Սկիզբ",
    end: "Ավարտ",
    type: "Տեսակ",
    language: "Լեզու",
    status: "Կարգավիճակ",
    operations: "Գործողություններ",
    openChat: "Բացել չատը",
    openVideo: "Բացել տեսասեանսը",
    cancel: "Չեղարկել ամրագրումը",
    cancelling: "Չեղարկվում է…",
    notFound: "Ամրագրումը չի գտնվել։",
    loadError: "Չհաջողվեց բեռնել հոգեբանի ամրագրումը։",
    cancelledOk: "Ամրագրումը չեղարկվեց։ Հաճախորդը կստանա 100% վերադարձ։",
    refundNote: "Եթե հոգեբանը չեղարկում է սեանսը, հաճախորդը ստանում է 100% վերադարձ։",
    videoLocked: "Տեսասեանսը հասանելի է միայն հաստատված կամ ավարտված ամրագրումների համար։",
    rating: "Գնահատական",
    reviews: "Կարծիքներ",
    noReviews: "Հաճախորդի մասին կարծիքներ դեռ չկան։",
    withoutComment: "Առանց մեկնաբանության։",
    reply: "Պատասխան",
    unknown: "—",
    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ"
  }
} as const;

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("hy-AM", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function renderRatingStars(value: number | null | undefined) {
  if (value == null) {
    return <span className="text-slate-300">☆☆☆☆☆</span>;
  }

  const roundedToHalf = Math.round(value * 2) / 2;
  const full = Math.floor(roundedToHalf);
  const hasHalf = roundedToHalf - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-hidden="true">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {hasHalf && <span>⯨</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} className="text-slate-300">
          ★
        </span>
      ))}
    </span>
  );
}

function calculateAge(birthDate?: string | null) {
  if (!birthDate) return null;

  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function resolveGenderLabel(value: string | null | undefined, lang: Lang) {
  const normalized = (value || "").trim().toUpperCase();

  if (normalized === "MALE") return TXT[lang].male;
  if (normalized === "FEMALE") return TXT[lang].female;

  return TXT[lang].unspecified;
}

export default function ProBookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookingId = params?.id;

  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const [booking, setBooking] = useState<Booking | null>(null);
  const [clientSummary, setClientSummary] = useState<ClientReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/pro/bookings", { cache: "no-store" });
        if (!r.ok) {
          setError(tr.loadError);
          return;
        }

        const data = await r.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((x: Booking) => String(x.id) === String(bookingId)) || null;
        setBooking(found);

        if (found?.clientUserId) {
          const summaryRes = await fetch(`/api/reviews/clients/${found.clientUserId}/summary`, {
            cache: "no-store"
          });

          if (summaryRes.ok) {
            const summaryJson = await summaryRes.json().catch(() => null);
            setClientSummary(summaryJson);
          }
        }
      } catch {
        setError(tr.loadError);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId, tr.loadError]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      router.push("/pro");
      router.refresh();
    }, 1800);

    return () => clearTimeout(timer);
  }, [success, router]);

  const canCancel = useMemo(() => {
    if (!booking) return false;
    return booking.status === "CREATED" || booking.status === "CONFIRMED";
  }, [booking]);

  const canOpenVideo = useMemo(() => {
    if (!booking) return false;
    return booking.status === "CONFIRMED" || booking.status === "COMPLETED";
  }, [booking]);

  const canReview = useMemo(() => {
    if (!booking) return false;
    return booking.status === "COMPLETED";
  }, [booking]);

  async function cancelBooking() {
    if (!bookingId || !canCancel || canceling) return;

    setCanceling(true);
    setError(null);
    setSuccess(null);

    try {
      const r = await fetch(`/api/pro/bookings/cancel/${bookingId}`, { method: "POST" });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Psychologist cancel failed");
        return;
      }

      setBooking(j);
      setSuccess(tr.cancelledOk);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Psychologist cancel failed");
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-6">Loading…</div>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-red-50 p-6 text-sm text-red-800">
          <b>Error:</b> {error}
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-6 text-sm text-gray-700">
          {tr.notFound}
        </div>
      </main>
    );
  }

  const ratingText =
    typeof clientSummary?.ratingAvg === "number" ? clientSummary.ratingAvg.toFixed(1) : "—";
  const reviewsCount =
    typeof clientSummary?.reviewsCount === "number" ? clientSummary.reviewsCount : 0;
  const recentReviews = Array.isArray(clientSummary?.recentReviews) ? clientSummary.recentReviews : [];
  const clientAge = calculateAge(booking.clientBirthDate);
  const clientName = booking.clientDisplayName?.trim() || booking.clientUsername?.trim() || tr.unknown;
  const clientGender = resolveGenderLabel(booking.clientGender, lang);

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/pro" className="text-sm text-gray-600 hover:text-black">
          {tr.back}
        </Link>

        <div className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">
            {tr.title} #{booking.id}
          </h1>

          <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.psychologist}</div>
              <div className="mt-1 font-medium">
                <PsychologistName psychologistId={booking.psychologistId} />
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.client}</div>
              <div className="mt-1 font-medium">{clientName}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.clientUsername}</div>
              <div className="mt-1 font-medium">{booking.clientUsername || tr.unknown}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.clientAge}</div>
              <div className="mt-1 font-medium">{clientAge ?? tr.unknown}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.clientGender}</div>
              <div className="mt-1 font-medium">{clientGender}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.status}</div>
              <div className="mt-1 font-medium">{booking.status}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.type}</div>
              <div className="mt-1 font-medium">{booking.type || tr.unknown}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.language}</div>
              <div className="mt-1 font-medium">{booking.language || tr.unknown}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.start}</div>
              <div className="mt-1 font-medium">{fmtDateTime(booking.startAtUtc)}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4 sm:col-span-2">
              <div className="text-xs text-gray-500">{tr.end}</div>
              <div className="mt-1 font-medium">{fmtDateTime(booking.endAtUtc)}</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border bg-slate-50 p-5">
            <div className="text-sm font-semibold">{tr.clientReputation}</div>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-xs text-gray-500">{tr.rating}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 font-medium">
                  <span>{ratingText} / 5</span>
                  {renderRatingStars(clientSummary?.ratingAvg)}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-4">
                <div className="text-xs text-gray-500">{tr.reviews}</div>
                <div className="mt-1 font-medium">{reviewsCount}</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {recentReviews.length === 0 ? (
                <div className="rounded-2xl border bg-white p-4 text-sm text-slate-600">
                  {tr.noReviews}
                </div>
              ) : (
                recentReviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="font-medium">{review.authorDisplayName}</div>
                      <div className="text-sm text-slate-500">{fmtDateTime(review.createdAt)}</div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium">
                      <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                      <span className="text-slate-500">{review.rating} / 5</span>
                    </div>

                    <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {review.comment?.trim() || tr.withoutComment}
                    </div>

                    {review.replyComment && (
                      <div className="mt-3 rounded-2xl border bg-slate-50 p-4">
                        <div className="text-xs text-slate-500">{tr.reply}</div>
                        <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                          {review.replyComment}
                        </div>
                        {review.repliedAt && (
                          <div className="mt-2 text-xs text-slate-500">
                            {fmtDateTime(review.repliedAt)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border bg-blue-50 p-4 text-sm text-slate-900">
            {tr.refundNote}
          </div>

          {!canOpenVideo && (
            <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
              {tr.videoLocked}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-900">
              {success}
            </div>
          )}

          {error && booking && (
            <div className="mt-4 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
              <b>Error:</b> {error}
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold">{tr.operations}</div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href={`/pro/bookings/${booking.id}/chat`}
                className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
              >
                {tr.openChat}
              </Link>

              <Link
                href={canOpenVideo ? `/pro/bookings/${booking.id}/video` : "#"}
                aria-disabled={!canOpenVideo}
                className={`inline-flex justify-center rounded-2xl px-5 py-3 ${
                  canOpenVideo
                    ? "border hover:bg-gray-50"
                    : "pointer-events-none cursor-not-allowed border bg-slate-100 text-slate-400"
                }`}
              >
                {tr.openVideo}
              </Link>

              {canCancel && (
                <button
                  type="button"
                  onClick={cancelBooking}
                  disabled={canceling}
                  className="rounded-2xl bg-black py-3 text-white disabled:opacity-50"
                >
                  {canceling ? tr.cancelling : tr.cancel}
                </button>
              )}
            </div>
          </div>
        </div>

        {canReview && <ReviewFormCard bookingId={booking.id} lang={lang} targetRole="CLIENT" />}
      </div>
    </main>
  );
}
