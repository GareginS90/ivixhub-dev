"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";
import PsychologistName from "@/components/psychologists/PsychologistName";
import ClientPersonalInfoCard from "@/components/account/ClientPersonalInfoCard";
import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { NotificationsPreviewCard } from "@/components/notifications/NotificationsPreviewCard";

type Lang = "hy" | "ru" | "en";

type Booking = {
  id: number;
  psychologistId: number;
  startAtUtc: string;
  endAtUtc: string;
  type: string;
  language: string;
  status: string;
};

const TXT = {
  hy: {
    eyebrow: "Իմ IviXHub-ը",
    title: "Անձնական էջ",
    subtitle:
      "Ձեր հանդիպումները, ամրագրումները և IviXHub-ի հիմնական գործիքները՝ մեկ տեղում։",

    quiz: "Համապատասխանության թեստ",
    quizDesc: "Գտնել ձեզ համապատասխան մասնագետի ուղղությունը։",

    catalog: "Գտնել հոգեբան",
    catalogDesc: "Բացել կատալոգը և ընտրել հարմար մասնագետ ու ժամ։",

    support: "Աջակցություն",
    supportDesc: "Օգնություն, կանոններ և հաճախ տրվող հարցեր։",

    myReviews: "Իմ կարծիքները",
    myReviewsDesc: "Կառավարել կարծիքներն ու գնահատականները։",

    account: "Իմ պրոֆիլը",
    accountDesc: "Անձնական տվյալներ և հաշվի կարգավորումներ։",

    openProfile: "Բացել պրոֆիլը",
    notifications: "Ծանուցումներ",
    notificationsDesc: "Տեսնել բոլոր նորությունները և հիշեցումները։",

    pending: "Սպասում են վճարման",
    pendingDesc: "Ավարտեք վճարումը՝ հանդիպումը հաստատելու համար։",

    upcoming: "Առաջիկա հանդիպումներ",
    upcomingDesc: "Ձեր հաստատված և սպասվող հանդիպումները։",

    past: "Հանդիպումների պատմություն",
    pastDesc: "Ավարտված և չեղարկված հանդիպումները։",

    noPending: "Վճարման սպասող ամրագրումներ չկան։",
    noUpcoming: "Առաջիկա հանդիպումներ դեռ չկան։",
    noPast: "Հանդիպումների պատմությունը դեռ դատարկ է։",

    psychologist: "Հոգեբան",
    date: "Ամսաթիվ",
    time: "Ժամ",
    type: "Ձևաչափ",
    language: "Լեզու",

    logout: "Դուրս գալ",
    loggingOut: "Դուրս ենք գալիս…",

    loading: "Բեռնվում են ձեր հանդիպումները…",
    error: "Սխալ",

    continuePayment: "Շարունակել վճարումը",
    openBooking: "Բացել հանդիպումը",

    pendingCount: "Վճարման սպասող",
    upcomingCount: "Առաջիկա",
    historyCount: "Պատմություն",

    individual: "Անհատական",
    couples: "Զույգի համար",
    group: "Խմբային",

    armenian: "Հայերեն",
    russian: "Русский",
    english: "English",

    statusConfirmed: "Հաստատված",
    statusPending: "Սպասում է վճարման",
    statusCompleted: "Ավարտված",
    statusCancelled: "Չեղարկված",
    statusExpired: "Ժամկետանց",
    statusDefault: "Ընթացիկ",

    quickActions: "Արագ գործողություններ",
    sessionNumber: "Ամրագրում"
  },

  ru: {
    eyebrow: "Мой IviXHub",
    title: "Личный кабинет",
    subtitle:
      "Ваши сессии, бронирования и основные инструменты IviXHub — в одном месте.",

    quiz: "Тест подбора",
    quizDesc: "Определить подходящее направление специалиста.",

    catalog: "Найти психолога",
    catalogDesc: "Открыть каталог и выбрать специалиста и время.",

    support: "Поддержка",
    supportDesc: "Помощь, правила и ответы на частые вопросы.",

    myReviews: "Мои отзывы",
    myReviewsDesc: "Управлять отзывами и оценками.",

    account: "Мой профиль",
    accountDesc: "Личные данные и настройки аккаунта.",

    openProfile: "Открыть профиль",
    notifications: "Уведомления",
    notificationsDesc: "Все новости, обновления и напоминания.",

    pending: "Ожидают оплаты",
    pendingDesc: "Завершите оплату, чтобы подтвердить сессию.",

    upcoming: "Предстоящие сессии",
    upcomingDesc: "Ваши подтверждённые и ожидаемые сессии.",

    past: "История сессий",
    pastDesc: "Завершённые и отменённые сессии.",

    noPending: "Нет бронирований, ожидающих оплаты.",
    noUpcoming: "Предстоящих сессий пока нет.",
    noPast: "История сессий пока пуста.",

    psychologist: "Психолог",
    date: "Дата",
    time: "Время",
    type: "Формат",
    language: "Язык",

    logout: "Выйти",
    loggingOut: "Выходим…",

    loading: "Загружаем ваши сессии…",
    error: "Ошибка",

    continuePayment: "Продолжить оплату",
    openBooking: "Открыть сессию",

    pendingCount: "Ожидают оплаты",
    upcomingCount: "Предстоящие",
    historyCount: "История",

    individual: "Индивидуальная",
    couples: "Для пары",
    group: "Групповая",

    armenian: "Հայերեն",
    russian: "Русский",
    english: "English",

    statusConfirmed: "Подтверждено",
    statusPending: "Ожидает оплаты",
    statusCompleted: "Завершено",
    statusCancelled: "Отменено",
    statusExpired: "Истекло",
    statusDefault: "Активно",

    quickActions: "Быстрые действия",
    sessionNumber: "Бронирование"
  },

  en: {
    eyebrow: "My IviXHub",
    title: "Dashboard",
    subtitle:
      "Your sessions, bookings and essential IviXHub tools — all in one place.",

    quiz: "Matching quiz",
    quizDesc: "Discover the specialist direction that may suit you.",

    catalog: "Find a psychologist",
    catalogDesc: "Browse specialists and choose a convenient time.",

    support: "Support",
    supportDesc: "Help, policies and frequently asked questions.",

    myReviews: "My reviews",
    myReviewsDesc: "Manage your reviews and ratings.",

    account: "My profile",
    accountDesc: "Personal information and account settings.",

    openProfile: "Open profile",
    notifications: "Notifications",
    notificationsDesc: "See all updates, news and reminders.",

    pending: "Pending payment",
    pendingDesc: "Complete payment to confirm your session.",

    upcoming: "Upcoming sessions",
    upcomingDesc: "Your confirmed and scheduled sessions.",

    past: "Session history",
    pastDesc: "Completed and cancelled sessions.",

    noPending: "No bookings are waiting for payment.",
    noUpcoming: "There are no upcoming sessions yet.",
    noPast: "Your session history is still empty.",

    psychologist: "Psychologist",
    date: "Date",
    time: "Time",
    type: "Format",
    language: "Language",

    logout: "Logout",
    loggingOut: "Logging out…",

    loading: "Loading your sessions…",
    error: "Error",

    continuePayment: "Continue payment",
    openBooking: "Open session",

    pendingCount: "Pending payment",
    upcomingCount: "Upcoming",
    historyCount: "History",

    individual: "Individual",
    couples: "Couples",
    group: "Group",

    armenian: "Հայերեն",
    russian: "Русский",
    english: "English",

    statusConfirmed: "Confirmed",
    statusPending: "Pending payment",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    statusExpired: "Expired",
    statusDefault: "Active",

    quickActions: "Quick actions",
    sessionNumber: "Booking"
  }
} as const;

