"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    brand: "IvixHUB",
    clientHeroTitle: "Создание аккаунта",
    psychHeroTitle: "Создание аккаунта психолога",
    clientHeroText:
      "Создайте аккаунт, чтобы бронировать сессии, проходить мини-тест, управлять оплатами и работать с личным кабинетом.",
    psychHeroText:
      "Создайте аккаунт психолога, чтобы пройти профессиональный onboarding, заполнить профиль, загрузить документы и перейти к верификации.",
    clientHero1: "Регистрация клиента — для поиска психолога и бронирования сессий.",
    clientHero2: "Если вы специалист, используйте отдельный psychologist flow.",
    clientHero3: "После регистрации пользователь продолжает flow платформы через подтверждение и правила.",
    psychHero1: "Это отдельный путь для специалистов, а не для обычного клиентского аккаунта.",
    psychHero2: "После регистрации нужно подтвердить телефон и продолжить psychologist onboarding.",
    psychHero3: "Далее заполняется профиль, документы и запускается верификация.",
    clientTitle: "Регистрация клиента",
    psychTitle: "Регистрация психолога",
    clientSubtitle: "Введите обязательные данные для создания клиентского аккаунта.",
    psychSubtitle: "Введите обязательные данные для создания аккаунта психолога.",
    fullName: "Имя и Фамилия",
    fullNameOptional: "Это необязательное поле",
    username: "Никнейм",
    birthDate: "Дата рождения",
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
    show: "Показать",
    hide: "Скрыть",
    ruleLength: "Минимум 8 символов",
    ruleLetter: "Минимум одна буква",
    ruleDigit: "Минимум одна цифра",
    ruleSpecial: "Минимум один спецсимвол",
    submitClient: "Создать аккаунт",
    submitPsych: "Создать аккаунт психолога",
    submitting: "Создание...",
    login: "У меня уже есть аккаунт",
    home: "Вернуться на главную",
    switchPsych: "Я психолог",
    switchClient: "Я клиент",
    error: "Ошибка",
    mismatch: "Пароли не совпадают",
    invalidBirthDate: "Выберите корректную дату рождения",
    invalidUsername: "Никнейм может содержать только буквы, цифры, точку и нижнее подчёркивание",
    invalidPassword: "Пароль должен соответствовать всем требованиям ниже",
    emailTaken: "Этот email уже зарегистрирован. Войдите в существующий аккаунт.",
    usernameTaken: "Этот никнейм уже занят. Выберите другой.",
    validationFailed: "Проверьте заполненные поля и попробуйте снова.",
    failed: "Не удалось создать аккаунт. Попробуйте ещё раз."
  },
  en: {
    brand: "IvixHUB",
    clientHeroTitle: "Create an account",
    psychHeroTitle: "Create a psychologist account",
    clientHeroText:
      "Create an account to book sessions, take the mini-test, manage payments, and use your personal dashboard.",
    psychHeroText:
      "Create a psychologist account to complete professional onboarding, fill in your profile, upload documents, and proceed to verification.",
    clientHero1: "Client registration — for finding psychologists and booking sessions.",
    clientHero2: "If you are a specialist, use the separate psychologist flow.",
    clientHero3: "After registration, the user continues through confirmation and platform rules.",
    psychHero1: "This is a separate path for specialists, not for a regular client account.",
    psychHero2: "After registration, you need to verify your phone and continue psychologist onboarding.",
    psychHero3: "Then profile data, documents, and verification follow.",
    clientTitle: "Client registration",
    psychTitle: "Psychologist registration",
    clientSubtitle: "Enter the required fields to create a client account.",
    psychSubtitle: "Enter the required fields to create a psychologist account.",
    fullName: "Full name",
    fullNameOptional: "This field is optional",
    username: "Username",
    birthDate: "Date of birth",
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
    show: "Show",
    hide: "Hide",
    ruleLength: "At least 8 characters",
    ruleLetter: "At least one letter",
    ruleDigit: "At least one digit",
    ruleSpecial: "At least one special symbol",
    submitClient: "Create account",
    submitPsych: "Create psychologist account",
    submitting: "Creating...",
    login: "I already have an account",
    home: "Back to home",
    switchPsych: "I am a psychologist",
    switchClient: "I am a client",
    error: "Error",
    mismatch: "Passwords do not match",
    invalidBirthDate: "Select a valid date of birth",
    invalidUsername: "Username may contain only letters, numbers, dot and underscore",
    invalidPassword: "Password must satisfy all requirements below",
    emailTaken: "This email is already registered. Sign in to the existing account.",
    usernameTaken: "This username is already taken. Choose another one.",
    validationFailed: "Check the form fields and try again.",
    failed: "Failed to create account. Please try again."
  },
  hy: {
    brand: "IvixHUB",
    clientHeroTitle: "Ստեղծել հաշիվ",
    psychHeroTitle: "Ստեղծել հոգեբանի հաշիվ",
    clientHeroText:
      "Ստեղծեք հաշիվ՝ սեանսներ ամրագրելու, մինի-թեստ անցնելու, վճարումները կառավարելու և անձնական էջից օգտվելու համար։",
    psychHeroText:
      "Ստեղծեք հոգեբանի հաշիվ՝ մասնագիտական onboarding-ը անցնելու, պրոֆիլը լրացնելու, փաստաթղթերը բեռնելու և վերիֆիկացիային անցնելու համար։",
    clientHero1: "Հաճախորդի գրանցում — հոգեբան գտնելու և սեանս ամրագրելու համար։",
    clientHero2: "Եթե մասնագետ եք, օգտագործեք առանձին psychologist flow-ը։",
    clientHero3: "Գրանցումից հետո օգտատերը շարունակում է հարթակի flow-ը հաստատման և կանոնների միջով։",
    psychHero1: "Սա առանձին ուղի է մասնագետների համար, ոչ թե սովորական հաճախորդի հաշվի։",
    psychHero2: "Գրանցումից հետո պետք է հաստատել հեռախոսը և շարունակել psychologist onboarding-ը։",
    psychHero3: "Այնուհետև լրացվում են պրոֆիլը, փաստաթղթերը և անցնում է վերիֆիկացիան։",
    clientTitle: "Հաճախորդի գրանցում",
    psychTitle: "Հոգեբանի գրանցում",
    clientSubtitle: "Մուտքագրեք պարտադիր տվյալները հաճախորդի հաշիվ ստեղծելու համար։",
    psychSubtitle: "Մուտքագրեք պարտադիր տվյալները հոգեբանի հաշիվ ստեղծելու համար։",
    fullName: "Անուն և Ազգանուն",
    fullNameOptional: "Սա պարտադիր դաշտ չէ",
    username: "Նիք",
    birthDate: "Ծննդյան ամսաթիվ",
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
    show: "Ցույց տալ",
    hide: "Թաքցնել",
    ruleLength: "Առնվազն 8 նիշ",
    ruleLetter: "Առնվազն մեկ տառ",
    ruleDigit: "Առնվազն մեկ թիվ",
    ruleSpecial: "Առնվազն մեկ հատուկ նշան",
    submitClient: "Ստեղծել հաշիվ",
    submitPsych: "Ստեղծել հոգեբանի հաշիվ",
    submitting: "Ստեղծվում է...",
    login: "Ես արդեն ունեմ հաշիվ",
    home: "Վերադառնալ գլխավոր էջ",
    switchPsych: "Ես հոգեբան եմ",
    switchClient: "Ես հաճախորդ եմ",
    error: "Սխալ",
    mismatch: "Գաղտնաբառերը չեն համընկնում",
    invalidBirthDate: "Ընտրեք ճիշտ ծննդյան ամսաթիվ",
    invalidUsername: "Նիքը կարող է պարունակել միայն տառեր, թվեր, կետ և ընդգծում",
    invalidPassword: "Գաղտնաբառը պետք է բավարարի բոլոր պահանջներին",
    emailTaken: "Այս email-ը արդեն գրանցված է։ Մուտք գործեք առկա հաշիվ։",
    usernameTaken: "Այս նիքը արդեն զբաղված է։ Ընտրեք ուրիշը։",
    validationFailed: "Ստուգեք դաշտերը և փորձեք կրկին։",
    failed: "Չհաջողվեց ստեղծել հաշիվը։ Փորձեք կրկին։"
  }
} as const;

