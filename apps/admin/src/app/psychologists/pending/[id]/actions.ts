"use server";

import { revalidatePath } from "next/cache";

const base = process.env.IVIXHUB_API_BASE_URL;

function ensureBase() {
  if (!base) {
    throw new Error("IVIXHUB_API_BASE_URL is not set in apps/admin");
  }
  return base;
}

export async function approvePsychologist(psychologistId: number) {
  const apiBase = ensureBase();

  const response = await fetch(
    `${apiBase}/api/admin/psychologists/${psychologistId}/approve`,
    {
      method: "POST",
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Approve failed");
  }

  revalidatePath("/");
  revalidatePath("/psychologists/pending");
  revalidatePath(`/psychologists/pending/${psychologistId}`);
}

export async function rejectPsychologist(
  psychologistId: number,
  reason: string
) {
  const apiBase = ensureBase();

  const response = await fetch(
    `${apiBase}/api/admin/psychologists/${psychologistId}/reject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reason }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Reject failed");
  }

  revalidatePath("/");
  revalidatePath("/psychologists/pending");
  revalidatePath(`/psychologists/pending/${psychologistId}`);
}
