"use client";

import { useState, useTransition } from "react";
import { approvePsychologist, rejectPsychologist } from "@/app/psychologists/pending/[id]/actions";
import { adminT, type AdminLang } from "@/lib/admin-i18n";

type ModerationActionsProps = {
  psychologistId: number;
  lang: AdminLang;
};

export default function ModerationActions({
  psychologistId,
  lang
}: ModerationActionsProps) {
  const tr = adminT(lang);

  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onApprove() {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await approvePsychologist(psychologistId);
        setSuccess(tr.approvedSuccess);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Approve failed");
      }
    });
  }

  function onReject() {
    const trimmed = reason.trim();

    if (!trimmed) {
      setError(tr.rejectReasonRequired);
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await rejectPsychologist(psychologistId, trimmed);
        setSuccess(tr.rejectedSuccess);
        setReason("");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Reject failed");
      }
    });
  }

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{tr.moderationActions}</h2>

      {error && (
        <div className="mt-4 rounded-2xl border bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onApprove}
          disabled={isPending}
          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? tr.processing : tr.approve}
        </button>
      </div>

      <div className="mt-6 rounded-3xl border bg-slate-50 p-4">
        <div className="text-sm font-medium text-slate-900">{tr.rejectApplication}</div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder={tr.rejectReasonPlaceholder}
          className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />

        <button
          type="button"
          onClick={onReject}
          disabled={isPending || !reason.trim()}
          className="mt-3 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? tr.processing : tr.reject}
        </button>
      </div>
    </div>
  );
}
