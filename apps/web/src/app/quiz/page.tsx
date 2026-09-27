"use client";

import { useRouter } from "next/navigation";
import { getUiLangFromCookie, type UiLang } from "@/i18n/client";
import { useEffect, useState } from "react";

type Lang = "HY" | "RU" | "EN";
type Issue =
  | "ANXIETY"
  | "DEPRESSION"
  | "RELATIONSHIPS"
  | "STRESS"
  | "SELF_ESTEEM"
  | "TRAUMA";
type Duration = "DAYS" | "WEEKS" | "MONTHS" | "YEAR_PLUS";
type Format = "VIDEO" | "CHAT" | "ANY";

const TXT = {
  hy: {
    eyebrow: "IviXHub կարճ թեստ",
    title: "Գտնենք քեզ համապատասխան մասնագետին",
    subtitle:
      "Պատասխանիր մի քանի կարճ հարցի, և մենք կօգնենք նեղացնել մասնագետների ընտրությունը՝ ըստ քո կարիքների։",
    privacy: "Մոտ 1 րոպե",
    step: "Անհատական ընտրություն",
    sessionLanguage: "Սեանսի նախընտրելի լեզուն",
    sessionLanguageHint:
      "Ընտրիր այն լեզուն, որով քեզ առավել հարմար կլինի խոսել մասնագետի հետ։",
    armenian: "Հայերեն",
    russian: "Ռուսերեն",
    english: "Անգլերեն",
    issue: "Ի՞նչն է հիմա քեզ ամենից շատ անհանգստացնում։",
    issueHint: "Ընտրիր այն տարբերակը, որն ամենամոտն է քո իրավիճակին։",
    anxiety: "Տագնապ",
    depression: "Ընկճված տրամադրություն",
    relationships: "Հարաբերություններ",
    stress: "Սթրես / հուզական այրում",
    selfEsteem: "Ինքնագնահատական",
    trauma: "Տրավմատիկ / ծանր փորձ",
    duration: "Որքա՞ն ժամանակ է սա շարունակվում։",
    durationHint: "Մոտավոր ժամանակահատվածը բավարար է։",
    days: "Մի քանի օր",
    weeks: "Մի քանի շաբաթ",
    months: "Մի քանի ամիս",
    yearPlus: "Մեկ տարուց ավելի",
    format: "Սեանսի նախընտրելի ձևաչափը",
    formatHint: "Եթե դեռ չգիտես՝ ընտրիր «Ցանկացած»։",
    any: "Ցանկացած",
    video: "Տեսազանգ",
    chat: "Չատ",
    result: "Տեսնել համապատասխան մասնագետներին",
    required: "Ընտրիր խնդիրը և դրա տևողությունը՝ շարունակելու համար։",
    note:
      "Թեստը ախտորոշում չէ։ Այն միայն օգնում է ընտրության սկզբնական փուլում։",
    selected: "Ընտրված է"
  },
  ru: {
    eyebrow: "Короткий тест IviXHub",
    title: "Найдём подходящего вам специалиста",
    subtitle:
      "Ответьте на несколько коротких вопросов, и мы поможем сузить выбор специалистов с учётом ваших потребностей.",
    privacy: "Около 1 минуты",
    step: "Персональный подбор",
    sessionLanguage: "Предпочтительный язык сессии",
    sessionLanguageHint:
      "Выберите язык, на котором вам будет комфортнее общаться со специалистом.",
    armenian: "Армянский",
    russian: "Русский",
    english: "Английский",
    issue: "Что беспокоит вас больше всего сейчас?",
    issueHint: "Выберите вариант, который ближе всего к вашей ситуации.",
    anxiety: "Тревога",
    depression: "Пониженное настроение",
    relationships: "Отношения",
    stress: "Стресс / выгорание",
    selfEsteem: "Самооценка",
    trauma: "Травматический / тяжёлый опыт",
    duration: "Как давно это продолжается?",
    durationHint: "Достаточно указать примерный период.",
    days: "Несколько дней",
    weeks: "Несколько недель",
    months: "Несколько месяцев",
    yearPlus: "Больше года",
    format: "Предпочтительный формат сессии",
    formatHint: "Если пока не уверены, выберите «Любой».",
    any: "Любой",
    video: "Видеозвонок",
    chat: "Чат",
    result: "Показать подходящих специалистов",
    required: "Выберите основной запрос и его длительность, чтобы продолжить.",
    note:
      "Тест не является диагностикой. Он лишь помогает на первом этапе выбора.",
    selected: "Выбрано"
  },
  en: {
    eyebrow: "IviXHub quick test",
    title: "Let's find the right specialist for you",
    subtitle:
      "Answer a few short questions and we'll help narrow down the specialists based on your needs.",
    privacy: "About 1 minute",
    step: "Personal matching",
    sessionLanguage: "Preferred session language",
    sessionLanguageHint:
      "Choose the language you would feel most comfortable using with your specialist.",
    armenian: "Armenian",
    russian: "Russian",
    english: "English",
    issue: "What is bothering you the most right now?",
    issueHint: "Choose the option that feels closest to your situation.",
    anxiety: "Anxiety",
    depression: "Low mood",
    relationships: "Relationships",
    stress: "Stress / burnout",
    selfEsteem: "Self-esteem",
    trauma: "Trauma / difficult experience",
    duration: "How long has this been going on?",
    durationHint: "An approximate period is enough.",
    days: "A few days",
    weeks: "A few weeks",
    months: "A few months",
    yearPlus: "More than a year",
    format: "Preferred session format",
    formatHint: "If you're not sure yet, choose “Any”.",
    any: "Any",
    video: "Video call",
    chat: "Chat",
    result: "Show matching specialists",
    required: "Choose your main concern and its duration to continue.",
    note:
      "This test is not a diagnosis. It only helps with the initial specialist selection.",
    selected: "Selected"
  }
} as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m18.5 16 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </svg>
  );
}

