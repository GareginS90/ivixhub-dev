"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    title: "Удаление аккаунта",
    subtitle: "Аккаунт не удаляется мгновенно. Запрос отправляется модератору на рассмотрение.",
    reason: "Причина удаления",
    reasonPh: "Опишите причину удаления. Минимум 10 символов.",
    send: "Отправить запрос",
    sending: "Отправка...",
    back: "Назад",
    success: "Запрос на удаление аккаунта отправлен модератору.",
    pending: "У вас уже есть активный запрос на удаление.",
    fetchFailed: "Не удалось получить статус запроса на удаление.",
    authError: "Нужно снова войти в аккаунт.",
    genericError: "Не удалось отправить запрос. Попробуйте ещё раз.",
    error: "Ошибка"
  },
  en: {
    title: "Delete account",
    subtitle: "The account is not deleted immediately. A request is sent to a moderator for review.",
    reason: "Deletion reason",
    reasonPh: "Describe the deletion reason. Minimum 10 characters.",
    send: "Send request",
    sending: "Sending...",
    back: "Back",
    success: "Your account deletion request has been sent to the moderator.",
    pending: "You already have an active deletion request.",
    fetchFailed: "Failed to load deletion request status.",
    authError: "Please sign in again.",
    genericError: "Failed to send the request. Please try again.",
    error: "Error"
  },
  hy: {
    title: "Հաշվի հեռացում",
    subtitle: "Հաշիվը անմիջապես չի հեռացվում։ Հարցումը ուղարկվում է մոդերատորին դիտարկման համար։",
    reason: "Հեռացման պատճառ",
    reasonPh: "Նկարագրեք հեռացման պատճառը։ Առնվազն 10 նիշ։",
    send: "Ուղարկել հարցում",
    sending: "Ուղարկվում է...",
    back: "Հետ",
    success: "Հաշվի հեռացման հարցումը ուղարկվել է մոդերատորին։",
    pending: "Դուք արդեն ունեք ակտիվ հեռացման հարցում։",
    fetchFailed: "Չհաջողվեց ստանալ հեռացման հարցման կարգավիճակը։",
    authError: "Պետք է նորից մուտք գործել հաշիվ։",
    genericError: "Չհաջողվեց ուղարկել հարցումը։ Փորձեք կրկին։",
    error: "Սխալ"
  }
} as const;

type Lang = keyof typeof TXT;

type DeletionResponse = {
  id: number;
  role: string;
  reason: string;
  status: string;
  createdAt: string | null;
  reviewedAt: string | null;
  reviewedByUserId: number | null;
  decisionNote: string | null;
} | null;

function friendlyError(payload: any, tr: (typeof TXT)[Lang]) {
  const message = payload?.message || "";
  const details = payload?.details || "";
  const all = `${message} ${details}`;

  if (all.includes("Authentication required")) return tr.authError;
  if (all.includes("relation") && all.includes("account_deletion_requests")) return tr.genericError;
  if (message) return message;
  return tr.genericError;
}

export default function ClientDeleteAccountPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [existing, setExisting] = useState<DeletionResponse>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();
    const timer = window.setInterval(syncLang, 700);
    return () => window.clearInterval(timer);
  }, []);

  const tr = TXT[lang];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const r = await fetch("/api/account-deletion/me", { cache: "no-store" as any });
        const j = await r.json().catch(() => null);

        if (!r.ok) {
          setError(friendlyError(j, tr));
          return;
        }

        setExisting(j);
      } catch (e: any) {
        setError(e?.message || tr.fetchFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [tr.fetchFailed]);

  async function submit() {
    setError(null);
    setSuccess(null);

    if (reason.trim().length < 10) {
      setError(tr.reasonPh);
      return;
    }

    setSending(true);
    try {
      const r = await fetch("/api/account-deletion/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(friendlyError(j, tr));
        return;
      }

      setExisting(j);
      setSuccess(tr.success);
    } catch (e: any) {
      setError(e?.message || tr.genericError);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">IvixHUB</div>
        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{tr.subtitle}</p>

        {!loading && existing?.status === "PENDING" && (
          <div className="mt-6 rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
            {tr.pending}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border bg-green-50 p-4 text-sm text-green-800">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
            <b>{tr.error}:</b> {error}
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">{tr.reason}</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={6}
            placeholder={tr.reasonPh}
            className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 resize-none"
            disabled={existing?.status === "PENDING"}
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={sending || existing?.status === "PENDING"}
            className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90 disabled:opacity-50"
          >
            {sending ? tr.sending : tr.send}
          </button>

          <Link
            href="/app"
            className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
          >
            {tr.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