function localeFor(lang: Lang) {
  if (lang === "hy") return "hy-AM";
  if (lang === "ru") return "ru-RU";
  return "en-US";
}

function fmtDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(localeFor(lang), {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function fmtTime(iso: string, lang: Lang) {
  return new Date(iso).toLocaleTimeString(localeFor(lang), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function isPendingPayment(status: string) {
  const value = (status || "").toUpperCase();

  return (
    value === "CREATED" ||
    value === "PENDING_PAYMENT" ||
    value === "INITIATED"
  );
}

function isPast(status: string, startAtUtc: string) {
  const value = (status || "").toUpperCase();

  if (
    value === "COMPLETED" ||
    value === "CANCELLED" ||
    value === "CANCELLED_BY_CLIENT" ||
    value === "CANCELLED_BY_PSYCHOLOGIST" ||
    value === "EXPIRED_PAYMENT"
  ) {
    return true;
  }

  return new Date(startAtUtc).getTime() < Date.now();
}

function isUpcoming(status: string, startAtUtc: string) {
  const value = (status || "").toUpperCase();

  if (isPendingPayment(value)) {
    return false;
  }

  if (
    value === "COMPLETED" ||
    value === "CANCELLED" ||
    value === "CANCELLED_BY_CLIENT" ||
    value === "CANCELLED_BY_PSYCHOLOGIST" ||
    value === "EXPIRED_PAYMENT"
  ) {
    return false;
  }

  return new Date(startAtUtc).getTime() >= Date.now();
}

function sessionTypeLabel(
  type: string,
  tr: (typeof TXT)[Lang]
) {
  const value = (type || "").toUpperCase();

  if (value === "SELF") return tr.individual;
  if (value === "COUPLES") return tr.couples;
  if (value === "GROUP") return tr.group;

  return type || "—";
}

function languageLabel(
  language: string,
  tr: (typeof TXT)[Lang]
) {
  const value = (language || "").toUpperCase();

  if (value === "HY") return tr.armenian;
  if (value === "RU") return tr.russian;
  if (value === "EN") return tr.english;

  return language || "—";
}

function statusMeta(
  status: string,
  tr: (typeof TXT)[Lang]
) {
  const value = (status || "").toUpperCase();

  if (value === "CONFIRMED") {
    return {
      label: tr.statusConfirmed,
      cls: "border-[#078b7b]/12 bg-[#e8f8f5] text-[#078b7b]"
    };
  }

  if (
    value === "CREATED" ||
    value === "INITIATED" ||
    value === "PENDING_PAYMENT"
  ) {
    return {
      label: tr.statusPending,
      cls: "border-amber-200 bg-amber-50 text-amber-700"
    };
  }

  if (value === "COMPLETED") {
    return {
      label: tr.statusCompleted,
      cls: "border-[#3977e8]/12 bg-[#eef5ff] text-[#3977e8]"
    };
  }

  if (
    value === "CANCELLED" ||
    value === "CANCELLED_BY_CLIENT" ||
    value === "CANCELLED_BY_PSYCHOLOGIST"
  ) {
    return {
      label: tr.statusCancelled,
      cls: "border-rose-200 bg-rose-50 text-rose-700"
    };
  }

  if (value === "EXPIRED_PAYMENT") {
    return {
      label: tr.statusExpired,
      cls: "border-slate-200 bg-slate-50 text-slate-600"
    };
  }

  return {
    label: tr.statusDefault,
    cls: "border-[#7657df]/12 bg-[#f3f0ff] text-[#7657df]"
  };
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

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function SparklesIcon() {
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
      <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" />
      <path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" />
      <path d="m5 13 .7 1.8 1.8.7-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7L5 13Z" />
    </svg>
  );
}

function UserIcon() {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function ChatIcon() {
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
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.3-4A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

function StarIcon() {
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
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

function StatusBadge({
  status,
  tr
}: {
  status: string;
  tr: (typeof TXT)[Lang];
}) {
  const meta = statusMeta(status, tr);

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.055em] ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

function StatCard({
  value,
  label,
  tone
}: {
  value: number;
  label: string;
  tone: "teal" | "blue" | "violet";
}) {
  const styles = {
    teal: {
      box: "from-[#e9f9f6] to-[#f7fcfb]",
      value: "text-[#078b7b]",
      dot: "bg-[#078b7b]"
    },
    blue: {
      box: "from-[#edf5ff] to-[#f8fbff]",
      value: "text-[#3977e8]",
      dot: "bg-[#3977e8]"
    },
    violet: {
      box: "from-[#f2efff] to-[#faf9ff]",
      value: "text-[#7657df]",
      dot: "bg-[#7657df]"
    }
  } as const;

  const style = styles[tone];

  return (
    <div
      className={`rounded-[24px] border border-white/80 bg-gradient-to-br ${style.box} p-5 shadow-[0_10px_30px_rgba(7,63,67,0.04)]`}
    >
      <div className="flex items-center justify-between">
        <div className={`text-3xl font-black ${style.value}`}>
          {value}
        </div>

        <span className={`size-2.5 rounded-full ${style.dot}`} />
      </div>

      <div className="mt-2 text-xs font-extrabold text-[#6d8385]">
        {label}
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-[#073f43]/7 bg-white/92 p-5 shadow-[0_10px_30px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/25 hover:shadow-[0_18px_42px_rgba(7,63,67,0.075)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-[#eef8f7] text-[#078b7b] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#078b7b] group-hover:to-[#3977e8] group-hover:text-white">
          {icon}
        </div>

        <span className="mt-1 text-[#8aa0a1] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#078b7b]">
          <ArrowRightIcon />
        </span>
      </div>

      <div className="mt-4 text-sm font-black text-[#234d50]">
        {title}
      </div>

      <div className="mt-1.5 text-xs leading-5 text-[#819293]">
        {description}
      </div>
    </Link>
  );
}

function EmptyState({
  text
}: {
  text: string;
}) {
  return (
    <div className="mt-4 rounded-[24px] border border-dashed border-[#073f43]/12 bg-white/65 px-5 py-8 text-center text-sm font-medium text-[#7b8f90]">
      {text}
    </div>
  );
}

function BookingCard({
  booking,
  tr,
  lang,
  payment = false
}: {
  booking: Booking;
  tr: (typeof TXT)[Lang];
  lang: Lang;
  payment?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-[#073f43]/7 bg-white shadow-[0_12px_35px_rgba(7,63,67,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/22 hover:shadow-[0_20px_48px_rgba(7,63,67,0.085)]">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#95a5a6]">
              {tr.sessionNumber}
            </div>

            <div className="mt-1 text-sm font-black text-[#31595b]">
              #{booking.id}
            </div>
          </div>

          <StatusBadge
            status={booking.status}
            tr={tr}
          />
        </div>

        <div className="mt-5">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.065em] text-[#91a1a2]">
            {tr.psychologist}
          </div>

          <div className="mt-1 text-base font-black text-[#173f42]">
            <PsychologistName
              psychologistId={booking.psychologistId}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] bg-[#f6fafa] p-3.5">
            <div className="flex items-center gap-2 text-[#078b7b]">
              <CalendarIcon />
              <span className="text-[10px] font-black uppercase tracking-[0.06em]">
                {tr.date}
              </span>
            </div>

            <div className="mt-2 text-xs font-extrabold leading-5 text-[#49696b]">
              {fmtDate(booking.startAtUtc, lang)}
            </div>
          </div>

          <div className="rounded-[18px] bg-[#f6fafa] p-3.5">
            <div className="flex items-center gap-2 text-[#3977e8]">
              <ClockIcon />
              <span className="text-[10px] font-black uppercase tracking-[0.06em]">
                {tr.time}
              </span>
            </div>

            <div className="mt-2 text-xs font-extrabold leading-5 text-[#49696b]">
              {fmtTime(booking.startAtUtc, lang)}
              {" – "}
              {fmtTime(booking.endAtUtc, lang)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#edf8f6] px-3 py-1.5 text-[11px] font-extrabold text-[#078b7b]">
            {sessionTypeLabel(booking.type, tr)}
          </span>

          <span className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-[11px] font-extrabold text-[#3977e8]">
            {languageLabel(booking.language, tr)}
          </span>
        </div>
      </div>

      <div className="border-t border-[#073f43]/6 bg-[#fbfdfd] p-4">
        <Link
          href={
            payment
              ? `/app/checkout/${booking.id}`
              : `/app/bookings/${booking.id}`
          }
          className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold transition-all duration-300 ${
            payment
              ? "bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] text-white shadow-[0_10px_25px_rgba(21,159,175,0.20)] hover:-translate-y-0.5"
              : "border border-[#073f43]/9 bg-white text-[#4f6d6f] hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b]"
          }`}
        >
          {payment
            ? tr.continuePayment
            : tr.openBooking}

          <ArrowRightIcon />
        </Link>
      </div>
    </article>
  );
}

function SectionHeading({
  title,
  description,
  count
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-black tracking-[-0.03em] text-[#173f42] sm:text-2xl">
          {title}
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-[#7b8e90]">
          {description}
        </p>
      </div>

      <div className="flex size-10 items-center justify-center rounded-full bg-white text-sm font-black text-[#557476] shadow-sm">
        {count}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("hy");
  const tr = TXT[lang];

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const syncLang = () => {
      setLang(getUiLangFromCookie() as Lang);
    };

    syncLang();

    const onFocus = () => syncLang();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        syncLang();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener(
      "visibilitychange",
      onVisible
    );

    const timer = window.setInterval(syncLang, 700);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener(
        "visibilitychange",
        onVisible
      );
      window.clearInterval(timer);
    };
  }, []);

  async function logout() {
    setLogoutLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });

      router.replace("/auth/login");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "/api/bookings/my",
          {
            cache: "no-store" as RequestCache
          }
        );

        if (!response.ok) {
          const payload = await response
            .json()
            .catch(() => null);

          setError(
            payload?.message ||
              `Failed to load bookings (${response.status})`
          );

          return;
        }

        const data = await response.json();

        setItems(
          Array.isArray(data) ? data : []
        );
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pending = useMemo(
    () =>
      items
        .filter((item) =>
          isPendingPayment(item.status)
        )
        .sort((a, b) =>
          a.startAtUtc.localeCompare(b.startAtUtc)
        ),
    [items]
  );

  const upcoming = useMemo(
    () =>
      items
        .filter((item) =>
          isUpcoming(
            item.status,
            item.startAtUtc
          )
        )
        .sort((a, b) =>
          a.startAtUtc.localeCompare(b.startAtUtc)
        ),
    [items]
  );

  const past = useMemo(
    () =>
      items
        .filter((item) =>
          isPast(
            item.status,
            item.startAtUtc
          )
        )
        .sort((a, b) =>
          b.startAtUtc.localeCompare(a.startAtUtc)
        ),
    [items]
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_2%_8%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_12%,rgba(118,87,223,0.10),transparent_31%),radial-gradient(circle_at_55%_40%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/88 px-6 py-8 shadow-[0_24px_75px_rgba(7,63,67,0.08)] backdrop-blur-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/8 to-[#7657df]/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                {tr.eyebrow}
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-[#073f43] sm:text-[44px] sm:leading-[1.08]">
                {tr.title}
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#687f81]">
                {tr.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsBell href="/app/notifications" />

              <button
                type="button"
                onClick={logout}
                disabled={logoutLoading}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#073f43]/9 bg-white px-5 text-sm font-extrabold text-[#557173] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutLoading
                  ? tr.loggingOut
                  : tr.logout}
              </button>
            </div>
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
            <StatCard
              value={pending.length}
              label={tr.pendingCount}
              tone="teal"
            />

            <StatCard
              value={upcoming.length}
              label={tr.upcomingCount}
              tone="blue"
            />

            <StatCard
              value={past.length}
              label={tr.historyCount}
              tone="violet"
            />
          </div>
        </section>

        <div className="mt-6">
          <ClientPersonalInfoCard />
        </div>

        <section className="mt-8">
          <div className="mb-4 text-xs font-black uppercase tracking-[0.09em] text-[#819596]">
            {tr.quickActions}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              href="/psychologists"
              title={tr.catalog}
              description={tr.catalogDesc}
              icon={<SearchIcon />}
            />

            <QuickAction
              href="/quiz"
              title={tr.quiz}
              description={tr.quizDesc}
              icon={<SparklesIcon />}
            />

            <QuickAction
              href="/app/reviews"
              title={tr.myReviews}
              description={tr.myReviewsDesc}
              icon={<StarIcon />}
            />

            <QuickAction
              href="/support"
              title={tr.support}
              description={tr.supportDesc}
              icon={<ChatIcon />}
            />
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <Link
            href="/app/account/profile"
            className="group flex items-center gap-4 rounded-[26px] border border-[#073f43]/7 bg-white/90 p-5 shadow-[0_12px_35px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/22 hover:shadow-[0_18px_42px_rgba(7,63,67,0.07)]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#edf8f6] text-[#078b7b]">
              <UserIcon />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-[#31595b]">
                {tr.account}
              </div>

              <div className="mt-1 text-xs leading-5 text-[#819293]">
                {tr.accountDesc}
              </div>
            </div>

            <span className="text-[#8da0a1] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRightIcon />
            </span>
          </Link>

          <Link
            href="/app/notifications"
            className="group flex items-center gap-4 rounded-[26px] border border-[#073f43]/7 bg-white/90 p-5 shadow-[0_12px_35px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#3977e8]/20 hover:shadow-[0_18px_42px_rgba(7,63,67,0.07)]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#eef5ff] text-[#3977e8]">
              <CalendarIcon />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-[#31595b]">
                {tr.notifications}
              </div>

              <div className="mt-1 text-xs leading-5 text-[#819293]">
                {tr.notificationsDesc}
              </div>
            </div>

            <span className="text-[#8da0a1] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRightIcon />
            </span>
          </Link>
        </section>

        <div className="mt-6">
          <NotificationsPreviewCard href="/app/notifications" />
        </div>

        {loading && (
          <div className="mt-8 rounded-[28px] border border-white/80 bg-white/90 p-7 shadow-[0_16px_45px_rgba(7,63,67,0.05)]">
            <div className="flex items-center gap-3 text-sm font-bold text-[#60797b]">
              <span className="size-5 animate-spin rounded-full border-2 border-[#12b8c4]/20 border-t-[#078b7b]" />
              {tr.loading}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-[26px] border border-red-200 bg-red-50/90 p-5 text-sm font-medium leading-6 text-red-800">
            <span className="font-black">
              {tr.error}:
            </span>{" "}
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 space-y-12">
            {pending.length > 0 && (
              <section>
                <SectionHeading
                  title={tr.pending}
                  description={tr.pendingDesc}
                  count={pending.length}
                />

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {pending.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      tr={tr}
                      lang={lang}
                      payment
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionHeading
                title={tr.upcoming}
                description={tr.upcomingDesc}
                count={upcoming.length}
              />

              {upcoming.length === 0 ? (
                <EmptyState text={tr.noUpcoming} />
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {upcoming.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      tr={tr}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeading
                title={tr.past}
                description={tr.pastDesc}
                count={past.length}
              />

              {past.length === 0 ? (
                <EmptyState text={tr.noPast} />
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {past.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      tr={tr}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </section>

            {pending.length === 0 && (
              <div className="sr-only">
                {tr.noPending}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
