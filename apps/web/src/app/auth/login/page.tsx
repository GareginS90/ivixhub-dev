"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "hy" | "ru" | "en";
type AuthRole = "CLIENT" | "PSYCHOLOGIST";

type LoginState = {
  email: string;
  password: string;
  showPassword: boolean;
  submitting: boolean;
  error: string | null;
};

const INITIAL_STATE: LoginState = {
  email: "",
  password: "",
  showPassword: false,
  submitting: false,
  error: null
};

const TXT = {
  hy: {
    eyebrow: "Բարի վերադարձ IviXHub",
    pageTitle: "Ընտրիր քո մուտքը",
    pageText:
      "Մեկ հարթակ՝ երկու հստակ աշխատանքային միջավայրով։ Մուտք գործիր որպես հոգեբան կամ հաճախորդ։",

    psychologistBadge: "Մասնագետների համար",
    psychologistTitle: "Հոգեբանի մուտք",
    psychologistText:
      "Կառավարիր մասնագիտական պրոֆիլը, հասանելի ժամերը և հանդիպումները մեկ անվտանգ միջավայրում։",
    psychologistPoint1: "Մասնագիտական պրոֆիլ և վերիֆիկացիա",
    psychologistPoint2: "Հասանելիություն և հանդիպումներ",
    psychologistSubmit: "Մուտք որպես հոգեբան",
    psychologistRegister: "Ստեղծել հոգեբանի հաշիվ",

    clientBadge: "Հաճախորդների համար",
    clientTitle: "Հաճախորդի մուտք",
    clientText:
      "Շարունակիր մասնագետի ընտրությունը, ամրագրումները և քո անձնական ճանապարհը IviXHub-ում։",
    clientPoint1: "Ամրագրումներ և առաջիկա հանդիպումներ",
    clientPoint2: "Անձնական ու գաղտնի միջավայր",
    clientSubmit: "Մուտք",
    clientRegister: "Ստեղծել հաշիվ",

    email: "Email",
    password: "Գաղտնաբառ",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Մուտքագրեք գաղտնաբառը",
    forgot: "Մոռացե՞լ եք գաղտնաբառը",
    show: "Ցույց տալ",
    hide: "Թաքցնել",
    submitting: "Մուտք է կատարվում...",
    noAccount: "Դեռ հաշիվ չունե՞ք",
    error: "Սխալ",
    failed: "Չհաջողվեց մուտք գործել։",
    invalidCredentials: "Սխալ email կամ գաղտնաբառ։",
    clientMismatch:
      "Այս հաշիվը գրանցված է որպես հաճախորդի հաշիվ։ Օգտագործեք հաճախորդի մուտքը։",
    psychologistMismatch:
      "Այս հաշիվը գրանցված է որպես հոգեբանի հաշիվ։ Օգտագործեք հոգեբանի մուտքը։"
  },

  ru: {
    eyebrow: "С возвращением в IviXHub",
    pageTitle: "Выберите свой вход",
    pageText:
      "Одна платформа с двумя понятными рабочими пространствами. Войдите как психолог или клиент.",

    psychologistBadge: "Для специалистов",
    psychologistTitle: "Вход психолога",
    psychologistText:
      "Управляйте профессиональным профилем, доступным временем и встречами в одной безопасной среде.",
    psychologistPoint1: "Профессиональный профиль и верификация",
    psychologistPoint2: "Доступность и встречи",
    psychologistSubmit: "Войти как психолог",
    psychologistRegister: "Создать аккаунт психолога",

    clientBadge: "Для клиентов",
    clientTitle: "Вход клиента",
    clientText:
      "Продолжите выбор специалиста, бронирования и свой личный путь внутри IviXHub.",
    clientPoint1: "Бронирования и предстоящие встречи",
    clientPoint2: "Личное и конфиденциальное пространство",
    clientSubmit: "Войти",
    clientRegister: "Создать аккаунт",

    email: "Email",
    password: "Пароль",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Введите пароль",
    forgot: "Забыли пароль?",
    show: "Показать",
    hide: "Скрыть",
    submitting: "Вход...",
    noAccount: "Ещё нет аккаунта?",
    error: "Ошибка",
    failed: "Не удалось выполнить вход.",
    invalidCredentials: "Неверный email или пароль.",
    clientMismatch:
      "Этот аккаунт зарегистрирован как клиентский. Используйте вход клиента.",
    psychologistMismatch:
      "Этот аккаунт зарегистрирован как аккаунт психолога. Используйте вход психолога."
  },

  en: {
    eyebrow: "Welcome back to IviXHub",
    pageTitle: "Choose your sign in",
    pageText:
      "One platform with two clear workspaces. Sign in as a psychologist or a client.",

    psychologistBadge: "For professionals",
    psychologistTitle: "Psychologist sign in",
    psychologistText:
      "Manage your professional profile, availability, and sessions from one secure workspace.",
    psychologistPoint1: "Professional profile and verification",
    psychologistPoint2: "Availability and sessions",
    psychologistSubmit: "Sign in as psychologist",
    psychologistRegister: "Create psychologist account",

    clientBadge: "For clients",
    clientTitle: "Client sign in",
    clientText:
      "Continue finding your specialist, managing bookings, and using your personal IviXHub space.",
    clientPoint1: "Bookings and upcoming sessions",
    clientPoint2: "Private and confidential space",
    clientSubmit: "Sign in",
    clientRegister: "Create account",

    email: "Email",
    password: "Password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter password",
    forgot: "Forgot password?",
    show: "Show",
    hide: "Hide",
    submitting: "Signing in...",
    noAccount: "Don't have an account yet?",
    error: "Error",
    failed: "Sign in failed.",
    invalidCredentials: "Invalid email or password.",
    clientMismatch:
      "This account is registered as a client account. Use client sign in.",
    psychologistMismatch:
      "This account is registered as a psychologist account. Use psychologist sign in."
  }
} as const;

