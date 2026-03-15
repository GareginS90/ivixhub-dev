"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    brand: "IvixHUB",
    clientHeroTitle: "Вход в аккаунт",
    psychHeroTitle: "Вход для психолога",
    clientHeroText:
      "Войдите в аккаунт, чтобы продолжить бронирование, открыть личный кабинет, посмотреть сессии и управлять оплатами.",
    psychHeroText:
      "Войдите как психолог, чтобы продолжить onboarding, управлять профессиональным профилем и перейти к следующим шагам верификации.",
    clientHero1: "Единый вход для клиента в личный кабинет платформы.",
    clientHero2: "После входа можно бронировать, оплачивать и управлять своими сессиями.",
    clientHero3: "Если аккаунта ещё нет, сначала создайте его через регистрацию.",
    psychHero1: "Это вход для psychologist flow, а не для обычного клиентского пути.",
    psychHero2: "После входа психолог продолжает onboarding и профессиональный профиль.",
    psychHero3: "Если аккаунта ещё нет, сначала создайте аккаунт психолога.",
    clientTitle: "Вход клиента",
    psychTitle: "Вход психолога",
    clientSubtitle: "Введите email и пароль, чтобы войти в клиентский аккаунт.",
    psychSubtitle: "Введите email и пароль, чтобы войти в аккаунт психолога.",
    email: "Email",
    password: "Пароль",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Введите пароль",
    submitClient: "Войти",
    submitPsych: "Войти как психолог",
    submitting: "Вход...",
    register: "У меня ещё нет аккаунта",
    home: "Вернуться на главную",
    switchPsych: "Я психолог",
    switchClient: "Я клиент",
    error: "Ошибка",
    failed: "Не удалось выполнить вход"
  },
  en: {
    brand: "IvixHUB",
    clientHeroTitle: "Sign in",
    psychHeroTitle: "Psychologist sign in",
    clientHeroText:
      "Sign in to continue booking, open your dashboard, view sessions, and manage payments.",
    psychHeroText:
      "Sign in as a psychologist to continue onboarding, manage your professional profile, and proceed with verification steps.",
    clientHero1: "Single entry point for the client dashboard.",
    clientHero2: "After sign in, you can book, pay, and manage your sessions.",
    clientHero3: "If you do not have an account yet, create one first.",
    psychHero1: "This sign in is for the psychologist flow, not the regular client path.",
    psychHero2: "After sign in, the psychologist continues onboarding and profile completion.",
    psychHero3: "If you do not have an account yet, create a psychologist account first.",
    clientTitle: "Client sign in",
    psychTitle: "Psychologist sign in",
    clientSubtitle: "Enter your email and password to sign in to your client account.",
    psychSubtitle: "Enter your email and password to sign in to your psychologist account.",
    email: "Email",
    password: "Password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter password",
    submitClient: "Sign in",
    submitPsych: "Sign in as psychologist",
    submitting: "Signing in...",
    register: "I do not have an account yet",
    home: "Back to home",
    switchPsych: "I am a psychologist",
    switchClient: "I am a client",
    error: "Error",
    failed: "Sign in failed"
  },
  hy: {
    brand: "IvixHUB",
    clientHeroTitle: "Մուտք հաշիվ",
    psychHeroTitle: "Մուտք հոգեբանի համար",
    clientHeroText:
      "Մուտք գործեք, որպեսզի շարունակեք ամրագրումը, բացեք անձնական էջը, տեսնեք սեանսները և կառավարեք վճարումները։",
    psychHeroText:
      "Մուտք գործեք որպես հոգեբան՝ onboarding-ը շարունակելու, մասնագիտական պրոֆիլը կառավարելու և վերիֆիկացիայի հաջորդ քայլերին անցնելու համար։",
    clientHero1: "Միասնական մուտք հաճախորդի անձնական էջի համար։",
    clientHero2: "Մուտքից հետո կարող եք ամրագրել, վճարել և կառավարել սեանսները։",
    clientHero3: "Եթե դեռ հաշիվ չունեք, նախ ստեղծեք այն գրանցման միջոցով։",
    psychHero1: "Սա մուտք է psychologist flow-ի համար, ոչ թե սովորական հաճախորդի ուղու։",
    psychHero2: "Մուտքից հետո հոգեբանը շարունակում է onboarding-ը և պրոֆիլի լրացումը։",
    psychHero3: "Եթե դեռ հաշիվ չունեք, նախ ստեղծեք հոգեբանի հաշիվ։",
    clientTitle: "Հաճախորդի մուտք",
    psychTitle: "Հոգեբանի մուտք",
    clientSubtitle: "Մուտքագրեք email-ը և գաղտնաբառը հաճախորդի հաշիվ մուտք գործելու համար։",
    psychSubtitle: "Մուտքագրեք email-ը և գաղտնաբառը հոգեբանի հաշիվ մուտք գործելու համար։",
    email: "Email",
    password: "Գաղտնաբառ",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Մուտքագրեք գաղտնաբառը",
    submitClient: "Մուտք",
    submitPsych: "Մուտք որպես հոգեբան",
    submitting: "Մուտք է կատարվում...",
    register: "Ես դեռ հաշիվ չունեմ",
    home: "Վերադառնալ գլխավոր էջ",
    switchPsych: "Ես հոգեբան եմ",
    switchClient: "Ես հաճախորդ եմ",
    error: "Սխալ",
    failed: "Չհաջողվեց մուտք գործել"
  }
} as const;

type Lang = keyof typeof TXT;

export default function LoginPage() {
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
  const next = searchParams.get("next");
  const isPsychologist =
    searchParams.get("role") === "psychologist" ||
    (next?.startsWith("/psychologists/onboarding") ?? false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.failed);
        return;
      }

      const redirectTo = next || (isPsychologist ? "/psychologists/onboarding/profile" : "/app");
      router.replace(redirectTo);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || tr.failed);
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
                href="/auth/login?role=psychologist&next=/psychologists/onboarding/profile"
                className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
              >
                {tr.switchPsych}
              </Link>
            ) : (
              <Link
                href="/auth/login"
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
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                placeholder={tr.passwordPlaceholder}
                required
              />
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
              href={isPsychologist ? "/auth/register?role=psychologist" : "/auth/register"}
              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
            >
              {tr.register}
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
