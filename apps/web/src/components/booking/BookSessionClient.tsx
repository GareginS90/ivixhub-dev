"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type SessionType = "SELF" | "COUPLES" | "GROUP";
type SessionLanguage = "HY" | "RU" | "EN";

type Slot = {
  startAtUtc: string;
  endAtUtc: string;
  available: boolean;
};

const TXT = {
  ru: {
    back: "Вернуться к профилю",
    logged: "Вы вошли в аккаунт",
    login: "Войти для бронирования",
    title: "Забронировать сессию",
    subtitle:
      "Выберите формат, язык и удобное время. Время автоматически отображается в вашей локальной часовой зоне.",
    policy: "Условия отмены",
    policyShort: "Перед подтверждением ознакомьтесь с условиями отмены.",
    p1: "При отмене за 24 часа и более до начала сессии возврат составляет 100%.",
    p2: "Если до начала сессии осталось меньше 24 часов, возврат составляет 40%.",
    p3: "Оплата защищена через escrow.",
    type: "Формат сессии",
    language: "Язык сессии",
    duration: "Длительность",
    chooseDay: "Выберите день",
    chooseTime: "Выберите время",
    noSlots: "Для выбранного формата пока нет доступных слотов.",
    confirm: "Проверьте детали",
    confirmBtn: "Подтвердить бронирование",
    creating: "Создаём бронирование…",
    backBtn: "Изменить",
    loading: "Загружаем доступное время…",
    slotTaken: "Этот слот уже забронирован. Пожалуйста, выберите другой.",
    individual: "Индивидуальная",
    couples: "Для пары",
    group: "Групповая",
    individualHint: "50 минут",
    couplesHint: "90 минут",
    groupHint: "3 часа",
    individualDesc: "Персональная сессия один на один",
    couplesDesc: "Совместная сессия для пары",
    groupDesc: "Сессия в групповом формате",
    booked: "Занято",
    selected: "Выбрано",
    summary: "Ваше бронирование",
    day: "Дата",
    time: "Время",
    notSelected: "Не выбрано",
    secure: "Безопасная оплата",
    secureText: "После бронирования вы перейдёте к защищённой оплате.",
    localTime: "Локальное время",
    stepFormat: "Формат",
    stepSchedule: "Дата и время",
    stepConfirm: "Подтверждение"
  },
  en: {
    back: "Back to profile",
    logged: "You are signed in",
    login: "Login to book",
    title: "Book a session",
    subtitle:
      "Choose the session format, language and a convenient time. Times are automatically shown in your local timezone.",
    policy: "Cancellation policy",
    policyShort: "Please review the cancellation policy before confirming.",
    p1: "If you cancel 24 hours or more before the session, the refund is 100%.",
    p2: "If less than 24 hours remain before the session, the refund is 40%.",
    p3: "Your payment is protected through escrow.",
    type: "Session format",
    language: "Session language",
    duration: "Duration",
    chooseDay: "Choose a day",
    chooseTime: "Choose a time",
    noSlots: "There are no available slots for this session format yet.",
    confirm: "Review the details",
    confirmBtn: "Confirm booking",
    creating: "Creating booking…",
    backBtn: "Change",
    loading: "Loading available times…",
    slotTaken: "This slot has already been booked. Please choose another one.",
    individual: "Individual",
    couples: "Couples",
    group: "Group",
    individualHint: "50 minutes",
    couplesHint: "90 minutes",
    groupHint: "3 hours",
    individualDesc: "One-to-one personal session",
    couplesDesc: "A joint session for a couple",
    groupDesc: "A session in a group format",
    booked: "Booked",
    selected: "Selected",
    summary: "Your booking",
    day: "Date",
    time: "Time",
    notSelected: "Not selected",
    secure: "Secure payment",
    secureText: "After booking, you will continue to protected checkout.",
    localTime: "Local time",
    stepFormat: "Format",
    stepSchedule: "Date & time",
    stepConfirm: "Confirmation"
  },
  hy: {
    back: "Վերադառնալ պրոֆիլ",
    logged: "Դուք մուտք եք գործել",
    login: "Մուտք գործել ամրագրման համար",
    title: "Ամրագրել հանդիպում",
    subtitle:
      "Ընտրեք հանդիպման ձևաչափը, լեզուն և հարմար ժամը։ Ժամերը ավտոմատ ցուցադրվում են ձեր տեղական ժամային գոտով։",
    policy: "Չեղարկման պայմաններ",
    policyShort: "Հաստատելուց առաջ ծանոթացեք չեղարկման պայմաններին։",
    p1: "Եթե հանդիպումը չեղարկեք սկսվելուց 24 ժամ կամ ավելի շուտ, վերադարձը կկազմի 100%։",
    p2: "Եթե հանդիպման մեկնարկին մնացել է 24 ժամից քիչ, վերադարձը կկազմի 40%։",
    p3: "Վճարումը պաշտպանված է escrow համակարգով։",
    type: "Հանդիպման ձևաչափ",
    language: "Հանդիպման լեզու",
    duration: "Տևողություն",
    chooseDay: "Ընտրեք օրը",
    chooseTime: "Ընտրեք ժամը",
    noSlots: "Ընտրված ձևաչափի համար առայժմ ազատ ժամեր չկան։",
    confirm: "Ստուգեք տվյալները",
    confirmBtn: "Հաստատել ամրագրումը",
    creating: "Ստեղծվում է ամրագրումը…",
    backBtn: "Փոխել",
    loading: "Բեռնվում են հասանելի ժամերը…",
    slotTaken: "Այս ժամը արդեն ամրագրվել է։ Խնդրում ենք ընտրել մեկ ուրիշը։",
    individual: "Անհատական",
    couples: "Զույգի համար",
    group: "Խմբային",
    individualHint: "50 րոպե",
    couplesHint: "90 րոպե",
    groupHint: "3 ժամ",
    individualDesc: "Անհատական հանդիպում մասնագետի հետ",
    couplesDesc: "Համատեղ հանդիպում զույգի համար",
    groupDesc: "Հանդիպում խմբային ձևաչափով",
    booked: "Զբաղված",
    selected: "Ընտրված",
    summary: "Ձեր ամրագրումը",
    day: "Ամսաթիվ",
    time: "Ժամ",
    notSelected: "Ընտրված չէ",
    secure: "Անվտանգ վճարում",
    secureText: "Ամրագրումից հետո կանցնեք պաշտպանված վճարման փուլին։",
    localTime: "Տեղական ժամ",
    stepFormat: "Ձևաչափ",
    stepSchedule: "Օր և ժամ",
    stepConfirm: "Հաստատում"
  }
} as const;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );

  return match ? decodeURIComponent(match[2]) : null;
}

