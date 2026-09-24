"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";
import VideoRoomShell from "@/components/sessions/VideoRoomShell";

const TXT = {
  ru: {
    backClient: "← Назад к брони клиента",
    backPro: "← Назад к брони психолога"
  },
  en: {
    backClient: "← Back to client booking",
    backPro: "← Back to psychologist booking"
  },
  hy: {
    backClient: "← Վերադառնալ հաճախորդի ամրագրմանը",
    backPro: "← Վերադառնալ հոգեբանի ամրագրմանը"
  }
} as const;

export default function VideoRoomPage() {
  const params = useParams<{ bookingId: string }>();
  const searchParams = useSearchParams();

  const bookingId = params?.bookingId || "";
  const role = (searchParams.get("role") || "client").toLowerCase() === "psychologist"
    ? "psychologist"
    : "client";

  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const backHref =
    role === "psychologist"
      ? `/pro/bookings/${bookingId}/video`
      : `/app/bookings/${bookingId}/video`;

  const backText =
    role === "psychologist"
      ? tr.backPro
      : tr.backClient;

  return (
    <main className="min-h-screen bg-[#f6f9ff] p-6">
      <div className="mx-auto max-w-6xl">
        <Link href={backHref} className="text-sm text-gray-600 hover:text-black">
          {backText}
        </Link>

        <div className="mt-4">
          <VideoRoomShell
            bookingId={bookingId}
            role={role}
            lang={lang}
          />
        </div>
      </div>
    </main>
  );
}