function OptionButton({
  active,
  title,
  onClick
}: {
  active: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "group flex min-h-[58px] w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left",
        "transition duration-200 ease-out hover:-translate-y-0.5",
        active
          ? "border-[#078b7b] bg-[#073f43] text-white shadow-[0_12px_30px_rgba(7,63,67,0.14)]"
          : "border-[#dce9e9] bg-white text-[#073f43] hover:border-[#9fd6d1] hover:shadow-[0_10px_28px_rgba(7,63,67,0.08)]"
      ].join(" ")}
    >
      <span className="text-[14px] font-semibold leading-5 sm:text-[15px]">
        {title}
      </span>

      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
          active
            ? "border-white/25 bg-white/15 text-white"
            : "border-[#dce9e9] bg-[#f8fbfc] text-transparent group-hover:border-[#9fd6d1]"
        ].join(" ")}
      >
        <CheckIcon />
      </span>
    </button>
  );
}

export default function QuizPage() {
  const router = useRouter();

  const [uiLang, setUiLang] = useState<UiLang>("hy");
  const [sessionLang, setSessionLang] = useState<Lang>("HY");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [format, setFormat] = useState<Format>("ANY");

  useEffect(() => {
    const current = getUiLangFromCookie();
    setUiLang(current);
    setSessionLang(current.toUpperCase() as Lang);
  }, []);

  useEffect(() => {
    const syncLanguage = () => {
      setUiLang(getUiLangFromCookie());
    };

    window.addEventListener("focus", syncLanguage);
    window.addEventListener("pageshow", syncLanguage);

    return () => {
      window.removeEventListener("focus", syncLanguage);
      window.removeEventListener("pageshow", syncLanguage);
    };
  }, []);

  const tr = TXT[uiLang];
  const canSubmit = Boolean(issue && duration);

  const issueOptions: Array<[Issue, string]> = [
    ["ANXIETY", tr.anxiety],
    ["DEPRESSION", tr.depression],
    ["RELATIONSHIPS", tr.relationships],
    ["STRESS", tr.stress],
    ["SELF_ESTEEM", tr.selfEsteem],
    ["TRAUMA", tr.trauma]
  ];

  const durationOptions: Array<[Duration, string]> = [
    ["DAYS", tr.days],
    ["WEEKS", tr.weeks],
    ["MONTHS", tr.months],
    ["YEAR_PLUS", tr.yearPlus]
  ];

  const formatOptions: Array<[Format, string]> = [
    ["ANY", tr.any],
    ["VIDEO", tr.video],
    ["CHAT", tr.chat]
  ];

  const sessionLanguageOptions: Array<[Lang, string, string]> = [
    ["HY", "HY", tr.armenian],
    ["RU", "RU", tr.russian],
    ["EN", "EN", tr.english]
  ];

  function submit() {
    if (!issue || !duration) return;

    const sp = new URLSearchParams();
    sp.set("lang", sessionLang);
    sp.set("issue", issue);
    sp.set("duration", duration);
    sp.set("format", format);

    router.push(`/quiz/result?${sp.toString()}`);
  }

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#f8fbfc]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(circle at 12% 10%, rgba(18,184,196,0.12), transparent 34%), radial-gradient(circle at 88% 4%, rgba(118,87,223,0.09), transparent 31%)"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe5e4] bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#078b7b] shadow-sm backdrop-blur">
            <SparkIcon />
            {tr.eyebrow}
          </div>

          <h1 className="mx-auto mt-5 max-w-3xl text-[34px] font-bold leading-[1.12] tracking-[-0.035em] text-[#073f43] sm:text-[44px] lg:text-[52px]">
            {tr.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#587174] sm:text-base">
            {tr.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce9e9] bg-white px-3.5 py-2 text-xs font-semibold text-[#49686b] shadow-sm">
              <ClockIcon />
              {tr.privacy}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce9e9] bg-white px-3.5 py-2 text-xs font-semibold text-[#49686b] shadow-sm">
              <SparkIcon />
              {tr.step}
            </span>
          </div>
        </section>

        <section className="mx-auto mt-9 max-w-4xl rounded-[30px] border border-[#dce9e9] bg-white/95 p-5 shadow-[0_24px_70px_rgba(7,63,67,0.09)] backdrop-blur sm:p-7 lg:p-9">
          <div className="border-b border-[#e5eeee] pb-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="text-lg font-bold tracking-[-0.015em] text-[#073f43]">
                  {tr.sessionLanguage}
                </div>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#6b8082]">
                  {tr.sessionLanguageHint}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {sessionLanguageOptions.map(([value, short, label]) => {
                const active = sessionLang === value;

                return (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={active}
                    onClick={() => setSessionLang(value)}
                    className={[
                      "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition duration-200",
                      active
                        ? "border-[#078b7b] bg-[#eaf8f6] text-[#073f43] shadow-[0_8px_22px_rgba(7,139,123,0.08)]"
                        : "border-[#dce9e9] bg-white text-[#49686b] hover:border-[#9fd6d1] hover:bg-[#f8fbfc]"
                    ].join(" ")}
                  >
                    <span>
                      <span className="block text-[11px] font-extrabold tracking-[0.12em] text-[#078b7b]">
                        {short}
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold">
                        {label}
                      </span>
                    </span>

                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full",
                        active
                          ? "bg-[#078b7b] text-white"
                          : "bg-[#f0f6f6] text-transparent"
                      ].join(" ")}
                    >
                      <CheckIcon />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-b border-[#e5eeee] py-7">
            <div className="text-lg font-bold tracking-[-0.015em] text-[#073f43]">
              {tr.issue}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-[#6b8082]">
              {tr.issueHint}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {issueOptions.map(([value, label]) => (
                <OptionButton
                  key={value}
                  active={issue === value}
                  title={label}
                  onClick={() => setIssue(value)}
                />
              ))}
            </div>
          </div>

          <div className="border-b border-[#e5eeee] py-7">
            <div className="text-lg font-bold tracking-[-0.015em] text-[#073f43]">
              {tr.duration}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-[#6b8082]">
              {tr.durationHint}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {durationOptions.map(([value, label]) => (
                <OptionButton
                  key={value}
                  active={duration === value}
                  title={label}
                  onClick={() => setDuration(value)}
                />
              ))}
            </div>
          </div>

          <div className="pt-7">
            <div className="text-lg font-bold tracking-[-0.015em] text-[#073f43]">
              {tr.format}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-[#6b8082]">
              {tr.formatHint}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {formatOptions.map(([value, label]) => (
                <OptionButton
                  key={value}
                  active={format === value}
                  title={label}
                  onClick={() => setFormat(value)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[22px] border border-[#d9ecea] bg-[#f2faf9] p-4 sm:p-5">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#073f43] px-5 py-3.5 text-center text-sm font-bold text-white shadow-[0_12px_28px_rgba(7,63,67,0.18)] transition hover:-translate-y-0.5 hover:bg-[#078b7b] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-[#073f43] sm:text-[15px]"
            >
              {tr.result}
            </button>

            {!canSubmit && (
              <p className="mt-3 text-center text-xs leading-5 text-[#718789]">
                {tr.required}
              </p>
            )}
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-[#819294]">
            {tr.note}
          </p>
        </section>
      </div>
    </main>
  );
}