function localeFor(lang: Lang) {
  if (lang === "hy") return "hy-AM";
  if (lang === "ru") return "ru-RU";
  return "en-US";
}

function fmtDate(date: Date, lang: Lang) {
  return date.toLocaleDateString(localeFor(lang), {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function fmtTime(date: Date, lang: Lang) {
  return date.toLocaleTimeString(localeFor(lang), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function fmtWeekday(date: Date, lang: Lang) {
  return date.toLocaleDateString(localeFor(lang), {
    weekday: "short"
  });
}

function dayKeyFromIso(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function typeLabel(lang: Lang, type: SessionType) {
  const tr = TXT[lang];

  if (type === "SELF") return tr.individual;
  if (type === "COUPLES") return tr.couples;

  return tr.group;
}

function typeDurationLabel(lang: Lang, type: SessionType) {
  const tr = TXT[lang];

  if (type === "SELF") return tr.individualHint;
  if (type === "COUPLES") return tr.couplesHint;

  return tr.groupHint;
}

function typeDescription(lang: Lang, type: SessionType) {
  const tr = TXT[lang];

  if (type === "SELF") return tr.individualDesc;
  if (type === "COUPLES") return tr.couplesDesc;

  return tr.groupDesc;
}

function languageLabel(value: SessionLanguage) {
  if (value === "HY") return "Հայերեն";
  if (value === "RU") return "Русский";
  return "English";
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
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
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.8 2.8 8.3 7 10 4.2-1.7 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function SummaryRow({
  label,
  value,
  muted = false
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#073f43]/6 py-3.5 last:border-b-0">
      <span className="text-sm font-medium text-[#7a8e90]">
        {label}
      </span>

      <span
        className={`text-right text-sm font-extrabold ${
          muted ? "text-[#9aabab]" : "text-[#31595b]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function BookSessionClient({
  psychologistId
}: {
  psychologistId: number;
}) {
  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const nextUrl = `/psychologists/${psychologistId}/book`;

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<SessionType>("SELF");
  const [sessionLanguage, setSessionLanguage] =
    useState<SessionLanguage>("HY");

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<"SELECT" | "CONFIRM">("SELECT");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthed(getCookie("ivixhub_session") === "1");
  }, []);

  useEffect(() => {
    const from = new Date();
    const to = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000
    );

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url =
          `/api/psychologists/${psychologistId}/slots` +
          `?from=${encodeURIComponent(from.toISOString())}` +
          `&to=${encodeURIComponent(to.toISOString())}` +
          `&type=${encodeURIComponent(type)}`;

        const response = await fetch(url, {
          cache: "no-store" as RequestCache
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          setError(
            payload?.message ||
              `Slots fetch failed (${response.status})`
          );
          return;
        }

        setSlots(Array.isArray(payload) ? payload : []);
        setSelectedSlot(null);
        setStep("SELECT");
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load slots"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [psychologistId, type]);

  const slotsByDate = useMemo(() => {
    const unique = new Map<string, Slot>();

    for (const slot of slots) {
      const key = `${slot.startAtUtc}__${slot.endAtUtc}`;
      const previous = unique.get(key);

      if (!previous) {
        unique.set(key, slot);
      } else {
        unique.set(key, {
          ...slot,
          available: previous.available && slot.available
        });
      }
    }

    const map = new Map<string, Slot[]>();

    for (const slot of unique.values()) {
      const dateKey = dayKeyFromIso(slot.startAtUtc);

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }

      map.get(dateKey)!.push(slot);
    }

    for (const items of map.values()) {
      items.sort((a, b) =>
        a.startAtUtc.localeCompare(b.startAtUtc)
      );
    }

    return Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [slots]);

  useEffect(() => {
    if (slotsByDate.length === 0) {
      setSelectedDay(null);
      return;
    }

    if (
      !selectedDay ||
      !slotsByDate.find(([day]) => day === selectedDay)
    ) {
      setSelectedDay(slotsByDate[0][0]);
    }
  }, [slotsByDate, selectedDay]);

  const visibleSlots = useMemo(() => {
    if (!selectedDay) return [];

    const found = slotsByDate.find(
      ([day]) => day === selectedDay
    );

    return found ? found[1] : [];
  }, [slotsByDate, selectedDay]);

  async function createBooking() {
    if (
      !selectedSlot ||
      creating ||
      !selectedSlot.available
    ) {
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          psychologistId,
          startAtUtc: selectedSlot.startAtUtc,
          type,
          language: sessionLanguage
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const details = payload?.details || "";

        if (details.includes("Slot is already booked")) {
          setError(tr.slotTaken);
          setSelectedSlot(null);
          setStep("SELECT");
          return;
        }

        setError(
          payload?.details
            ? `${payload?.message || "Booking create failed"} | ${payload.details}`
            : payload?.message || "Booking create failed"
        );

        return;
      }

      if (payload?.id) {
        window.location.href = `/app/checkout/${payload.id}`;
      }
    } finally {
      setCreating(false);
    }
  }

  const selectedDateText = selectedSlot
    ? fmtDate(new Date(selectedSlot.startAtUtc), lang)
    : tr.notSelected;

  const selectedTimeText = selectedSlot
    ? `${fmtTime(
        new Date(selectedSlot.startAtUtc),
        lang
      )} – ${fmtTime(
        new Date(selectedSlot.endAtUtc),
        lang
      )}`
    : tr.notSelected;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[720px] bg-[radial-gradient(circle_at_2%_8%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_12%,rgba(118,87,223,0.10),transparent_31%),radial-gradient(circle_at_55%_40%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/psychologists/${psychologistId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
          >
            <ArrowLeftIcon />
            {tr.back}
          </Link>

          {!mounted ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-white/70" />
          ) : !isAuthed ? (
            <Link
              href={`/auth/login?next=${encodeURIComponent(
                nextUrl
              )}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#073f43]/8 bg-white px-5 text-sm font-extrabold text-[#31595b] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b]"
            >
              {tr.login}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#078b7b]/10 bg-[#e8f8f5] px-4 py-2.5 text-xs font-extrabold text-[#078b7b]">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#078b7b] text-white">
                <CheckIcon />
              </span>
              {tr.logged}
            </span>
          )}
        </div>

        <section className="mt-7 overflow-hidden rounded-[34px] border border-white/80 bg-white/86 shadow-[0_24px_75px_rgba(7,63,67,0.08)] backdrop-blur-xl">
          <div className="relative overflow-hidden px-6 py-8 sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/8 to-[#7657df]/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                <CalendarIcon />
                {tr.localTime}
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-[#073f43] sm:text-[44px] sm:leading-[1.08]">
                {tr.title}
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#687f81]">
                {tr.subtitle}
              </p>
            </div>

            <div className="relative mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-[18px] bg-[#e8f8f5] px-3 py-3 text-center">
                <div className="mx-auto flex size-7 items-center justify-center rounded-full bg-[#078b7b] text-xs font-black text-white">
                  1
                </div>
                <div className="mt-2 text-[11px] font-extrabold text-[#397071] sm:text-xs">
                  {tr.stepFormat}
                </div>
              </div>

              <div
                className={`rounded-[18px] px-3 py-3 text-center ${
                  selectedSlot
                    ? "bg-[#eaf4ff]"
                    : "bg-[#f6f9f9]"
                }`}
              >
                <div
                  className={`mx-auto flex size-7 items-center justify-center rounded-full text-xs font-black ${
                    selectedSlot
                      ? "bg-[#3977e8] text-white"
                      : "bg-[#e4eded] text-[#6f8384]"
                  }`}
                >
                  2
                </div>
                <div className="mt-2 text-[11px] font-extrabold text-[#60797b] sm:text-xs">
                  {tr.stepSchedule}
                </div>
              </div>

              <div
                className={`rounded-[18px] px-3 py-3 text-center ${
                  step === "CONFIRM"
                    ? "bg-[#f0edff]"
                    : "bg-[#f6f9f9]"
                }`}
              >
                <div
                  className={`mx-auto flex size-7 items-center justify-center rounded-full text-xs font-black ${
                    step === "CONFIRM"
                      ? "bg-[#7657df] text-white"
                      : "bg-[#e4eded] text-[#6f8384]"
                  }`}
                >
                  3
                </div>
                <div className="mt-2 text-[11px] font-extrabold text-[#60797b] sm:text-xs">
                  {tr.stepConfirm}
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-[24px] border border-red-200 bg-red-50/90 p-5 text-sm font-medium leading-6 text-red-800 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-6 rounded-[30px] border border-white/80 bg-white/90 p-8 shadow-[0_18px_55px_rgba(7,63,67,0.06)]">
            <div className="flex items-center gap-3 text-sm font-bold text-[#60797b]">
              <span className="size-5 animate-spin rounded-full border-2 border-[#12b8c4]/20 border-t-[#078b7b]" />
              {tr.loading}
            </div>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="space-y-6">
              <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.065)] sm:p-8">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.09em] text-[#12a2a4]">
                    01
                  </span>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-[#173f42]">
                    {tr.type}
                  </h2>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {(
                    ["SELF", "COUPLES", "GROUP"] as const
                  ).map((sessionType) => {
                    const active = type === sessionType;

                    return (
                      <button
                        type="button"
                        key={sessionType}
                        onClick={() => setType(sessionType)}
                        className={`group min-h-[132px] rounded-[24px] border p-4 text-left transition-all duration-300 ${
                          active
                            ? "border-[#12b8c4]/35 bg-gradient-to-br from-[#e9f9f6] via-[#eef9fb] to-[#f1f0ff] shadow-[0_14px_35px_rgba(18,184,196,0.10)]"
                            : "border-[#073f43]/8 bg-[#fbfdfd] hover:-translate-y-1 hover:border-[#12b8c4]/25 hover:bg-white hover:shadow-[0_14px_35px_rgba(7,63,67,0.07)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex size-9 items-center justify-center rounded-full ${
                              active
                                ? "bg-[#078b7b] text-white"
                                : "bg-[#edf7f6] text-[#078b7b]"
                            }`}
                          >
                            {active ? (
                              <CheckIcon />
                            ) : (
                              <span className="size-2 rounded-full bg-current" />
                            )}
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                              active
                                ? "bg-white/80 text-[#078b7b]"
                                : "bg-[#f1f5f5] text-[#738788]"
                            }`}
                          >
                            {typeDurationLabel(
                              lang,
                              sessionType
                            )}
                          </span>
                        </div>

                        <div className="mt-4 text-sm font-black text-[#234d50]">
                          {typeLabel(lang, sessionType)}
                        </div>

                        <div className="mt-1.5 text-xs leading-5 text-[#819293]">
                          {typeDescription(
                            lang,
                            sessionType
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-[#073f43]/7 pt-7">
                  <h3 className="text-sm font-black text-[#31595b]">
                    {tr.language}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {(
                      ["HY", "RU", "EN"] as const
                    ).map((language) => {
                      const active =
                        sessionLanguage === language;

                      return (
                        <button
                          type="button"
                          key={language}
                          onClick={() =>
                            setSessionLanguage(language)
                          }
                          className={`rounded-full border px-4 py-2.5 text-sm font-extrabold transition-all duration-300 ${
                            active
                              ? "border-transparent bg-gradient-to-r from-[#078b7b] to-[#159faf] text-white shadow-[0_8px_22px_rgba(7,139,123,0.18)]"
                              : "border-[#073f43]/9 bg-white text-[#597476] hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-[#f4fbfa]"
                          }`}
                        >
                          {languageLabel(language)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.065)] sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-[14px] bg-[#eef8fb] text-[#159faf]">
                    <CalendarIcon />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.09em] text-[#3977e8]">
                      02
                    </span>
                    <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                      {tr.chooseDay}
                    </h2>
                  </div>
                </div>

                {slotsByDate.length === 0 ? (
                  <div className="mt-5 rounded-[22px] border border-[#073f43]/7 bg-[#f8fbfb] p-5 text-sm leading-6 text-[#718687]">
                    {tr.noSlots}
                  </div>
                ) : (
                  <>
                    <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                      {slotsByDate.map(([day]) => {
                        const date = new Date(
                          day + "T00:00:00"
                        );
                        const active =
                          selectedDay === day;

                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => {
                              setSelectedDay(day);
                              setSelectedSlot(null);
                              setStep("SELECT");
                            }}
                            className={`min-w-[126px] rounded-[22px] border px-4 py-3.5 text-left transition-all duration-300 ${
                              active
                                ? "border-transparent bg-gradient-to-br from-[#078b7b] via-[#159faf] to-[#3977e8] text-white shadow-[0_12px_28px_rgba(21,159,175,0.22)]"
                                : "border-[#073f43]/8 bg-[#fbfdfd] text-[#426466] hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:bg-white"
                            }`}
                          >
                            <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] opacity-75">
                              {fmtWeekday(date, lang)}
                            </div>

                            <div className="mt-1 text-sm font-black">
                              {fmtDate(date, lang)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-7 flex items-center gap-2 text-sm font-black text-[#31595b]">
                      <ClockIcon />
                      {tr.chooseTime}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                      {visibleSlots.map((slot) => {
                        const active =
                          selectedSlot?.startAtUtc ===
                          slot.startAtUtc;

                        return (
                          <button
                            type="button"
                            key={`${slot.startAtUtc}-${slot.endAtUtc}`}
                            disabled={!slot.available}
                            onClick={() => {
                              if (!slot.available) return;

                              setSelectedSlot(slot);
                              setStep("CONFIRM");
                            }}
                            className={`min-h-[76px] rounded-[20px] border px-3 py-3 text-center transition-all duration-300 ${
                              !slot.available
                                ? "cursor-not-allowed border-[#073f43]/5 bg-[#f3f6f6] text-[#a5b0b1]"
                                : active
                                  ? "border-[#7657df]/15 bg-gradient-to-br from-[#078b7b] via-[#159faf] to-[#3977e8] text-white shadow-[0_12px_28px_rgba(57,119,232,0.20)]"
                                  : "border-[#073f43]/8 bg-white text-[#31595b] hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-[#f6fbfb] hover:shadow-sm"
                            }`}
                          >
                            <div className="text-sm font-black">
                              {fmtTime(
                                new Date(slot.startAtUtc),
                                lang
                              )}
                            </div>

                            <div
                              className={`mt-1.5 text-[10px] font-extrabold ${
                                active
                                  ? "text-white/80"
                                  : ""
                              }`}
                            >
                              {!slot.available
                                ? tr.booked
                                : active
                                  ? tr.selected
                                  : `${fmtTime(
                                      new Date(
                                        slot.endAtUtc
                                      ),
                                      lang
                                    )}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>

              {step === "CONFIRM" && selectedSlot && (
                <section className="overflow-hidden rounded-[30px] border border-[#7657df]/12 bg-white shadow-[0_18px_55px_rgba(118,87,223,0.08)]">
                  <div className="bg-[radial-gradient(circle_at_100%_0%,rgba(118,87,223,0.12),transparent_42%),radial-gradient(circle_at_0%_0%,rgba(18,184,196,0.12),transparent_42%)] p-6 sm:p-8">
                    <span className="text-xs font-black uppercase tracking-[0.09em] text-[#7657df]">
                      03
                    </span>

                    <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-[#173f42]">
                      {tr.confirm}
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[20px] border border-white/80 bg-white/80 p-4 backdrop-blur">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#87999a]">
                          {tr.day}
                        </div>
                        <div className="mt-1.5 text-sm font-black text-[#31595b]">
                          {selectedDateText}
                        </div>
                      </div>

                      <div className="rounded-[20px] border border-white/80 bg-white/80 p-4 backdrop-blur">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#87999a]">
                          {tr.time}
                        </div>
                        <div className="mt-1.5 text-sm font-black text-[#31595b]">
                          {selectedTimeText}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep("SELECT")}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#073f43]/10 bg-white px-6 text-sm font-extrabold text-[#557173] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:bg-[#f7fbfb]"
                      >
                        {tr.backBtn}
                      </button>

                      {isAuthed ? (
                        <button
                          type="button"
                          onClick={createBooking}
                          disabled={creating}
                          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-6 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(21,159,175,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_17px_38px_rgba(57,119,232,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {creating
                            ? tr.creating
                            : tr.confirmBtn}

                          {!creating && <ArrowRightIcon />}
                        </button>
                      ) : (
                        <Link
                          href={`/auth/login?next=${encodeURIComponent(
                            nextUrl
                          )}`}
                          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-6 text-center text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(21,159,175,0.24)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {tr.login}
                          <ArrowRightIcon />
                        </Link>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <section className="overflow-hidden rounded-[30px] border border-white/80 bg-white/94 shadow-[0_20px_60px_rgba(7,63,67,0.08)] backdrop-blur-xl">
                <div className="bg-[radial-gradient(circle_at_100%_0%,rgba(57,119,232,0.10),transparent_42%),radial-gradient(circle_at_0%_0%,rgba(18,184,196,0.11),transparent_45%)] p-6">
                  <h2 className="text-lg font-black tracking-[-0.025em] text-[#173f42]">
                    {tr.summary}
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-[#7b8e90]">
                    {tr.localTime}
                  </p>
                </div>

                <div className="px-6 pb-5">
                  <SummaryRow
                    label={tr.type}
                    value={typeLabel(lang, type)}
                  />

                  <SummaryRow
                    label={tr.duration}
                    value={typeDurationLabel(lang, type)}
                  />

                  <SummaryRow
                    label={tr.language}
                    value={languageLabel(sessionLanguage)}
                  />

                  <SummaryRow
                    label={tr.day}
                    value={selectedDateText}
                    muted={!selectedSlot}
                  />

                  <SummaryRow
                    label={tr.time}
                    value={selectedTimeText}
                    muted={!selectedSlot}
                  />
                </div>
              </section>

              <section className="rounded-[26px] border border-[#078b7b]/10 bg-[#f1faf8] p-5">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#078b7b] shadow-sm">
                    <ShieldIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#31595b]">
                      {tr.secure}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#718687]">
                      {tr.secureText}
                    </p>
                  </div>
                </div>
              </section>

              <details className="group rounded-[26px] border border-[#073f43]/7 bg-white/92 p-5 shadow-[0_12px_35px_rgba(7,63,67,0.045)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-[#31595b]">
                  {tr.policy}

                  <span className="flex size-7 items-center justify-center rounded-full bg-[#f1f6f6] text-lg font-medium text-[#6e8384] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-2 text-xs leading-5 text-[#819293]">
                  {tr.policyShort}
                </p>

                <div className="mt-4 space-y-3 text-xs leading-5 text-[#627b7d]">
                  <div className="rounded-[16px] bg-[#f8fbfb] p-3">
                    {tr.p1}
                  </div>

                  <div className="rounded-[16px] bg-[#f8fbfb] p-3">
                    {tr.p2}
                  </div>

                  <div className="rounded-[16px] bg-[#f8fbfb] p-3">
                    {tr.p3}
                  </div>
                </div>
              </details>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