type Lang = keyof typeof TXT;

const MONTHS = {
  ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  hy: ["Հունվար","Փետրվար","Մարտ","Ապրիլ","Մայիս","Հունիս","Հուլիս","Օգոստոս","Սեպտեմբեր","Հոկտեմբեր","Նոյեմբեր","Դեկտեմբեր"]
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
  const c = passwordChecks(value);
  return c.length && c.letter && c.digit && c.special;
}

function extractRawError(payload: any) {
  const parts = [
    payload?.message,
    payload?.detail,
    payload?.title,
    payload?.details,
    payload?.error,
    payload?.errorCode,
    Array.isArray(payload?.errors) ? payload.errors.join(" ") : null
  ].filter(Boolean);

  return String(parts.join(" ")).trim();
}

function friendlyRegisterError(payload: any, tr: (typeof TXT)[Lang]) {
  const raw = extractRawError(payload);

  if (raw.includes("already registered")) return tr.emailTaken;
  if (raw.includes("already exists")) return tr.emailTaken;
  if (raw.includes("already taken")) return tr.usernameTaken;
  if (raw.includes("Username already")) return tr.usernameTaken;
  if (raw.includes("Password must contain")) return tr.invalidPassword;
  if (raw.includes("Username may contain")) return tr.invalidUsername;
  if (raw.includes("Birth date is out of allowed range")) return tr.invalidBirthDate;
  if (raw.includes("Validation failed")) return tr.validationFailed;
  if (raw.includes("Method argument not valid")) return tr.validationFailed;
  if (raw.includes("Bad Request")) return tr.validationFailed;
  if (raw.includes("birth_date does not exist")) return "Backend database migration is not applied yet.";

  return tr.failed;
}

