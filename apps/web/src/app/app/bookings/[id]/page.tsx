"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";
import PsychologistName from "@/components/psychologists/PsychologistName";

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
  ru: {
    back: "← Назад",
    title: "Бронь",
    psychologist: "Психолог",
    start: "Начало",
    end: "Конец",
    type: "Тип",
    language: "Язык",
    status: "Статус",
    cancelPolicy: "Правила отмены",
    p1: "Бесплатная отмена не позднее чем за 24 часа до начала сессии.",
    p2: "Если осталось меньше 24 часов, отмена невозможна.",
    cancel: "Отменить бронь",
    cancelling: "Отмена…",
    openCatalog: "Открыть каталог",
    notFound: "Бронь не найдена.",
    loadError: "Не удалось загрузить бронь.",
    tooLate: "Отмена недоступна: до сессии меньше 24 часов.",
    cancelledOk: "Бронь успешно отменена. Возвращаем вас в личный кабинет…"
  },
  en: {
    back: "← Back",
    title: "Booking",
    psychologist: "Psychologist",
    start: "Start",
    end: "End",
    type: "Type",
    language: "Language",
    status: "Status",
    cancelPolicy: "Cancellation policy",
    p1: "Free cancellation up to 24 hours before the session start.",
    p2: "If less than 24 hours remain, cancellation is not available.",
    cancel: "Cancel booking",
    cancelling: "Cancelling…",
    openCatalog: "Open catalog",
    notFound: "Booking not found.",
    loadError: "Failed to load booking.",
    tooLate: "Cancellation unavailable: less than 24 hours remain.",
    cancelledOk: "Booking cancelled successfully. Redirecting you to your dashboard…"
  },
  hy: {
    back: "← Հետ",
    title: "Ամրագրում",
    psychologist: "Հոգեբան",
    start: "Սկիզբ",
    end: "Ավարտ",
    type: "Տեսակ",
    language: "Լեզու",
    status: "Կարգավիճակ",
    cancelPolicy: "Չեղարկման կանոններ",
    p1: "Անվճար չեղարկում՝ սեանսից 24 ժամ առաջ։",
    p2: "Եթե մնացել է 24 ժամից քիչ, չեղարկումը հասանելի չէ։",
    cancel: "Չեղարկել ամրագրումը",
    cancelling: "Չեղարկվում է…",
    openCatalog: "Բացել կատալոգը",
    notFound: "Ամրագրումը չի գտնվել։",
    loadError: "Չհաջողվեց բեռնել ամրագրումը։",
    tooLate: "Չեղարկումը հասանելի չէ․ մնացել է 24 ժամից քիչ։",
    cancelledOk: "Ամրագրումը հաջողությամբ չեղարկվեց։ Վերադարձնում ենք անձնական էջ…"
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

export default function BookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookingId = params?.id;

  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/bookings/my", { cache: "no-store" as any });
        if (!r.ok) {
          setError(tr.loadError);
          return;
        }
        const data = await r.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((x: Booking) => String(x.id) === String(bookingId)) || null;
        setBooking(found);
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
      router.push("/app");
      router.refresh();
    }, 2000);

    return () => clearTimeout(timer);
  }, [success, router]);

  const hoursUntilStart = useMemo(() => {
    if (!booking) return null;
    const diffMs = new Date(booking.startAtUtc).getTime() - Date.now();
    return diffMs / (1000 * 60 * 60);
  }, [booking]);

  const canCancel = useMemo(() => {
    if (!booking) return false;
    if (booking.status === "CANCELLED" || booking.status === "CANCELLED_BY_CLIENT" || booking.status === "CANCELLED_BY_PSYCHOLOGIST") {
      return false;
    }
    if (hoursUntilStart == null) return false;
    return hoursUntilStart >= 24;
  }, [booking, hoursUntilStart]);

  async function cancelBooking() {
    if (!bookingId || !canCancel || canceling) return;
    setCanceling(true);
    setError(null);
    setSuccess(null);

    try {
      const r = await fetch(`/api/bookings/cancel/${bookingId}`, { method: "POST" });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Cancel failed");
        return;
      }

      setBooking(j);
      setSuccess(tr.cancelledOk);
    } catch (e: any) {
      setError(e?.message || "Cancel failed");
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6">Loading…</div>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-red-50 p-6 text-red-800 text-sm">
          <b>Error:</b> {error}
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 text-sm text-gray-700">
          {tr.notFound}
          <div className="mt-4">
            <Link href="/psychologists" className="rounded-xl border px-4 py-2 hover:bg-gray-50">
              {tr.openCatalog}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/app" className="text-sm text-gray-600 hover:text-black">{tr.back}</Link>

        <div className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{tr.title} #{booking.id}</h1>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">{tr.psychologist}</div>
              <div className="mt-1 font-medium">
                <PsychologistName psychologistId={booking.psychologistId} />
              </div>
            </div>
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">{tr.status}</div>
              <div className="mt-1 font-medium">{booking.status}</div>
            </div>
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">{tr.start}</div>
              <div className="mt-1 font-medium">{fmtDateTime(booking.startAtUtc)}</div>
            </div>
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">{tr.end}</div>
              <div className="mt-1 font-medium">{fmtDateTime(booking.endAtUtc)}</div>
            </div>
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">{tr.type}</div>
              <div className="mt-1 font-medium">{booking.type}</div>
            </div>
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">{tr.language}</div>
              <div className="mt-1 font-medium">{booking.language || "—"}</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm text-sm">
            <div className="font-semibold">{tr.cancelPolicy}</div>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              <li>{tr.p1}</li>
              <li>{tr.p2}</li>
            </ul>
          </div>

          {hoursUntilStart != null && hoursUntilStart < 24 && booking.status !== "CANCELLED" && booking.status !== "CANCELLED_BY_CLIENT" && booking.status !== "CANCELLED_BY_PSYCHOLOGIST" && (
            <div className="mt-4 rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
              {tr.tooLate}
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

          {booking.status !== "CANCELLED" && booking.status !== "CANCELLED_BY_CLIENT" && booking.status !== "CANCELLED_BY_PSYCHOLOGIST" && (
            <button
              onClick={cancelBooking}
              disabled={!canCancel || canceling}
              className="mt-6 w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
            >
              {canceling ? tr.cancelling : tr.cancel}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
