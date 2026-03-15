"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    brand: "IvixHUB",
    title: "Подтверждение аккаунта",
    subtitle:
      "Чтобы продолжить работу с платформой, необходимо подтвердить телефон и принять правила.",
    phone: "Телефон",
    phonePlaceholder: "+374...",
    code: "Код подтверждения",
    codePlaceholder: "Введите код",
    send: "Отправить код",
    verify: "Подтвердить",
    sending: "Отправка...",
    verifying: "Проверка...",
    error: "Ошибка",
    done: "Телефон успешно подтверждён",
    sent: "Код отправлен на ваш номер",
    resendHint: "Проверьте SMS или backend mock log.",
    phoneConflict:
      "Этот номер уже привязан к другому аккаунту. Войдите в существующий аккаунт или используйте восстановление доступа.",
    recovery: "Восстановление доступа",
    login: "Войти",
    genericSendError: "Не удалось отправить код. Попробуйте ещё раз.",
    genericVerifyError: "Не удалось подтвердить номер. Попробуйте ещё раз."
  },
  en: {
    brand: "IvixHUB",
    title: "Account verification",
    subtitle:
      "To continue using the platform, please verify your phone and accept the platform rules.",
    phone: "Phone",
    phonePlaceholder: "+374...",
    code: "Verification code",
    codePlaceholder: "Enter code",
    send: "Send code",
    verify: "Verify",
    sending: "Sending...",
    verifying: "Verifying...",
    error: "Error",
    done: "Phone verified successfully",
    sent: "The code has been sent to your phone number",
    resendHint: "Check SMS or backend mock log.",
    phoneConflict:
      "This phone number is already linked to another account. Sign in to the existing account or use account recovery.",
    recovery: "Account recovery",
    login: "Sign in",
    genericSendError: "Failed to send the code. Please try again.",
    genericVerifyError: "Failed to verify the phone number. Please try again."
  },
  hy: {
    brand: "IvixHUB",
    title: "Հաշվի հաստատում",
    subtitle:
      "Հարթակը օգտագործելու համար անհրաժեշտ է հաստատել հեռախոսահամարը և ընդունել կանոնները։",
    phone: "Հեռախոս",
    phonePlaceholder: "+374...",
    code: "Հաստատման կոդ",
    codePlaceholder: "Մուտքագրեք կոդը",
    send: "Ուղարկել կոդը",
    verify: "Հաստատել",
    sending: "Ուղարկվում է...",
    verifying: "Ստուգվում է...",
    error: "Սխալ",
    done: "Հեռախոսահամարը հաստատված է",
    sent: "Կոդը ուղարկվել է ձեր համարին",
    resendHint: "Ստուգեք SMS-ը կամ backend mock log-ը։",
    phoneConflict:
      "Այս համարը արդեն կապված է մեկ այլ հաշվի հետ։ Մուտք գործեք առկա հաշիվ կամ օգտագործեք հասանելիության վերականգնումը։",
    recovery: "Հասանելիության վերականգնում",
    login: "Մուտք",
    genericSendError: "Չհաջողվեց ուղարկել կոդը։ Փորձեք կրկին։",
    genericVerifyError: "Չհաջողվեց հաստատել համարը։ Փորձեք կրկին։"
  }
} as const;

type Lang = keyof typeof TXT;

function extractRaw(payload: any) {
  const message = payload?.message || "";
  const details = payload?.details || "";
  return `${message} ${details}`.trim();
}

function friendlyStartError(payload: any, tr: (typeof TXT)[Lang]) {
  const raw = extractRaw(payload);

  if (raw.includes("already linked to another account")) return tr.phoneConflict;
  if (raw.includes("Phone start failed") && raw.includes("already linked to another account")) return tr.phoneConflict;
  if (raw.includes("Phone must be in international format")) return raw;
  if (raw.includes("Phone is required")) return raw;

  return tr.genericSendError;
}

function friendlyVerifyError(payload: any, tr: (typeof TXT)[Lang]) {
  const raw = extractRaw(payload);

  if (raw.includes("already linked to another account")) return tr.phoneConflict;
  if (raw.includes("Invalid code")) return raw;
  if (raw.includes("Code expired")) return raw;
  if (raw.includes("No active code")) return raw;
  if (raw.includes("No attempts left")) return raw;
  if (raw.includes("Phone must be in international format")) return raw;
  if (raw.includes("Phone is required")) return raw;

  return tr.genericVerifyError;
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();

    const onFocus = () => syncLang();
    const onVisible = () => {
      if (document.visibilityState === "visible") syncLang();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(syncLang, 700);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, []);

  const tr = TXT[lang];
  const next = useMemo(() => searchParams.get("next") || "/app", [searchParams]);

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  async function sendCode() {
    if (!phone) return;

    setSending(true);
    setError(null);
    setSent(false);
    setShowRecovery(false);

    try {
      const r = await fetch("/api/phone/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const msg = friendlyStartError(j, tr);
        setError(msg);
        if (msg === tr.phoneConflict) setShowRecovery(true);
        return;
      }

      setSent(true);
    } catch (e: any) {
      setError(e?.message || tr.genericSendError);
    } finally {
      setSending(false);
    }
  }

  async function verify() {
    if (!phone || !code) return;

    setVerifying(true);
    setError(null);
    setShowRecovery(false);

    try {
      const r = await fetch("/api/phone/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, code })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const msg = friendlyVerifyError(j, tr);
        setError(msg);
        if (msg === tr.phoneConflict) setShowRecovery(true);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(next);
        router.refresh();
      }, 1200);
    } catch (e: any) {
      setError(e?.message || tr.genericVerifyError);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">{tr.brand}</div>

        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">{tr.subtitle}</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">{tr.phone}</label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={tr.phonePlaceholder}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <button
            onClick={sendCode}
            disabled={sending}
            className="w-full rounded-2xl border px-4 py-3 hover:bg-gray-50"
          >
            {sending ? tr.sending : tr.send}
          </button>

          {sent && (
            <div className="rounded-2xl border bg-green-50 p-4 text-sm text-green-800">
              <div>{tr.sent}</div>
              <div className="mt-1 text-green-700">{tr.resendHint}</div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">{tr.code}</label>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={tr.codePlaceholder}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          {error && (
            <div className="rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
              <b>{tr.error}:</b> {error}
            </div>
          )}

          {showRecovery && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/login"
                className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
              >
                {tr.login}
              </Link>
              <Link
                href="/auth/recovery"
                className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
              >
                {tr.recovery}
              </Link>
            </div>
          )}

          {success && (
            <div className="rounded-2xl border bg-green-50 p-4 text-sm text-green-800">
              {tr.done}
            </div>
          )}

          <button
            onClick={verify}
            disabled={verifying}
            className="w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
          >
            {verifying ? tr.verifying : tr.verify}
          </button>
        </div>
      </div>
    </main>
  );
}
