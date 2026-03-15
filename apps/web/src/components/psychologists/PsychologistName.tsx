"use client";

import { useEffect, useState } from "react";

type PublicPsychologistProfile = {
  psychologistId?: number;
  id?: number;
  displayName?: string;
};

export default function PsychologistName({
  psychologistId
}: {
  psychologistId: number;
}) {
  const [name, setName] = useState<string>(`Психолог #${psychologistId}`);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(`/api/psychologists/${psychologistId}`, {
          cache: "no-store" as any
        });

        if (!r.ok) return;

        const j = (await r.json()) as PublicPsychologistProfile;

        const resolved =
          j.displayName?.trim() ||
          `Психолог #${psychologistId}`;

        if (!cancelled) setName(resolved);
      } catch {
        // keep fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [psychologistId]);

  return <>{name}</>;
}
