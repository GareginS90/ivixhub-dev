"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";
import VideoSessionClient from "@/components/sessions/VideoSessionClient";

const TXT = {
  ru: {
    back: "← Назад к брони психолога"
  },
  en: {
    back: "← Back to psychologist booking"
  },
  hy: {
    back: "← Վերադառնալ հոգեբանի ամրագրմանը"
  }
} as const;

export default function ProBookingVideoPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params?.id || "";
  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-4xl">
        <Link href={`/pro`} className="text-sm text-gray-600 hover:text-black">
          {tr.back}
        </Link>

        <div className="mt-4">
          <VideoSessionClient
            bookingId={bookingId}
            lang={lang}
            role="PSYCHOLOGIST"
          />
        </div>
      </div>
    </main>
  );
}
