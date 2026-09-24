"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type AuthRole = "CLIENT" | "PSYCHOLOGIST";
type Gender = "MALE" | "FEMALE" | "UNSPECIFIED";

const TXT = {
  hy: {
    eyebrow: "Միացիր IviXHub-ին",
    title: "Ստեղծիր քո հաշիվը",
    subtitle:
      "Ընտրիր հաշվի տեսակը և լրացրու անհրաժեշտ տվյալները։",

    client: "Հաճախորդ",
    psychologist: "Հոգեբան",

    clientTitle: "Հաճախորդի հաշիվ",
    psychologistTitle: "Հոգեբանի հաշիվ",

    clientInfo:
      "Գտիր համապատասխան մասնագետին, ամրագրիր հանդիպումներ և կառավարիր քո անձնական տարածքը։",
    psychologistInfo:
      "Ստեղծիր մասնագիտական հաշիվ, անցիր վերիֆիկացիա և կառավարիր հանդիպումներն ու հասանելիությունը։",

    clientPoint1: "Հոգեբանների որոնում և ընտրություն",
    clientPoint2: "Հանդիպումների ամրագրում",
    clientPoint3: "Անձնական և գաղտնի միջավայր",

    psychPoint1: "Մասնագիտական պրոֆիլ",
    psychPoint2: "Փաստաթղթեր և վերիֆիկացիա",
    psychPoint3: "Հասանելիություն և հանդիպումներ",

    fullName: "Անուն և ազգանուն",
    optional: "Ոչ պարտադիր",
    username: "Նիք",
    birthDate: "Ծննդյան ամսաթիվ",
    gender: "Սեռ",
    male: "Արական",
    female: "Իգական",
    unspecified: "Չնշել",
    day: "Օր",
    month: "Ամիս",
    year: "Տարի",
    email: "Email",
    password: "Գաղտնաբառ",
    confirmPassword: "Հաստատել գաղտնաբառը",

    fullNamePlaceholder: "Օրինակ՝ Garegin Sukiasyan",
    usernamePlaceholder: "օրինակ՝ garegin90",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Մուտքագրեք գաղտնաբառը",
    confirmPasswordPlaceholder: "Կրկնեք գաղտնաբառը",

    ruleTitle: "Գաղտնաբառը պետք է պարունակի",
    ruleLength: "Առնվազն 8 նիշ",
    ruleLetter: "Առնվազն մեկ տառ",
    ruleDigit: "Առնվազն մեկ թիվ",
    ruleSpecial: "Առնվազն մեկ հատուկ նշան",

    show: "Ցույց տալ",
    hide: "Թաքցնել",

    submitClient: "Ստեղծել հաշիվ",
    submitPsych: "Ստեղծել հոգեբանի հաշիվ",
    submitting: "Ստեղծվում է...",

    already: "Արդեն ունե՞ք հաշիվ",
    login: "Մուտք գործել",

    error: "Սխալ",
    mismatch: "Գաղտնաբառերը չեն համընկնում",
    invalidBirthDate: "Ընտրեք ճիշտ ծննդյան ամսաթիվ",
    invalidUsername:
      "Նիքը կարող է պարունակել միայն լատինատառ տառեր, թվեր, կետ և ընդգծում",
    invalidPassword:
      "Գաղտնաբառը պետք է բավարարի բոլոր պահանջներին",
    emailTaken:
      "Այս email-ը արդեն գրանցված է։ Մուտք գործեք առկա հաշիվ։",
    emailRoleMismatch:
      "Այս email-ը արդեն օգտագործվում է այլ տեսակի հաշվում։",
    usernameTaken: "Այս նիքը արդեն զբաղված է։ Ընտրեք ուրիշը։",
    validationFailed: "Ստուգեք դաշտերը և փորձեք կրկին։",
    failed: "Չհաջողվեց ստեղծել հաշիվը։ Փորձեք կրկին։"
  },

  ru: {
    eyebrow: "Присоединяйтесь к IviXHub",
    title: "Создайте свой аккаунт",
    subtitle:
      "Выберите тип аккаунта и заполните необходимые данные.",

    client: "Клиент",
    psychologist: "Психолог",

    clientTitle: "Аккаунт клиента",
    psychologistTitle: "Аккаунт психолога",

    clientInfo:
      "Найдите подходящего специалиста, бронируйте встречи и управляйте своим личным пространством.",
    psychologistInfo:
      "Создайте профессиональный аккаунт, пройдите верификацию и управляйте встречами и доступностью.",

    clientPoint1: "Поиск и выбор психолога",
    clientPoint2: "Бронирование встреч",
    clientPoint3: "Личное и конфиденциальное пространство",

    psychPoint1: "Профессиональный профиль",
    psychPoint2: "Документы и верификация",
    psychPoint3: "Доступность и встречи",

    fullName: "Имя и фамилия",
    optional: "Необязательно",
    username: "Никнейм",
    birthDate: "Дата рождения",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указывать",
    day: "День",
    month: "Месяц",
    year: "Год",
    email: "Email",
    password: "Пароль",
    confirmPassword: "Подтверждение пароля",

    fullNamePlaceholder: "Например, Garegin Sukiasyan",
    usernamePlaceholder: "например, garegin90",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Введите пароль",
    confirmPasswordPlaceholder: "Повторите пароль",

    ruleTitle: "Пароль должен содержать",
    ruleLength: "Минимум 8 символов",
    ruleLetter: "Минимум одну букву",
    ruleDigit: "Минимум одну цифру",
    ruleSpecial: "Минимум один спецсимвол",

    show: "Показать",
    hide: "Скрыть",

    submitClient: "Создать аккаунт",
    submitPsych: "Создать аккаунт психолога",
    submitting: "Создание...",

    already: "Уже есть аккаунт?",
    login: "Войти",

    error: "Ошибка",
    mismatch: "Пароли не совпадают",
    invalidBirthDate: "Выберите корректную дату рождения",
    invalidUsername:
      "Никнейм может содержать только латинские буквы, цифры, точку и нижнее подчёркивание",
    invalidPassword: "Пароль должен соответствовать всем требованиям",
    emailTaken:
      "Этот email уже зарегистрирован. Войдите в существующий аккаунт.",
    emailRoleMismatch:
      "Этот email уже используется аккаунтом другого типа.",
    usernameTaken: "Этот никнейм уже занят. Выберите другой.",
    validationFailed: "Проверьте заполненные поля и попробуйте снова.",
    failed: "Не удалось создать аккаунт. Попробуйте ещё раз."
  },

  en: {
    eyebrow: "Join IviXHub",
    title: "Create your account",
    subtitle:
      "Choose your account type and enter the required information.",

    client: "Client",
    psychologist: "Psychologist",

    clientTitle: "Client account",
    psychologistTitle: "Psychologist account",

    clientInfo:
      "Find the right professional, book sessions and manage your personal space.",
    psychologistInfo:
      "Create your professional account, complete verification and manage your availability and sessions.",

    clientPoint1: "Find and choose psychologists",
    clientPoint2: "Book sessions",
    clientPoint3: "Private and confidential space",

    psychPoint1: "Professional profile",
    psychPoint2: "Documents and verification",
    psychPoint3: "Availability and sessions",

    fullName: "Full name",
    optional: "Optional",
    username: "Username",
    birthDate: "Date of birth",
    gender: "Gender",
    male: "Male",
    female: "Female",
    unspecified: "Prefer not to say",
    day: "Day",
    month: "Month",
    year: "Year",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",

    fullNamePlaceholder: "For example, Garegin Sukiasyan",
    usernamePlaceholder: "for example, garegin90",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter password",
    confirmPasswordPlaceholder: "Repeat password",

    ruleTitle: "Password must contain",
    ruleLength: "At least 8 characters",
    ruleLetter: "At least one letter",
    ruleDigit: "At least one number",
    ruleSpecial: "At least one special character",

    show: "Show",
    hide: "Hide",

    submitClient: "Create account",
    submitPsych: "Create psychologist account",
    submitting: "Creating...",

    already: "Already have an account?",
    login: "Sign in",

    error: "Error",
    mismatch: "Passwords do not match",
    invalidBirthDate: "Select a valid date of birth",
    invalidUsername:
      "Username may contain only Latin letters, numbers, dot and underscore",
    invalidPassword: "Password must satisfy all requirements",
    emailTaken:
      "This email is already registered. Sign in to the existing account.",
    emailRoleMismatch:
      "This email is already used by another account type.",
    usernameTaken: "This username is already taken. Choose another one.",
    validationFailed: "Check the form fields and try again.",
    failed: "Failed to create account. Please try again."
  }
} as const;

