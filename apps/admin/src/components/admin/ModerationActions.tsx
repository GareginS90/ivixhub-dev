"use client";

import { useState, useTransition } from "react";
import {
  approvePsychologist,
  rejectPsychologist
} from "@/app/psychologists/pending/[id]/actions";
import { adminT, type AdminLang } from "@/lib/admin-i18n";

type ModerationActionsProps = {
  psychologistId: number;
  lang: AdminLang;
};

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 3 19 6v5c0 4.5-2.7 8-7 10-4.3-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RejectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m9 9 6 6m0-6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-20"
      />
      <path
        d="M20 12a8 8 0 0 0-8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
    <div className="xl:sticky xl:top-6">
      <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_16px_45px_rgba(7,63,67,.07)]">
        <div className="relative overflow-hidden border-b border-[#073f43]/7 px-5 py-5 sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 90% 0%, rgba(18,184,196,.12), transparent 42%), radial-gradient(circle at 100% 100%, rgba(118,87,223,.08), transparent 40%)"
            }}
          />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
              <ShieldCheckIcon />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                {tr.moderationActions}
              </h2>
              <div className="mt-0.5 text-xs font-medium text-[#789092]">
                #{psychologistId} · IviXHub verification
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3.5 text-sm text-rose-800">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                <RejectIcon />
              </div>
              <div className="pt-1">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <CheckIcon />
              </div>
              <div className="pt-1">{success}</div>
            </div>
          )}

          <div className="rounded-[22px] border border-[#078b7b]/12 bg-[#f4fbfa] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e2f6f3] text-[#078b7b]">
                <CheckIcon />
              </div>

              <div>
                <div className="text-sm font-semibold text-[#073f43]">
                  {tr.approve}
                </div>
                <p className="mt-1 text-xs leading-5 text-[#607d80]">
                  Confirm the application after reviewing the profile and submitted documents.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onApprove}
              disabled={isPending}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#078b7b] to-[#0aa99a] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,139,123,.20)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(7,139,123,.25)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              {isPending ? <SpinnerIcon /> : <CheckIcon />}
              {isPending ? tr.processing : tr.approve}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#073f43]/7" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a0b0b1]">
              OR
            </span>
            <div className="h-px flex-1 bg-[#073f43]/7" />
          </div>

          <div className="rounded-[22px] border border-rose-200/60 bg-rose-50/45 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <RejectIcon />
              </div>

              <div>
                <div className="text-sm font-semibold text-[#073f43]">
                  {tr.rejectApplication}
                </div>
                <p className="mt-1 text-xs leading-5 text-[#789092]">
                  Add a clear moderation reason before rejecting the application.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder={tr.rejectReasonPlaceholder}
                className="w-full resize-none rounded-2xl border border-[#073f43]/10 bg-white px-4 py-3 text-sm leading-6 text-[#073f43] outline-none transition placeholder:text-[#a0b0b1] focus:border-rose-300 focus:ring-4 focus:ring-rose-100/70"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#91a3a5]">
                  <InfoIcon />
                  {tr.rejectReasonRequired}
                </div>

                <div className="text-[11px] font-medium tabular-nums text-[#91a3a5]">
                  {reason.length}/1000
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onReject}
              disabled={isPending || !reason.trim()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-600 hover:text-white hover:shadow-[0_10px_24px_rgba(225,29,72,.16)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-white disabled:text-rose-300 disabled:shadow-none"
            >
              {isPending ? <SpinnerIcon /> : <RejectIcon />}
              {isPending ? tr.processing : tr.reject}
            </button>
          </div>
        </div>
      </section>

      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#073f43]/7 bg-white/70 px-4 py-3 text-xs leading-5 text-[#789092]">
        <span className="mt-0.5 text-[#078b7b]">
          <InfoIcon />
        </span>
        <span>
          IviXHub moderation actions are recorded in the administration audit log.
        </span>
      </div>
    </div>
  );
}
