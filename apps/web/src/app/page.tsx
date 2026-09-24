"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "hy" | "ru" | "en";

const CONTENT = {
  hy: {
    eyebrow: "Առցանց հոգեբանական աջակցություն",
    titleStart: "Քո հոգեբանական",
    titleAccent: "աջակցությունը՝",
    titleEnd: "մեկ ապահով տարածքում",
    description:
      "Գտիր քեզ համապատասխան ստուգված մասնագետին, ընտրիր հարմար ժամ և ստացիր մասնագիտական աջակցություն առցանց՝ պարզ ու վստահելի ձևով։",

    findPsychologist: "Գտնել հոգեբան",
    takeQuiz: "Անցնել կարճ թեստը",

    confidential: "Գաղտնի",
    professional: "Ստուգված մասնագետներ",
    flexible: "Հարմար ժամանակ",

    startTitle: "Սկսելը պարզ է",
    startDescription:
      "Մի քանի քայլ, և կարող ես ընտրել քեզ համապատասխան մասնագետին։",

    step1: "Պատմիր՝ ինչ աջակցություն ես փնտրում",
    step1Text:
      "Կարճ թեստը կօգնի հասկանալ համապատասխան ուղղությունն ու մասնագիտացումը։",

    step2: "Ընտրիր մասնագետին",
    step2Text:
      "Դիտիր ստուգված հոգեբանների պրոֆիլները, լեզուները, մեթոդներն ու հասանելի ժամերը։",

    step3: "Ամրագրիր հանդիպումը",
    step3Text:
      "Ընտրիր հարմար ժամը և շարունակիր ամբողջ գործընթացը IviXHub-ի անվտանգ միջավայրում։",

    quizEyebrow: "Չգիտե՞ս՝ ում ընտրել",
    quizTitle: "Սկսիր կարճ ընտրության թեստից",
    quizDescription:
      "Մի քանի պարզ հարցերի միջոցով կօգնենք նեղացնել ընտրությունը և գտնել քո կարիքներին համապատասխան մասնագետների։",
    quizAction: "Սկսել թեստը",

    specialistsEyebrow: "Մասնագետներ",
    specialistsTitle: "Գտիր այն հոգեբանին, ում հետ քեզ հարմար կլինի խոսել",
    specialistsDescription:
      "Փնտրիր ըստ լեզվի, մասնագիտացման և աշխատանքի մեթոդի։ Յուրաքանչյուր մասնագետ անցնում է հարթակի ստուգման գործընթացը։",
    specialistsAction: "Բացել հոգեբանների կատալոգը",

    psychologistEyebrow: "Հոգեբանների համար",
    psychologistTitle: "Միացիր IviXHub մասնագիտական համայնքին",
    psychologistDescription:
      "Ստեղծիր մասնագիտական պրոֆիլ, անցիր ստուգումը և կառավարիր հասանելիությունն ու հանդիպումները մեկ աշխատանքային միջավայրում։",
    psychologistAction: "Դառնալ IviXHub-ի հոգեբան",

    finalTitle: "Առաջին քայլը կարող է շատ պարզ լինել",
    finalDescription:
      "Ընտրիր մասնագետ կամ սկսիր կարճ թեստից։ Մնացած ճանապարհը IviXHub-ը կդարձնի պարզ և հասկանալի։",
    finalPrimary: "Գտնել հոգեբան",
    finalSecondary: "Անցնել թեստը"
  },

  ru: {
    eyebrow: "Онлайн-психологическая поддержка",
    titleStart: "Психологическая",
    titleAccent: "поддержка",
    titleEnd: "в одном безопасном пространстве",
    description:
      "Найдите подходящего проверенного специалиста, выберите удобное время и получите профессиональную поддержку онлайн — просто и спокойно.",

    findPsychologist: "Найти психолога",
    takeQuiz: "Пройти короткий тест",

    confidential: "Конфиденциально",
    professional: "Проверенные специалисты",
    flexible: "Удобное время",

    startTitle: "Начать просто",
    startDescription:
      "Несколько понятных шагов — и вы сможете выбрать подходящего специалиста.",

    step1: "Расскажите, какая поддержка вам нужна",
    step1Text:
      "Короткий тест поможет определить подходящее направление и специализацию.",

    step2: "Выберите специалиста",
    step2Text:
      "Сравните профили, языки, методы работы и доступное время проверенных психологов.",

    step3: "Забронируйте встречу",
    step3Text:
      "Выберите удобное время и продолжите весь процесс в безопасной среде IviXHub.",

    quizEyebrow: "Не знаете, кого выбрать?",
    quizTitle: "Начните с короткого теста",
    quizDescription:
      "Несколько простых вопросов помогут сузить выбор и найти специалистов, подходящих под ваш запрос.",
    quizAction: "Начать тест",

    specialistsEyebrow: "Специалисты",
    specialistsTitle: "Найдите психолога, с которым вам будет комфортно",
    specialistsDescription:
      "Ищите по языку, специализации и методу работы. Каждый специалист проходит процесс проверки платформы.",
    specialistsAction: "Открыть каталог психологов",

    psychologistEyebrow: "Для психологов",
    psychologistTitle: "Присоединяйтесь к профессиональному сообществу IviXHub",
    psychologistDescription:
      "Создайте профессиональный профиль, пройдите проверку и управляйте доступностью и встречами в одном рабочем пространстве.",
    psychologistAction: "Стать психологом IviXHub",

    finalTitle: "Первый шаг может быть очень простым",
    finalDescription:
      "Выберите специалиста или начните с короткого теста. IviXHub поможет сделать дальнейший путь понятным.",
    finalPrimary: "Найти психолога",
    finalSecondary: "Пройти тест"
  },

  en: {
    eyebrow: "Online psychological support",
    titleStart: "Psychological",
    titleAccent: "support",
    titleEnd: "in one safe space",
    description:
      "Find a verified specialist who fits your needs, choose a convenient time, and access professional support online in a simple and trusted way.",

    findPsychologist: "Find a psychologist",
    takeQuiz: "Take the short quiz",

    confidential: "Confidential",
    professional: "Verified specialists",
    flexible: "Flexible scheduling",

    startTitle: "Getting started is simple",
    startDescription:
      "A few clear steps are all it takes to find the right specialist.",

    step1: "Tell us what support you need",
    step1Text:
      "A short quiz can help identify a relevant direction and specialization.",

    step2: "Choose your specialist",
    step2Text:
      "Explore verified profiles, languages, therapy methods, and available times.",

    step3: "Book your session",
    step3Text:
      "Choose a convenient time and continue the process inside IviXHub's secure environment.",

    quizEyebrow: "Not sure who to choose?",
    quizTitle: "Start with a short matching quiz",
    quizDescription:
      "A few simple questions can narrow the search and help you discover specialists aligned with your needs.",
    quizAction: "Start the quiz",

    specialistsEyebrow: "Specialists",
    specialistsTitle: "Find a psychologist you feel comfortable talking to",
    specialistsDescription:
      "Search by language, specialization, and therapy method. Every specialist goes through the platform's verification process.",
    specialistsAction: "Browse psychologists",

    psychologistEyebrow: "For psychologists",
    psychologistTitle: "Join the IviXHub professional community",
    psychologistDescription:
      "Create your professional profile, complete verification, and manage availability and sessions from one workspace.",
    psychologistAction: "Join IviXHub as a psychologist",

    finalTitle: "The first step can be simple",
    finalDescription:
      "Choose a specialist or begin with the short quiz. IviXHub will keep the rest of the journey clear.",
    finalPrimary: "Find a psychologist",
    finalSecondary: "Take the quiz"
  }
} as const;

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function StepCard({
  number,
  title,
  text
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="group rounded-[1.8rem] border border-[#073f43]/10 bg-white p-6 shadow-[0_14px_45px_rgba(7,63,67,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/30 hover:bg-gradient-to-br hover:from-white hover:via-[#f3fcfb] hover:to-[#f2f4ff] hover:shadow-[0_22px_60px_rgba(57,119,232,0.12)] sm:p-7">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e4f8f5] via-[#eaf8fb] to-[#efecff] text-sm font-black text-[#087f78] transition duration-300 group-hover:scale-105">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em] text-[#073f43]">
        {title}
      </h3>

      <p className="mt-3 text-[15px] leading-7 text-[#607172]">
        {text}
      </p>
    </article>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("hy");

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());

    syncLang();

    window.addEventListener("focus", syncLang);

    return () => {
      window.removeEventListener("focus", syncLang);
    };
  }, []);

  const t = CONTENT[lang];

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#fbfefd]">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_10%_20%,rgba(18,184,196,0.10),transparent_28%),radial-gradient(circle_at_90%_64%,rgba(118,87,223,0.09),transparent_30%)]" />

        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-24">
          <div className="max-w-[680px]">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#12b8c4]/20 bg-white/85 px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-[#087f78] shadow-[0_8px_28px_rgba(7,63,67,0.06)] backdrop-blur sm:text-sm">
              <span className="size-2 rounded-full bg-[#12b8c4] shadow-[0_0_0_5px_rgba(18,184,196,0.10)]" />
              {t.eyebrow}
            </div>

            <h1 className="mt-7 max-w-[650px] text-balance text-[2.55rem] font-black leading-[1.08] tracking-[-0.045em] text-[#073f43] sm:text-[3.25rem] lg:text-[3.65rem]">
              {t.titleStart}{" "}
              <span className="ivix-gradient-text">
                {t.titleAccent}
              </span>{" "}
              {t.titleEnd}
            </h1>

            <p className="mt-6 max-w-[610px] text-pretty text-lg leading-8 text-[#607172]">
              {t.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/psychologists"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#075f62] via-[#078b7b] to-[#12aeba] px-6 py-3.5 font-bold text-white shadow-[0_14px_35px_rgba(7,139,123,0.20)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(18,184,196,0.28)]"
              >
                {t.findPsychologist}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>

              <Link
                href="/quiz"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#3977e8]/18 bg-white px-6 py-3.5 font-bold text-[#315fbd] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#7657df]/28 hover:bg-gradient-to-r hover:from-[#f0fbfb] hover:to-[#f3efff] hover:text-[#6049c7] hover:shadow-[0_16px_36px_rgba(89,92,210,0.13)]"
              >
                {t.takeQuiz}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {[t.confidential, t.professional, t.flexible].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-[#526d6f]"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#e7f8f5] text-[#078b7b]">
                    <CheckIcon />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] lg:justify-self-end">
            <div className="absolute -inset-8 -z-20 rounded-[3rem] bg-gradient-to-br from-[#12b8c4]/18 via-[#3977e8]/8 to-[#7657df]/18 blur-3xl" />

            <div className="group relative rounded-[2.2rem] border border-[#073f43]/9 bg-white/85 p-4 shadow-[0_28px_80px_rgba(7,63,67,0.13)] backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-[#3977e8]/20 hover:shadow-[0_34px_90px_rgba(57,119,232,0.17)] sm:p-5">
              <div className="relative overflow-hidden rounded-[1.7rem] bg-white px-5 py-9 sm:px-8 sm:py-11">
                <div className="transition duration-500 group-hover:scale-[1.02]">
                  <BrandLogo size="lg" />
                </div>

                <div className="mx-auto mt-7 h-1 w-28 rounded-full bg-gradient-to-r from-[#078b7b] via-[#12b8c4] to-[#7657df]" />

                <p className="mx-auto mt-6 max-w-sm text-center text-sm font-bold tracking-[0.18em] text-[#607172]">
                  ONLINE PSYCHOLOGICAL SUPPORT
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[t.confidential, t.professional, t.flexible, "IviXHub"].map(
                    (item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-[#073f43]/8 bg-[#f8fbfb] px-4 py-3 text-center text-xs font-bold text-[#526d6f] transition duration-300 group-hover:border-[#12b8c4]/14 group-hover:bg-[#f4fbfb]"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-black tracking-[-0.035em] text-[#073f43] sm:text-4xl">
              {t.startTitle}
            </h2>

            <p className="mt-4 text-lg leading-8 text-[#607172]">
              {t.startDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <StepCard
              number="01"
              title={t.step1}
              text={t.step1Text}
            />
            <StepCard
              number="02"
              title={t.step2}
              text={t.step2Text}
            />
            <StepCard
              number="03"
              title={t.step3}
              text={t.step3Text}
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f5fbfa] py-20 sm:py-24">
        <div className="absolute -left-32 top-0 size-80 rounded-full bg-[#12b8c4]/8 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="text-sm font-extrabold tracking-[0.15em] text-[#078b7b]">
              {t.quizEyebrow}
            </p>

            <h2 className="mt-4 text-balance text-3xl font-black tracking-[-0.035em] text-[#073f43] sm:text-4xl">
              {t.quizTitle}
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#607172]">
              {t.quizDescription}
            </p>

            <Link
              href="/quiz"
              className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-[#087f78] shadow-[0_12px_32px_rgba(7,63,67,0.08)] ring-1 ring-[#078b7b]/15 transition duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-[#eefaf8] hover:to-[#f1efff] hover:text-[#5c4cc5] hover:shadow-[0_18px_42px_rgba(57,119,232,0.13)]"
            >
              {t.quizAction}
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="group rounded-[2rem] border border-[#073f43]/9 bg-white p-7 shadow-[0_16px_48px_rgba(7,63,67,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/25 hover:shadow-[0_22px_55px_rgba(18,184,196,0.12)]">
              <div className="text-4xl font-black ivix-gradient-text">
                01
              </div>
              <p className="mt-5 font-bold leading-7 text-[#073f43]">
                {t.step1}
              </p>
            </div>

            <div className="group rounded-[2rem] border border-[#073f43]/9 bg-white p-7 shadow-[0_16px_48px_rgba(7,63,67,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#7657df]/22 hover:shadow-[0_22px_55px_rgba(118,87,223,0.11)] sm:translate-y-6 sm:hover:translate-y-5">
              <div className="text-4xl font-black ivix-gradient-text">
                02
              </div>
              <p className="mt-5 font-bold leading-7 text-[#073f43]">
                {t.step2}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="group flex flex-col rounded-[2rem] border border-[#073f43]/10 bg-[#fbfefd] p-7 shadow-[0_16px_50px_rgba(7,63,67,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/28 hover:bg-gradient-to-br hover:from-[#f8fefd] hover:to-[#eef8ff] hover:shadow-[0_24px_65px_rgba(57,119,232,0.12)] sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#078b7b]">
                {t.specialistsEyebrow}
              </p>

              <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#073f43] sm:text-3xl">
                {t.specialistsTitle}
              </h2>

              <p className="mt-4 text-base leading-7 text-[#607172]">
                {t.specialistsDescription}
              </p>

              <Link
                href="/psychologists"
                className="group/link mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#078b7b]/18 bg-white px-5 py-3 text-sm font-bold text-[#078b7b] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/35 hover:bg-[#edf9f8]"
              >
                {t.specialistsAction}
                <span className="transition-transform group-hover/link:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </article>

            <article className="group flex flex-col rounded-[2rem] border border-[#073f43]/10 bg-[#fbfefd] p-7 shadow-[0_16px_50px_rgba(7,63,67,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#7657df]/24 hover:bg-gradient-to-br hover:from-[#f9fdfd] hover:to-[#f4f0ff] hover:shadow-[0_24px_65px_rgba(118,87,223,0.11)] sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6655cc]">
                {t.psychologistEyebrow}
              </p>

              <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#073f43] sm:text-3xl">
                {t.psychologistTitle}
              </h2>

              <p className="mt-4 text-base leading-7 text-[#607172]">
                {t.psychologistDescription}
              </p>

              <Link
                href="/auth/register?role=psychologist"
                className="group/link mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#7657df]/18 bg-white px-5 py-3 text-sm font-bold text-[#6655cc] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#7657df]/35 hover:bg-[#f4f0ff]"
              >
                {t.psychologistAction}
                <span className="transition-transform group-hover/link:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] bg-gradient-to-r from-[#075f62] via-[#087f78] to-[#4f63cc] px-6 py-12 text-white shadow-[0_24px_70px_rgba(7,95,98,0.22)] sm:px-10 lg:px-14">
          <div className="absolute -right-16 -top-28 size-72 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-16 size-48 rounded-full border border-white/10" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                {t.finalTitle}
              </h2>

              <p className="mt-4 text-base leading-7 text-white/75 sm:text-lg">
                {t.finalDescription}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/psychologists"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-[#075f62] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#eafaf8] hover:shadow-xl"
              >
                {t.finalPrimary}
              </Link>

              <Link
                href="/quiz"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/18"
              >
                {t.finalSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