const MONTHS = {
  hy: [
    "Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս",
    "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"
  ],
  ru: [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
} as const;

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._]+$/.test(value);
}

function passwordChecks(value: string) {
  return {
    length: value.length >= 8,
    letter: /[A-Za-z]/.test(value),
    digit: /\d/.test(value),
    special: /[^A-Za-z\d]/.test(value)
  };
}

function isValidPassword(value: string) {
  const checks = passwordChecks(value);
  return checks.length && checks.letter && checks.digit && checks.special;
}

function extractRawError(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";

  const p = payload as Record<string, unknown>;

  return [
    typeof p.message === "string" ? p.message : null,
    typeof p.detail === "string" ? p.detail : null,
    typeof p.title === "string" ? p.title : null,
    typeof p.details === "string" ? p.details : null,
    typeof p.error === "string" ? p.error : null,
    typeof p.errorCode === "string" ? p.errorCode : null,
    Array.isArray(p.errors) ? p.errors.join(" ") : null
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function friendlyRegisterError(
  payload: unknown,
  tr: (typeof TXT)[Lang]
) {
  const raw = extractRawError(payload);

  if (raw.includes("registered for a client account"))
    return tr.emailRoleMismatch;
  if (raw.includes("registered for a psychologist account"))
    return tr.emailRoleMismatch;
  if (raw.includes("already registered")) return tr.emailTaken;
  if (raw.includes("already exists")) return tr.emailTaken;
  if (raw.includes("already taken")) return tr.usernameTaken;
  if (raw.includes("Username already")) return tr.usernameTaken;
  if (raw.includes("Password must contain")) return tr.invalidPassword;
  if (raw.includes("Username may contain")) return tr.invalidUsername;
  if (raw.includes("Birth date is out of allowed range"))
    return tr.invalidBirthDate;
  if (raw.includes("Validation failed")) return tr.validationFailed;
  if (raw.includes("Method argument not valid"))
    return tr.validationFailed;
  if (raw.includes("Bad Request")) return tr.validationFailed;

  return tr.failed;
}

function buildBirthDate(
  day: string,
  month: string,
  year: string
): string | null {
  if (!day || !month || !year) return null;

  const dd = Number(day);
  const mm = Number(month);
  const yyyy = Number(year);

  const date = new Date(Date.UTC(yyyy, mm - 1, dd));

  if (
    date.getUTCFullYear() !== yyyy ||
    date.getUTCMonth() !== mm - 1 ||
    date.getUTCDate() !== dd
  ) {
    return null;
  }

  if (yyyy < 1940 || yyyy > 2010) return null;

  return `${String(yyyy).padStart(4, "0")}-${String(mm).padStart(
    2,
    "0"
  )}-${String(dd).padStart(2, "0")}`;
}

function EyeIcon({ crossed }: { crossed: boolean }) {
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
      {crossed && <path d="m4 4 16 16" />}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
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

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("hy");

  useEffect(() => {
    const sync = () => setLang(getUiLangFromCookie());

    sync();
    window.addEventListener("focus", sync);

    return () => window.removeEventListener("focus", sync);
  }, []);

  const tr = TXT[lang];
  const months = MONTHS[lang];

  const isPsychologist =
    searchParams.get("role") === "psychologist";

  const authRole: AuthRole = isPsychologist
    ? "PSYCHOLOGIST"
    : "CLIENT";

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState<Gender>("UNSPECIFIED");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checks = useMemo(
    () => passwordChecks(password),
    [password]
  );

  const days = Array.from(
    { length: 31 },
    (_, index) => String(index + 1)
  );

  const years = Array.from(
    { length: 2010 - 1940 + 1 },
    (_, index) => String(2010 - index)
  );

  const inputClass =
    "h-13 w-full rounded-2xl border border-[#073f43]/13 bg-[#fbfdfd] px-4 text-[15px] text-[#073f43] outline-none transition duration-200 placeholder:text-[#94a6a7] hover:border-[#12b8c4]/28 focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10";

  const selectClass =
    "h-13 w-full rounded-2xl border border-[#073f43]/13 bg-[#fbfdfd] px-4 text-[15px] text-[#073f43] outline-none transition duration-200 hover:border-[#12b8c4]/28 focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (password !== confirmPassword) {
      setError(tr.mismatch);
      return;
    }

    if (!isValidUsername(username.trim())) {
      setError(tr.invalidUsername);
      return;
    }

    if (!isValidPassword(password)) {
      setError(tr.invalidPassword);
      return;
    }

    const birthDateIso = buildBirthDate(
      birthDay,
      birthMonth,
      birthYear
    );

    if (!birthDateIso) {
      setError(tr.invalidBirthDate);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: fullName.trim() || null,
          username: username.trim().toLowerCase(),
          birthDate: birthDateIso,
          gender,
          email: email.trim().toLowerCase(),
          password,
          role: authRole
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(friendlyRegisterError(payload, tr));
        return;
      }

      const next = isPsychologist
        ? "/psychologists/onboarding/profile"
        : "/app";

      router.replace(
        `/auth/verify?next=${encodeURIComponent(next)}`
      );
      router.refresh();
    } catch {
      setError(tr.failed);
    } finally {
      setSubmitting(false);
    }
  }

  const infoTitle = isPsychologist
    ? tr.psychologistTitle
    : tr.clientTitle;

  const infoText = isPsychologist
    ? tr.psychologistInfo
    : tr.clientInfo;

  const infoPoints = isPsychologist
    ? [tr.psychPoint1, tr.psychPoint2, tr.psychPoint3]
    : [tr.clientPoint1, tr.clientPoint2, tr.clientPoint3];

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_8%_15%,rgba(18,184,196,0.11),transparent_28%),radial-gradient(circle_at_92%_40%,rgba(118,87,223,0.09),transparent_30%)]" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#12b8c4]/18 bg-white/80 px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-[#078b7b] shadow-sm backdrop-blur">
            {tr.eyebrow}
          </span>

          <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-4xl">
            {tr.title}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#647879]">
            {tr.subtitle}
          </p>

          <div className="mx-auto mt-7 grid max-w-[480px] grid-cols-2 rounded-full border border-[#073f43]/10 bg-white p-1.5 shadow-[0_10px_35px_rgba(7,63,67,0.07)]">
            <Link
              href="/auth/register"
              className={`flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-extrabold transition duration-300 ${
                !isPsychologist
                  ? "bg-gradient-to-r from-[#087f78] via-[#12aeba] to-[#3977e8] text-white shadow-[0_8px_24px_rgba(18,174,186,0.22)]"
                  : "text-[#65797a] hover:bg-[#eff9f7] hover:text-[#078b7b]"
              }`}
            >
              {tr.client}
            </Link>

            <Link
              href="/auth/register?role=psychologist"
              className={`flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-extrabold transition duration-300 ${
                isPsychologist
                  ? "bg-gradient-to-r from-[#078b7b] via-[#3977e8] to-[#6655cc] text-white shadow-[0_8px_24px_rgba(89,92,210,0.22)]"
                  : "text-[#65797a] hover:bg-[#f3f1ff] hover:text-[#5f5dcc]"
              }`}
            >
              {tr.psychologist}
            </Link>
          </div>
        </header>

        <div className="mx-auto mt-9 grid max-w-6xl items-start gap-6 lg:grid-cols-[1.18fr_0.82fr]">
          <section className="rounded-[2rem] border border-[#073f43]/10 bg-white/94 p-6 shadow-[0_20px_60px_rgba(7,63,67,0.08)] backdrop-blur sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-[#274f51]">
                    {tr.fullName}
                  </label>
                  <span className="text-xs font-semibold text-[#8a9a9b]">
                    {tr.optional}
                  </span>
                </div>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  placeholder={tr.fullNamePlaceholder}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#274f51]">
                  {tr.username}
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  placeholder={tr.usernamePlaceholder}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-[1.35fr_0.65fr]">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#274f51]">
                    {tr.birthDate}
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="">{tr.day}</option>
                      {days.map((day) => (
                        <option key={day}>{day}</option>
                      ))}
                    </select>

                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="">{tr.month}</option>
                      {months.map((month, index) => (
                        <option
                          key={month}
                          value={String(index + 1)}
                        >
                          {month}
                        </option>
                      ))}
                    </select>

                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="">{tr.year}</option>
                      {years.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#274f51]">
                    {tr.gender}
                  </label>

                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as Gender)
                    }
                    className={selectClass}
                  >
                    <option value="UNSPECIFIED">
                      {tr.unspecified}
                    </option>
                    <option value="MALE">{tr.male}</option>
                    <option value="FEMALE">{tr.female}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#274f51]">
                  {tr.email}
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder={tr.emailPlaceholder}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#274f51]">
                    {tr.password}
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder={tr.passwordPlaceholder}
                      className={`${inputClass} pr-12`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? tr.hide : tr.show}
                      className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#718788] transition hover:bg-[#eaf8f6] hover:text-[#078b7b]"
                    >
                      <EyeIcon crossed={showPassword} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#274f51]">
                    {tr.confirmPassword}
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      autoComplete="new-password"
                      placeholder={tr.confirmPasswordPlaceholder}
                      className={`${inputClass} pr-12`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword ? tr.hide : tr.show
                      }
                      className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#718788] transition hover:bg-[#eaf8f6] hover:text-[#078b7b]"
                    >
                      <EyeIcon crossed={showConfirmPassword} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#073f43]/8 bg-[#f8fbfb] p-4">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#607879]">
                  {tr.ruleTitle}
                </p>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    [checks.length, tr.ruleLength],
                    [checks.letter, tr.ruleLetter],
                    [checks.digit, tr.ruleDigit],
                    [checks.special, tr.ruleSpecial]
                  ].map(([valid, text]) => (
                    <div
                      key={String(text)}
                      className={`flex items-center gap-2 font-semibold ${
                        valid
                          ? "text-[#078b7b]"
                          : "text-[#89999a]"
                      }`}
                    >
                      <span
                        className={`flex size-5 items-center justify-center rounded-full ${
                          valid
                            ? "bg-[#e5f8f4]"
                            : "bg-[#edf1f1]"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                      {String(text)}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                  <strong>{tr.error}:</strong> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-13 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#087f78] via-[#3977e8] to-[#6655cc] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_13px_32px_rgba(57,119,232,0.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(89,92,210,0.27)] disabled:cursor-wait disabled:opacity-60"
              >
                {submitting
                  ? tr.submitting
                  : isPsychologist
                    ? tr.submitPsych
                    : tr.submitClient}
              </button>

              <div className="text-center text-sm text-[#728586]">
                {tr.already}{" "}
                <Link
                  href={
                    isPsychologist
                      ? "/auth/login?role=psychologist"
                      : "/auth/login"
                  }
                  className="font-extrabold text-[#078b7b] transition hover:text-[#5367ca]"
                >
                  {tr.login}
                </Link>
              </div>
            </form>
          </section>

          <aside className="group relative overflow-hidden rounded-[2rem] border border-[#12b8c4]/16 bg-white/86 p-7 shadow-[0_20px_60px_rgba(7,63,67,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#3977e8]/25 hover:shadow-[0_26px_70px_rgba(89,92,210,0.13)] sm:p-8 lg:sticky lg:top-[104px]">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gradient-to-br from-[#12b8c4]/15 via-[#3977e8]/10 to-[#7657df]/15 blur-3xl transition duration-500 group-hover:scale-110" />

            <div className="relative">
              <span className="inline-flex rounded-full bg-gradient-to-r from-[#e9f9f6] to-[#f1f1ff] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                {isPsychologist ? tr.psychologist : tr.client}
              </span>

              <h2 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#073f43]">
                {infoTitle}
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-[#637778]">
                {infoText}
              </p>

              <div className="mt-7 space-y-3">
                {infoPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-2xl border border-[#073f43]/7 bg-white/80 px-4 py-3.5 text-sm font-bold text-[#496667] transition duration-300 hover:translate-x-1 hover:border-[#12b8c4]/25 hover:bg-gradient-to-r hover:from-[#effaf8] hover:to-[#f4f2ff]"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e7f8f5] text-[#078b7b]">
                      <CheckIcon />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
