"use client";

import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";

const FALLBACK: Record<Lang, string> = {
  ru: "Психолог",
  en: "Psychologist",
  hy: "Հոգեբան"
};

type ApiPsychologistResponse = {
  psychologistId?: number;
  displayName?: string | null;
  fullName?: string | null;
  name?: string | null;
};

export default function PsychologistName({
  psychologistId
}: {
  psychologistId: number;
}) {
  const [name, setName] = useState<string>(FALLBACK.ru);

  useEffect(() => {
    const lang = getUiLangFromCookie();
    setName(FALLBACK[lang]);

    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(`/api/psychologists/${psychologistId}`, {
          cache: "no-store"
        });

        if (!r.ok) {
          return;
        }

        const data = (await r.json()) as ApiPsychologistResponse;
        const resolved =
          data?.displayName?.trim() ||
          data?.fullName?.trim() ||
          data?.name?.trim() ||
          FALLBACK[getUiLangFromCookie()];

        if (!cancelled) {
          setName(resolved);
        }
      } catch {
        if (!cancelled) {
          setName(FALLBACK[getUiLangFromCookie()]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [psychologistId]);

  return <>{name}</>;
}
