"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type AuthRole = "CLIENT" | "PSYCHOLOGIST";
type Step = "REQUEST" | "VERIFY" | "RESET" | "DONE";

const TXT = {
  ru: {
    title: "Восстановление доступа",
    subtitleClient: "Восстановите доступ к клиентскому аккаунту через подтверждённый номер телефона.",
    subtitlePsychologist: "Восстановите доступ к аккаунту психолога через подтверждённый номер телефона.",
    phone: "Телефон",
    phonePlaceholder: "+374...",
    code: "Код подтверждения",
    codePlaceholder: "Введите код из SMS",
    password: "Новый пароль",
    passwordPlaceholder: "Введите новый пароль",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Повторите новый пароль",
    request: "Отправить код",
    requesting: "Отправка...",
    verify: "Проверить код",
    verifying: "Проверка...",
    reset: "Сохранить новый пароль",
    resetting: "Сохранение...",
    done: "Пароль успешно обновлён",
    doneText: "Теперь вы можете войти в аккаунт с новым паролем.",
    toLoginClient: "Перейти ко входу клиента",
    toLoginPsychologist: "Перейти ко входу психолога",
    backHome: "На главную",
    sent: "Если номер найден и доступен для восстановления, код уже отправлен.",
    invalidPhone: "Введите телефон в международном формате, например +374XXXXXXXX",
    invalidCode: "Введите корректный код.",
    mismatch: "Пароли не совпадают.",
    invalidPassword: "Пароль должен содержать минимум 8 символов, букву, цифру и спецсимвол.",
    genericError: "Не удалось выполнить операцию. Попробуйте ещё раз.",
    expired: "Срок действия кода или сессии восстановления истёк. Запросите новый код.",
    noActiveCode: "Сначала запросите новый код восстановления.",
    invalidRecoveryCode: "Неверный код восстановления.",
    noAttempts: "Попытки закончились. Запросите новый код.",
    recoveryUnavailable: "Восстановление недоступно для этого номера.",
    step1: "Шаг 1. Номер телефона",
    step2: "Шаг 2. Проверка кода",
    step3: "Шаг 3. Новый пароль",
    step4: "Готово"
  },
  en: {
    title: "Recover access",
    subtitleClient: "Recover access to your client account via the verified phone number.",
    subtitlePsychologist: "Recover access to your psychologist account via the verified phone number.",
    phone: "Phone",
    phonePlaceholder: "+374...",
    code: "Verification code",
    codePlaceholder: "Enter the SMS code",
    password: "New password",
    passwordPlaceholder: "Enter new password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Repeat new password",
    request: "Send code",
    requesting: "Sending...",
    verify: "Verify code",
    verifying: "Verifying...",
    reset: "Save new password",
    resetting: "Saving...",
    done: "Password updated successfully",
    doneText: "You can now sign in with your new password.",
    toLoginClient: "Go to client sign in",
    toLoginPsychologist: "Go to psychologist sign in",
    backHome: "Home",
    sent: "If the number exists and recovery is available, the code has been sent already.",
    invalidPhone: "Enter the phone number in international format, for example +374XXXXXXXX",
    invalidCode: "Enter a valid code.",
    mismatch: "Passwords do not match.",
    invalidPassword: "Password must contain at least 8 characters, one letter, one digit, and one special symbol.",
    genericError: "Operation failed. Please try again.",
    expired: "The recovery code or session has expired. Request a new code.",
    noActiveCode: "Request a new recovery code first.",
    invalidRecoveryCode: "Invalid recovery code.",
    noAttempts: "No attempts left. Request a new code.",
    recoveryUnavailable: "Recovery is not available for this phone number.",
    step1: "Step 1. Phone number",
    step2: "Step 2. Verify code",
    step3: "Step 3. New password",
    step4: "Done"
  },
  hy: {
    title: "Հասանելիության վերականգնում",
    subtitleClient: "Վերականգնեք հաճախորդի հաշվի հասանելիությունը հաստատված հեռախոսահամարի միջոցով։",
    subtitlePsychologist: "Վերականգնեք հոգեբանի հաշվի հասանելիությունը հաստատված հեռախոսահամարի միջոցով։",
    phone: "Հեռախոս",
    phonePlaceholder: "+374...",
    code: "Հաստատման կոդ",
    codePlaceholder: "Մուտքագրեք SMS կոդը",
    password: "Նոր գաղտնաբառ",
    passwordPlaceholder: "Մուտքագրեք նոր գաղտնաբառը",
    confirmPassword: "Հաստատել գաղտնաբառը",
    confirmPasswordPlaceholder: "Կրկնեք նոր գաղտնաբառը",
    request: "Ուղարկել կոդը",
    requesting: "Ուղարկվում է...",
    verify: "Ստուգել կոդը",
    verifying: "Ստուգվում է...",
    reset: "Պահպանել նոր գաղտնաբառը",
    resetting: "Պահպանվում է...",
    done: "Գաղտնաբառը հաջողությամբ թարմացվեց",
    doneText: "Այժմ կարող եք մուտք գործել նոր գաղտնաբառով։",
    toLoginClient: "Մուտք հաճախորդի հաշվով",
    toLoginPsychologist: "Մուտք որպես հոգեբան",
    backHome: "Գլխավոր էջ",
    sent: "Եթե համարը գտնվել է և վերականգնումը հասանելի է, կոդն արդեն ուղարկվել է։",
    invalidPhone: "Մուտքագրեք հեռախոսահամարը միջազգային ձևաչափով, օրինակ +374XXXXXXXX",
    invalidCode: "Մուտքագրեք ճիշտ կոդ։",
    mismatch: "Գաղտնաբառերը չեն համընկնում։",
    invalidPassword: "Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, տառ, թիվ և հատուկ նշան։",
    genericError: "Չհաջողվեց կատարել գործողությունը։ Փորձեք կրկին։",
    expired: "Կոդի կամ վերականգնման սեսիայի ժամկետը սպառվել է։ Պահանջեք նոր կոդ։",
    noActiveCode: "Սկզբում պահանջեք վերականգնման նոր կոդ։",
    invalidRecoveryCode: "Սխալ վերականգնման կոդ։",
    noAttempts: "Փորձերը սպառվել են։ Պահանջեք նոր կոդ։",
    recoveryUnavailable: "Վերականգնումը հասանելի չէ այս համարի համար։",
    step1: "Քայլ 1. Հեռախոսահամար",
    step2: "Քայլ 2. Կոդի ստուգում",
    step3: "Քայլ 3. Նոր գաղտնաբառ",
    step4: "Պատրաստ է"
  }
} as const;

