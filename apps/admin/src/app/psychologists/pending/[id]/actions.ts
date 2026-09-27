"use server";

import { revalidatePath } from "next/cache";
import {
  adminFetch,
  type AdminPsychologistDecisionResponse
} from "@/lib/admin-api";

export async function approvePsychologist(psychologistId: number) {
  if (!Number.isInteger(psychologistId) || psychologistId <= 0) {
    throw new Error("Invalid psychologist ID");
  }

  await adminFetch<AdminPsychologistDecisionResponse>(
    `/api/admin/psychologists/${psychologistId}/approve`,
    {
      method: "POST"
    }
  );

  revalidatePath("/");
  revalidatePath("/psychologists/pending");
  revalidatePath(`/psychologists/pending/${psychologistId}`);
}

export async function rejectPsychologist(
  psychologistId: number,
  reason: string
) {
  if (!Number.isInteger(psychologistId) || psychologistId <= 0) {
    throw new Error("Invalid psychologist ID");
  }

  const normalizedReason = reason.trim();

  if (!normalizedReason) {
    throw new Error("Rejection reason is required");
  }

  if (normalizedReason.length > 1000) {
    throw new Error("Rejection reason is too long");
  }

  await adminFetch<AdminPsychologistDecisionResponse>(
    `/api/admin/psychologists/${psychologistId}/reject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reason: normalizedReason
      })
    }
  );

  revalidatePath("/");
  revalidatePath("/psychologists/pending");
  revalidatePath(`/psychologists/pending/${psychologistId}`);
}