function friendlyLoginError(
  payload: unknown,
  role: AuthRole,
  tr: (typeof TXT)[Lang]
) {
  if (!payload || typeof payload !== "object") {
    return tr.failed;
  }

  const p = payload as Record<string, unknown>;

  const parts = [
    p.message,
    p.detail,
    p.title,
    p.details,
    p.error,
    p.errorCode
  ].filter((value): value is string => typeof value === "string");

  const raw = parts.join(" ").trim();

  if (raw.includes("Invalid credentials")) {
    return tr.invalidCredentials;
  }

  if (
    raw.includes("registered as client") ||
    raw.includes("not psychologist")
  ) {
    return tr.clientMismatch;
  }

  if (
    raw.includes("registered as psychologist") ||
    raw.includes("not client")
  ) {
    return tr.psychologistMismatch;
  }

  return role === "CLIENT" || role === "PSYCHOLOGIST"
    ? tr.failed
    : tr.failed;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.6" />
      {hidden && <path d="m4 4 16 16" />}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

type LoginCardProps = {
  role: AuthRole;
  state: LoginState;
  setState: React.Dispatch<React.SetStateAction<LoginState>>;
  tr: (typeof TXT)[Lang];
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
    role: AuthRole
  ) => Promise<void>;
};

function LoginCard({
  role,
  state,
  setState,
  tr,
  onSubmit
}: LoginCardProps) {
  const psychologist = role === "PSYCHOLOGIST";

  const badge = psychologist
    ? tr.psychologistBadge
    : tr.clientBadge;

  const title = psychologist
    ? tr.psychologistTitle
    : tr.clientTitle;

  const description = psychologist
    ? tr.psychologistText
    : tr.clientText;

  const points = psychologist
    ? [tr.psychologistPoint1, tr.psychologistPoint2]
    : [tr.clientPoint1, tr.clientPoint2];

  const submitLabel = psychologist
    ? tr.psychologistSubmit
    : tr.clientSubmit;

  const registerLabel = psychologist
    ? tr.psychologistRegister
    : tr.clientRegister;

  const registerHref = psychologist
    ? "/auth/register?role=psychologist"
    : "/auth/register";

  const recoveryHref = psychologist
    ? "/auth/recovery?role=psychologist"
    : "/auth/recovery";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1.5 sm:p-8 ${
        psychologist
          ? "border-[#12b8c4]/18 hover:border-[#12b8c4]/38 hover:shadow-[0_26px_70px_rgba(18,184,196,0.15)]"
          : "border-[#3977e8]/14 hover:border-[#7657df]/30 hover:shadow-[0_26px_70px_rgba(89,92,210,0.14)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 transition duration-300 ${
          psychologist
            ? "bg-gradient-to-r from-[#078b7b] via-[#12b8c4] to-[#3977e8]"
            : "bg-gradient-to-r from-[#12b8c4] via-[#3977e8] to-[#7657df]"
        }`}
      />

      <div
        className={`pointer-events-none absolute -right-20 -top-20 size-52 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 ${
          psychologist
            ? "bg-[#12b8c4]/15"
            : "bg-[#7657df]/14"
        }`}
      />

      <div className="relative">
        <span
          className={`inline-flex rounded-full px-3.5 py-2 text-xs font-extrabold tracking-[0.08em] ${
            psychologist
              ? "bg-[#e9f9f6] text-[#078b7b]"
              : "bg-[#f0f3ff] text-[#5367ca]"
          }`}
        >
          {badge}
        </span>

        <h2 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#073f43] sm:text-[1.8rem]">
          {title}
        </h2>

        <p className="mt-3 min-h-[56px] text-[15px] leading-7 text-[#607172]">
          {description}
        </p>

        <div className="mt-5 space-y-2.5">
          {points.map((point) => (
            <div
              key={point}
              className="flex items-start gap-2.5 text-sm font-semibold leading-6 text-[#526d6f]"
            >
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                  psychologist
                    ? "bg-[#e7f8f5] text-[#078b7b]"
                    : "bg-[#eef1ff] text-[#5867c9]"
                }`}
              >
                <CheckIcon />
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={(event) => onSubmit(event, role)}
          autoComplete="on"
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor={`${role.toLowerCase()}-email`}
              className="mb-2 block text-sm font-bold text-[#274f51]"
            >
              {tr.email}
            </label>

            <input
              id={`${role.toLowerCase()}-email`}
              type="email"
              name={`${role.toLowerCase()}-email`}
              autoComplete="email"
              value={state.email}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  email: event.target.value,
                  error: null
                }))
              }
              placeholder={tr.emailPlaceholder}
              required
              className="h-13 w-full rounded-2xl border border-[#073f43]/13 bg-[#fbfdfd] px-4 text-[15px] text-[#073f43] outline-none transition duration-200 placeholder:text-[#93a4a5] hover:border-[#12b8c4]/28 focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor={`${role.toLowerCase()}-password`}
                className="block text-sm font-bold text-[#274f51]"
              >
                {tr.password}
              </label>

              <Link
                href={recoveryHref}
                className="text-right text-xs font-bold text-[#6d7f80] transition hover:text-[#078b7b]"
              >
                {tr.forgot}
              </Link>
            </div>

            <div className="relative">
              <input
                id={`${role.toLowerCase()}-password`}
                type={state.showPassword ? "text" : "password"}
                name={`${role.toLowerCase()}-password`}
                autoComplete="current-password"
                value={state.password}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    password: event.target.value,
                    error: null
                  }))
                }
                placeholder={tr.passwordPlaceholder}
                required
                className="h-13 w-full rounded-2xl border border-[#073f43]/13 bg-[#fbfdfd] px-4 pr-13 text-[15px] text-[#073f43] outline-none transition duration-200 placeholder:text-[#93a4a5] hover:border-[#12b8c4]/28 focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setState((current) => ({
                    ...current,
                    showPassword: !current.showPassword
                  }))
                }
                aria-label={
                  state.showPassword ? tr.hide : tr.show
                }
                title={
                  state.showPassword ? tr.hide : tr.show
                }
                className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#718788] transition hover:bg-[#eaf8f6] hover:text-[#078b7b]"
              >
                <EyeIcon hidden={state.showPassword} />
              </button>
            </div>
          </div>

          {state.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-800">
              <span className="font-extrabold">
                {tr.error}:
              </span>{" "}
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={state.submitting}
            className={`group/button flex min-h-13 w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-extrabold text-white transition duration-300 disabled:cursor-wait disabled:opacity-60 ${
              psychologist
                ? "bg-gradient-to-r from-[#075f62] via-[#078b7b] to-[#12aeba] shadow-[0_12px_30px_rgba(7,139,123,0.20)] hover:-translate-y-0.5 hover:shadow-[0_17px_38px_rgba(18,184,196,0.28)]"
                : "bg-gradient-to-r from-[#087f78] via-[#3977e8] to-[#6655cc] shadow-[0_12px_30px_rgba(57,119,232,0.20)] hover:-translate-y-0.5 hover:shadow-[0_17px_38px_rgba(89,92,210,0.27)]"
            }`}
          >
            {state.submitting
              ? tr.submitting
              : submitLabel}
          </button>
        </form>
      </div>

      <div className="relative mt-auto pt-6">
        <div className="border-t border-[#073f43]/8 pt-5">
          <p className="text-center text-xs font-semibold text-[#7a8d8e]">
            {tr.noAccount}
          </p>

          <Link
            href={registerHref}
            className={`mt-3 flex min-h-12 w-full items-center justify-center rounded-full border bg-white px-4 py-3 text-center text-sm font-extrabold transition duration-300 hover:-translate-y-0.5 ${
              psychologist
                ? "border-[#078b7b]/18 text-[#078b7b] hover:border-[#12b8c4]/35 hover:bg-[#edf9f8] hover:shadow-[0_10px_28px_rgba(18,184,196,0.10)]"
                : "border-[#5367ca]/16 text-[#5367ca] hover:border-[#7657df]/30 hover:bg-[#f3f1ff] hover:shadow-[0_10px_28px_rgba(118,87,223,0.10)]"
            }`}
          >
            {registerLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("hy");

  const [psychologist, setPsychologist] =
    useState<LoginState>(INITIAL_STATE);

  const [client, setClient] =
    useState<LoginState>(INITIAL_STATE);

  useEffect(() => {
    const syncLang = () => {
      setLang(getUiLangFromCookie());
    };

    syncLang();

    window.addEventListener("focus", syncLang);

    return () => {
      window.removeEventListener("focus", syncLang);
    };
  }, []);

  const tr = TXT[lang];

  async function onSubmit(
    event: FormEvent<HTMLFormElement>,
    role: AuthRole
  ) {
    event.preventDefault();

    const psychologistRole = role === "PSYCHOLOGIST";

    const state = psychologistRole
      ? psychologist
      : client;

    const setState = psychologistRole
      ? setPsychologist
      : setClient;

    if (state.submitting) {
      return;
    }

    setState((current) => ({
      ...current,
      submitting: true,
      error: null
    }));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: state.email.trim().toLowerCase(),
          password: state.password,
          role
        })
      });

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setState((current) => ({
          ...current,
          error: friendlyLoginError(
            payload,
            role,
            tr
          )
        }));
        return;
      }

      const returnedRole =
        payload?.role as AuthRole | undefined;

      const requestedNext =
        searchParams.get("next");

      const nextAllowed =
        requestedNext &&
        (
          (role === "CLIENT" &&
            requestedNext.startsWith("/app")) ||
          (role === "PSYCHOLOGIST" &&
            (
              requestedNext.startsWith("/pro") ||
              requestedNext.startsWith(
                "/psychologists/onboarding"
              )
            ))
        );

      const redirectTo =
        nextAllowed && requestedNext
          ? requestedNext
          : returnedRole === "PSYCHOLOGIST"
            ? "/pro"
            : "/app";

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setState((current) => ({
        ...current,
        error: tr.failed
      }));
    } finally {
      setState((current) => ({
        ...current,
        submitting: false
      }));
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_15%,rgba(18,184,196,0.11),transparent_27%),radial-gradient(circle_at_90%_35%,rgba(118,87,223,0.09),transparent_28%)]" />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#12b8c4]/18 bg-white/80 px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-[#078b7b] shadow-sm backdrop-blur">
            {tr.eyebrow}
          </span>

          <h1 className="mt-5 text-balance text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-4xl lg:text-[2.8rem]">
            {tr.pageTitle}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-[#607172] sm:text-lg">
            {tr.pageText}
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="order-2 lg:order-1">
            <LoginCard
              role="PSYCHOLOGIST"
              state={psychologist}
              setState={setPsychologist}
              tr={tr}
              onSubmit={onSubmit}
            />
          </div>

          <div className="order-1 lg:order-2">
            <LoginCard
              role="CLIENT"
              state={client}
              setState={setClient}
              tr={tr}
              onSubmit={onSubmit}
            />
          </div>
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex rounded-full px-4 py-2 text-sm font-bold text-[#607172] transition hover:bg-white hover:text-[#078b7b] hover:shadow-sm"
          >
            ← IviXHub
          </Link>
        </div>
      </div>
    </main>
  );
}