function isValidPassword(value: string) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,100}$/.test(value);
}

function mapRecoveryError(payload: any, tr: (typeof TXT)[Lang]) {
  const raw = [
    payload?.message,
    payload?.detail,
    payload?.title,
    payload?.details,
    payload?.error,
    payload?.errorCode
  ]
    .filter(Boolean)
    .join(" ");

  if (raw.includes("Phone must be in international format")) return tr.invalidPhone;
  if (raw.includes("Phone is required")) return tr.invalidPhone;
  if (raw.includes("Recovery code expired")) return tr.expired;
  if (raw.includes("Recovery session expired")) return tr.expired;
  if (raw.includes("No active recovery code")) return tr.noActiveCode;
  if (raw.includes("Invalid recovery code")) return tr.invalidRecoveryCode;
  if (raw.includes("No attempts left")) return tr.noAttempts;
  if (raw.includes("Recovery is not available for this phone number")) return tr.recoveryUnavailable;
  if (raw.includes("Invalid recovery token")) return tr.expired;
  if (raw.includes("Recovery verification is required")) return tr.noActiveCode;
  if (raw.includes("Password must contain")) return tr.invalidPassword;

  return tr.genericError;
}

export default function RecoveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("ru");
  const [step, setStep] = useState<Step>("REQUEST");

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();
    const timer = window.setInterval(syncLang, 700);
    return () => window.clearInterval(timer);
  }, []);

  const tr = TXT[lang];
  const isPsychologist = searchParams.get("role") === "psychologist";
  const role: AuthRole = isPsychologist ? "PSYCHOLOGIST" : "CLIENT";

  const subtitle = isPsychologist ? tr.subtitlePsychologist : tr.subtitleClient;
  const loginHref = isPsychologist ? "/auth/login?role=psychologist" : "/auth/login";
  const loginText = isPsychologist ? tr.toLoginPsychologist : tr.toLoginClient;

  const stepTitle = useMemo(() => {
    if (step === "REQUEST") return tr.step1;
    if (step === "VERIFY") return tr.step2;
    if (step === "RESET") return tr.step3;
    return tr.step4;
  }, [step, tr]);

  async function requestCode() {
    if (!phone.trim()) {
      setError(tr.invalidPhone);
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const r = await fetch("/api/auth/recovery/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(mapRecoveryError(j, tr));
        return;
      }

      setInfo(tr.sent);
      setStep("VERIFY");
    } catch {
      setError(tr.genericError);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    if (!code.trim()) {
      setError(tr.invalidCode);
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const r = await fetch("/api/auth/recovery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(mapRecoveryError(j, tr));
        return;
      }

      setRecoveryToken(j?.recoveryToken || "");
      setStep("RESET");
    } catch {
      setError(tr.genericError);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    if (!isValidPassword(password)) {
      setError(tr.invalidPassword);
      return;
    }

    if (password !== confirmPassword) {
      setError(tr.mismatch);
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const r = await fetch("/api/auth/recovery/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          recoveryToken,
          password
        })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(mapRecoveryError(j, tr));
        return;
      }

      setStep("DONE");
    } catch {
      setError(tr.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">IvixHUB</div>
        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{subtitle}</p>

        <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-sm">
          <div className="font-semibold">{stepTitle}</div>
        </div>

        {info && (
          <div className="mt-6 rounded-2xl border bg-blue-50 p-4 text-sm text-blue-900">
            {info}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {step === "REQUEST" && (
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">{tr.phone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tr.phonePlaceholder}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <button
              type="button"
              onClick={requestCode}
              disabled={loading}
              className="w-full rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? tr.requesting : tr.request}
            </button>
          </div>
        )}

        {step === "VERIFY" && (
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">{tr.phone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tr.phonePlaceholder}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.code}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={tr.codePlaceholder}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={verifyCode}
                disabled={loading}
                className="rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
              >
                {loading ? tr.verifying : tr.verify}
              </button>

              <button
                type="button"
                onClick={requestCode}
                disabled={loading}
                className="rounded-2xl border px-5 py-3 hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? tr.requesting : tr.request}
              </button>
            </div>
          </div>
        )}

        {step === "RESET" && (
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">{tr.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tr.passwordPlaceholder}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.confirmPassword}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={tr.confirmPasswordPlaceholder}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <button
              type="button"
              onClick={resetPassword}
              disabled={loading}
              className="w-full rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? tr.resetting : tr.reset}
            </button>
          </div>
        )}

        {step === "DONE" && (
          <div className="mt-8 rounded-2xl border bg-emerald-50 p-5 text-sm text-emerald-900">
            <div className="font-semibold">{tr.done}</div>
            <div className="mt-2">{tr.doneText}</div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push(loginHref)}
                className="inline-flex justify-center rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90"
              >
                {loginText}
              </button>

              <Link
                href="/"
                className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
              >
                {tr.backHome}
              </Link>
            </div>
          </div>
        )}

        {step !== "DONE" && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={loginHref}
              className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
            >
              {loginText}
            </Link>

            <Link
              href="/"
              className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
            >
              {tr.backHome}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
