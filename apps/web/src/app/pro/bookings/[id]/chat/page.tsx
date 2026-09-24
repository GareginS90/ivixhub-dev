"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";
import BookingChatClient from "@/components/chat/BookingChatClient";

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
    back: "← Назад к брони психолога",
    loadError: "Не удалось загрузить брони психолога.",
    openBooking: "Открыть бронь",
    openVideo: "Открыть видео"
  },
  en: {
    back: "← Back to psychologist booking",
    loadError: "Failed to load psychologist bookings.",
    openBooking: "Open booking",
    openVideo: "Open video"
  },
  hy: {
    back: "← Վերադառնալ հոգեբանի ամրագրմանը",
    loadError: "Չհաջողվեց բեռնել հոգեբանի ամրագրումները։",
    openBooking: "Բացել ամրագրումը",
    openVideo: "Բացել վիդեոն"
  }
} as const;

function isClosedStatus(status: string | undefined) {
  const s = (status || "").toUpperCase();
  return s === "CANCELLED_BY_CLIENT" || s === "CANCELLED_BY_PSYCHOLOGIST" || s === "EXPIRED_PAYMENT" || s === "COMPLETED";
}

export default function ProBookingChatPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params?.id || "";
  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/pro/bookings", { cache: "no-store" as any });
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
      }
    })();
  }, [bookingId, tr.loadError]);

  const isClosed = useMemo(() => isClosedStatus(booking?.status), [booking?.status]);
  const canOpenVideo = useMemo(() => {
    if (!booking) return false;
    return booking.status === "CONFIRMED" || booking.status === "COMPLETED";
  }, [booking]);

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-4xl">
        <Link href={`/pro/bookings/${bookingId}`} className="text-sm text-gray-600 hover:text-black">
          {tr.back}
        </Link>

        {error && (
          <div className="mt-4 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/pro/bookings/${bookingId}`}
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.openBooking}
          </Link>

          <Link
            href={canOpenVideo ? `/pro/bookings/${bookingId}/video` : "#"}
            aria-disabled={!canOpenVideo}
            className={`inline-flex justify-center rounded-2xl px-5 py-3 ${
              canOpenVideo
                ? "border hover:bg-gray-50"
                : "pointer-events-none cursor-not-allowed border bg-slate-100 text-slate-400"
            }`}
          >
            {tr.openVideo}
          </Link>
        </div>

        <div className="mt-4">
          <BookingChatClient bookingId={bookingId} lang={lang} viewRole="PSYCHOLOGIST" isClosed={isClosed} />
        </div>
      </div>
    </main>
  );
}