function buildBirthDate(day: string, month: string, year: string): string | null {
  if (!day || !month || !year) return null;

  const dd = Number(day);
  const mm = Number(month);
  const yyyy = Number(year);

  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (
    d.getUTCFullYear() !== yyyy ||
    d.getUTCMonth() !== mm - 1 ||
    d.getUTCDate() !== dd
  ) return null;

  if (yyyy < 1940 || yyyy > 2010) return null;

  return `${yyyy.toString().padStart(4, "0")}-${mm.toString().padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;
}

export default function RegisterPage() {
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
  const months = MONTHS[lang];
  const isPsychologist = searchParams.get("role") === "psychologist";

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checks = useMemo(() => passwordChecks(password), [password]);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 2010 - 1940 + 1 }, (_, i) => String(2010 - i));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
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

    const birthDateIso = buildBirthDate(birthDay, birthMonth, birthYear);
    if (!birthDateIso) {
      setError(tr.invalidBirthDate);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || null,
          username: username.trim().toLowerCase(),
          birthDate: birthDateIso,
          email: email.trim().toLowerCase(),
          password
        })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(friendlyRegisterError(j, tr));
        return;
      }

      const next = isPsychologist
        ? "/psychologists/onboarding/profile"
        : "/app";

      router.replace(`/auth/verify?next=${encodeURIComponent(next)}`);
      router.refresh();
    } catch {
      setError(tr.failed);
    } finally {
      setSubmitting(false);
    }
  }

  const heroTitle = isPsychologist ? tr.psychHeroTitle : tr.clientHeroTitle;
  const heroText = isPsychologist ? tr.psychHeroText : tr.clientHeroText;
  const hero1 = isPsychologist ? tr.psychHero1 : tr.clientHero1;
  const hero2 = isPsychologist ? tr.psychHero2 : tr.clientHero2;
  const hero3 = isPsychologist ? tr.psychHero3 : tr.clientHero3;
  const title = isPsychologist ? tr.psychTitle : tr.clientTitle;
  const subtitle = isPsychologist ? tr.psychSubtitle : tr.clientSubtitle;
  const submitText = isPsychologist ? tr.submitPsych : tr.submitClient;

  const ruleClass = (ok: boolean) => ok ? "text-green-700" : "text-red-600";

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="text-sm text-gray-500">{tr.brand}</div>
          <h1 className="mt-3 text-3xl font-semibold">{heroTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">{heroText}</p>

          <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div className="rounded-2xl bg-slate-50 p-4">{hero1}</div>
            <div className="rounded-2xl bg-slate-50 p-4">{hero2}</div>
            <div className="rounded-2xl bg-slate-50 p-4">{hero3}</div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {!isPsychologist ? (
              <Link
                href="/auth/register?role=psychologist"
                className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
              >
                {tr.switchPsych}
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
              >
                {tr.switchClient}
              </Link>
            )}
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">{tr.fullName}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                placeholder={tr.fullNamePlaceholder}
              />
              <div className="mt-1 text-xs text-gray-500">{tr.fullNameOptional}</div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.username}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                placeholder={tr.usernamePlaceholder}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.birthDate}</label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                  required
                >
                  <option value="">{tr.day}</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                  required
                >
                  <option value="">{tr.month}</option>
                  {months.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                </select>

                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                  required
                >
                  <option value="">{tr.year}</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.email}</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                placeholder={tr.emailPlaceholder}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 pr-24 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder={tr.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border px-3 py-1 text-xs hover:bg-gray-50"
                >
                  {showPassword ? tr.hide : tr.show}
                </button>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <div className={ruleClass(checks.length)}>{tr.ruleLength}</div>
                <div className={ruleClass(checks.letter)}>{tr.ruleLetter}</div>
                <div className={ruleClass(checks.digit)}>{tr.ruleDigit}</div>
                <div className={ruleClass(checks.special)}>{tr.ruleSpecial}</div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">{tr.confirmPassword}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 pr-24 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder={tr.confirmPasswordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border px-3 py-1 text-xs hover:bg-gray-50"
                >
                  {showConfirmPassword ? tr.hide : tr.show}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
                <b>{tr.error}:</b> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
            >
              {submitting ? tr.submitting : submitText}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-sm">
            <Link
              href={isPsychologist ? "/auth/login?next=/psychologists/onboarding/profile" : "/auth/login"}
              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
            >
              {tr.login}
            </Link>

            <Link
              href="/"
              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
            >
              {tr.home}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
