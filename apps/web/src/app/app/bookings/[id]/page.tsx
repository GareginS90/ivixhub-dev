"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";
import PsychologistName from "@/components/psychologists/PsychologistName";
import ReviewFormCard from "@/components/reviews/ReviewFormCard";

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

type PsychologistProfile = {
  gender?: "MALE" | "FEMALE" | "UNSPECIFIED" | null;
  age?: number | null;
};

const TXT = {
  hy: {
    back: "Վերադառնալ անձնական էջ",
    eyebrow: "Հանդիպման մանրամասներ",
    title: "Ձեր հանդիպումը",
    booking: "Ամրագրում",

    psychologist: "Հոգեբան",
    psychologistGender: "Սեռ",
    psychologistAge: "Տարիք",

    date: "Ամսաթիվ",
    start: "Սկիզբ",
    end: "Ավարտ",
    type: "Ձևաչափ",
    language: "Լեզու",
    status: "Կարգավիճակ",

    individual: "Անհատական",
    couples: "Զույգի համար",
    group: "Խմբային",

    armenian: "Հայերեն",
    russian: "Русский",
    english: "English",

    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ",
    years: "տարեկան",

    confirmed: "Հաստատված",
    pending: "Սպասում է վճարման",
    completed: "Ավարտված",
    cancelled: "Չեղարկված",
    expired: "Ժամկետանց",
    active: "Ընթացիկ",

    actions: "Հանդիպման գործողություններ",
    actionsDesc:
      "Այստեղից կարող եք բացել չատը, միանալ տեսասեանսին կամ կառավարել ամրագրումը։",

    openChat: "Բացել չատը",
    chatDesc: "Գրել ձեր հոգեբանին հանդիպման վերաբերյալ։",

    openVideo: "Տեսասեանս",
    videoDesc: "Բացել հանդիպման տեսազանգի սենյակը։",

    cancel: "Չեղարկել ամրագրումը",
    cancelling: "Չեղարկվում է…",
    cancelDesc: "Չեղարկել այս հանդիպումը վերադարձի կանոնների համաձայն։",

    cancelPolicy: "Չեղարկման և վերադարձի պայմաններ",
    cancelPolicyIntro:
      "Վերադարձի չափը կախված է հանդիպման մեկնարկին մնացած ժամանակից։",

    p1: "Հանդիպումից առնվազն 24 ժամ առաջ չեղարկելու դեպքում վերադարձվում է վճարման 100%-ը։",
    p2: "Հանդիպման մեկնարկին 24 ժամից քիչ մնալու դեպքում վերադարձվում է վճարման 40%-ը։",

    lessThan24h:
      "Հանդիպման մեկնարկին մնացել է 24 ժամից քիչ։ Եթե հիմա չեղարկեք, վերադարձը կլինի 40%։",

    moreThan24h:
      "Հանդիպման մեկնարկին մնացել է առնվազն 24 ժամ։ Գործող կանոններով չեղարկման դեպքում վերադարձը կլինի 100%։",

    notFound: "Ամրագրումը չի գտնվել։",
    loadError: "Չհաջողվեց բեռնել ամրագրումը։",
    cancelledOk:
      "Ամրագրումը հաջողությամբ չեղարկվեց։ Վերադառնում ենք անձնական էջ…",

    openCatalog: "Բացել հոգեբանների կատալոգը",
    loading: "Բեռնվում են հանդիպման տվյալները…",
    error: "Սխալ",
    unknown: "—",

    reviewTitle: "Գնահատեք հանդիպումը",
    reviewDesc:
      "Ավարտված հանդիպումից հետո կարող եք թողնել ձեր կարծիքն ու գնահատականը։",

    paymentRequired: "Վճարումն անհրաժեշտ է",
    paymentRequiredDesc:
      "Այս ամրագրումը դեռ սպասում է վճարման։ Վճարումը կատարելուց հետո հանդիպումը կհաստատվի։",
    continuePayment: "Շարունակել վճարումը"
  },

  ru: {
    back: "Вернуться в личный кабинет",
    eyebrow: "Детали сессии",
    title: "Ваша сессия",
    booking: "Бронирование",

    psychologist: "Психолог",
    psychologistGender: "Пол",
    psychologistAge: "Возраст",

    date: "Дата",
    start: "Начало",
    end: "Конец",
    type: "Формат",
    language: "Язык",
    status: "Статус",

    individual: "Индивидуальная",
    couples: "Для пары",
    group: "Групповая",

    armenian: "Հայերեն",
    russian: "Русский",
    english: "English",

    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано",
    years: "лет",

    confirmed: "Подтверждено",
    pending: "Ожидает оплаты",
    completed: "Завершено",
    cancelled: "Отменено",
    expired: "Истекло",
    active: "Активно",

    actions: "Действия с сессией",
    actionsDesc:
      "Отсюда можно открыть чат, перейти к видеосессии или управлять бронированием.",

    openChat: "Открыть чат",
    chatDesc: "Написать психологу по поводу вашей сессии.",

    openVideo: "Видеосессия",
    videoDesc: "Открыть комнату видеосессии.",

    cancel: "Отменить бронирование",
    cancelling: "Отмена…",
    cancelDesc:
      "Отменить эту сессию в соответствии с правилами возврата.",

    cancelPolicy: "Условия отмены и возврата",
    cancelPolicyIntro:
      "Размер возврата зависит от времени, оставшегося до начала сессии.",

    p1: "При отмене минимум за 24 часа до начала сессии возвращается 100% оплаты.",
    p2: "Если до начала сессии осталось менее 24 часов, возвращается 40% оплаты.",

    lessThan24h:
      "До начала сессии осталось менее 24 часов. При отмене сейчас возврат составит 40%.",

    moreThan24h:
      "До начала сессии осталось не менее 24 часов. По действующим правилам при отмене возврат составит 100%.",

    notFound: "Бронирование не найдено.",
    loadError: "Не удалось загрузить бронирование.",
    cancelledOk:
      "Бронирование успешно отменено. Возвращаем вас в личный кабинет…",

    openCatalog: "Открыть каталог психологов",
    loading: "Загружаем данные сессии…",
    error: "Ошибка",
    unknown: "—",

    reviewTitle: "Оцените сессию",
    reviewDesc:
      "После завершённой сессии вы можете оставить отзыв и оценку.",

    paymentRequired: "Требуется оплата",
    paymentRequiredDesc:
      "Это бронирование всё ещё ожидает оплаты. После оплаты сессия будет подтверждена.",
    continuePayment: "Продолжить оплату"
  },

  en: {
    back: "Back to dashboard",
    eyebrow: "Session details",
    title: "Your session",
    booking: "Booking",

    psychologist: "Psychologist",
    psychologistGender: "Gender",
    psychologistAge: "Age",

    date: "Date",
    start: "Start",
    end: "End",
    type: "Format",
    language: "Language",
    status: "Status",

    individual: "Individual",
    couples: "Couples",
    group: "Group",

    armenian: "Հայերեն",
    russian: "Русский",
    english: "English",

    male: "Male",
    female: "Female",
    unspecified: "Not specified",
    years: "years",

    confirmed: "Confirmed",
    pending: "Pending payment",
    completed: "Completed",
    cancelled: "Cancelled",
    expired: "Expired",
    active: "Active",

    actions: "Session actions",
    actionsDesc:
      "Open the chat, join the video session or manage this booking.",

    openChat: "Open chat",
    chatDesc: "Message your psychologist about the session.",

    openVideo: "Video session",
    videoDesc: "Open the video session room.",

    cancel: "Cancel booking",
    cancelling: "Cancelling…",
    cancelDesc:
      "Cancel this session according to the refund policy.",

    cancelPolicy: "Cancellation and refund policy",
    cancelPolicyIntro:
      "The refund amount depends on how much time remains before the session.",

    p1: "If you cancel at least 24 hours before the session, 100% of the payment is refunded.",
    p2: "If less than 24 hours remain before the session, 40% of the payment is refunded.",

    lessThan24h:
      "Less than 24 hours remain before the session. If you cancel now, the refund will be 40%.",

    moreThan24h:
      "At least 24 hours remain before the session. Under the current policy, cancellation will result in a 100% refund.",

    notFound: "Booking not found.",
    loadError: "Failed to load booking.",
    cancelledOk:
      "Booking cancelled successfully. Redirecting you to your dashboard…",

    openCatalog: "Open psychologists catalog",
    loading: "Loading session details…",
    error: "Error",
    unknown: "—",

    reviewTitle: "Rate your session",
    reviewDesc:
      "After a completed session, you can leave your review and rating.",

    paymentRequired: "Payment required",
    paymentRequiredDesc:
      "This booking is still waiting for payment. The session will be confirmed after payment.",
    continuePayment: "Continue payment"
  }
} as const;

function localeFor(lang: Lang) {
  if (lang === "hy") return "hy-AM";
  if (lang === "ru") return "ru-RU";
  return "en-US";
}

function fmtDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(localeFor(lang), {
    weekday: "long",
    day: "2-digit",
    month: "long",
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

function formatGender(
  value: PsychologistProfile["gender"] | null | undefined,
  tr: (typeof TXT)[Lang]
) {
  if (value === "MALE") return tr.male;
  if (value === "FEMALE") return tr.female;
  return tr.unspecified;
}

function formatType(
  value: string,
  tr: (typeof TXT)[Lang]
) {
  const type = (value || "").toUpperCase();

  if (type === "SELF") return tr.individual;
  if (type === "COUPLES") return tr.couples;
  if (type === "GROUP") return tr.group;

  return value || tr.unknown;
}

function formatLanguage(
  value: string,
  tr: (typeof TXT)[Lang]
) {
  const language = (value || "").toUpperCase();

  if (language === "HY") return tr.armenian;
  if (language === "RU") return tr.russian;
  if (language === "EN") return tr.english;

  return value || tr.unknown;
}

function isPendingPayment(status: string) {
  const value = (status || "").toUpperCase();

  return (
    value === "CREATED" ||
    value === "INITIATED" ||
    value === "PENDING_PAYMENT"
  );
}

function statusMeta(
  status: string,
  tr: (typeof TXT)[Lang]
) {
  const value = (status || "").toUpperCase();

  if (value === "CONFIRMED") {
    return {
      label: tr.confirmed,
      cls: "border-[#078b7b]/15 bg-[#e8f8f5] text-[#078b7b]"
    };
  }

  if (isPendingPayment(value)) {
    return {
      label: tr.pending,
      cls: "border-amber-200 bg-amber-50 text-amber-700"
    };
  }

  if (value === "COMPLETED") {
    return {
      label: tr.completed,
      cls: "border-[#3977e8]/15 bg-[#eef5ff] text-[#3977e8]"
    };
  }

  if (
    value === "CANCELLED" ||
    value === "CANCELLED_BY_CLIENT" ||
    value === "CANCELLED_BY_PSYCHOLOGIST"
  ) {
    return {
      label: tr.cancelled,
      cls: "border-rose-200 bg-rose-50 text-rose-700"
    };
  }

  if (value === "EXPIRED_PAYMENT") {
    return {
      label: tr.expired,
      cls: "border-slate-200 bg-slate-50 text-slate-600"
    };
  }

  return {
    label: tr.active,
    cls: "border-[#7657df]/15 bg-[#f3f0ff] text-[#7657df]"
  };
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

function CalendarIcon() {
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
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
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

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="13" height="12" rx="3" />
      <path d="m16 10 5-3v10l-5-3" />
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

function AlertIcon() {
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
      <path d="M12 3 2.8 19h18.4L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function DetailCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-[#073f43]/7 bg-[#f8fbfb] p-4">
      <div className="flex items-center gap-2 text-[#789091]">
        <span className="text-[#078b7b]">
          {icon}
        </span>

        <span className="text-[10px] font-black uppercase tracking-[0.07em]">
          {label}
        </span>
      </div>

      <div className="mt-2 text-sm font-black leading-6 text-[#31595b]">
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon,
  tone
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: "teal" | "blue";
}) {
  const styles =
    tone === "teal"
      ? {
          icon: "bg-[#e9f8f5] text-[#078b7b]",
          hover:
            "hover:border-[#12b8c4]/25 hover:shadow-[0_18px_42px_rgba(7,139,123,0.08)]"
        }
      : {
          icon: "bg-[#eef5ff] text-[#3977e8]",
          hover:
            "hover:border-[#3977e8]/20 hover:shadow-[0_18px_42px_rgba(57,119,232,0.08)]"
        };

  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-[24px] border border-[#073f43]/7 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 ${styles.hover}`}
    >
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-[16px] ${styles.icon}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-black text-[#31595b]">
          {title}
        </div>

        <div className="mt-1 text-xs leading-5 text-[#819293]">
          {description}
        </div>
      </div>

      <span className="text-[#91a2a3] transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRightIcon />
      </span>
    </Link>
  );
}

export default function BookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookingId = params?.id;

  const [lang, setLang] = useState<Lang>("hy");
  const tr = TXT[lang];

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [
    psychologistProfile,
    setPsychologistProfile
  ] = useState<PsychologistProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

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

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/bookings/my",
          {
            cache: "no-store" as RequestCache
          }
        );

        if (!response.ok) {
          if (active) {
            setError(TXT[lang].loadError);
          }
          return;
        }

        const data = await response.json();

        const list: Booking[] = Array.isArray(data)
          ? data
          : [];

        const found =
          list.find(
            (item) =>
              String(item.id) === String(bookingId)
          ) || null;

        if (!active) return;

        setBooking(found);

        if (found?.psychologistId) {
          const psychResponse = await fetch(
            `/api/psychologists/${found.psychologistId}`,
            {
              cache: "no-store" as RequestCache
            }
          );

          if (psychResponse.ok) {
            const profile = await psychResponse
              .json()
              .catch(() => null);

            if (active) {
              setPsychologistProfile(profile);
            }
          }
        }
      } catch {
        if (active) {
          setError(TXT[lang].loadError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [bookingId, lang]);

  useEffect(() => {
    if (!success) return;

    const timer = window.setTimeout(() => {
      router.push("/app");
      router.refresh();
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success, router]);

  const hoursUntilStart = useMemo(() => {
    if (!booking) return null;

    const diffMs =
      new Date(booking.startAtUtc).getTime() -
      Date.now();

    return diffMs / (1000 * 60 * 60);
  }, [booking]);

  const canCancel = useMemo(() => {
    if (!booking) return false;

    const status = booking.status.toUpperCase();

    if (
      status === "CANCELLED" ||
      status === "CANCELLED_BY_CLIENT" ||
      status === "CANCELLED_BY_PSYCHOLOGIST"
    ) {
      return false;
    }

    return (
      status === "CREATED" ||
      status === "CONFIRMED"
    );
  }, [booking]);

  const canOpenVideo = useMemo(() => {
    if (!booking) return false;

    const status = booking.status.toUpperCase();

    return (
      status === "CONFIRMED" ||
      status === "COMPLETED"
    );
  }, [booking]);

  const canReview = useMemo(() => {
    if (!booking) return false;

    return (
      booking.status.toUpperCase() === "COMPLETED"
    );
  }, [booking]);

  const paymentRequired = useMemo(() => {
    if (!booking) return false;

    return isPendingPayment(booking.status);
  }, [booking]);

  async function cancelBooking() {
    if (
      !bookingId ||
      !canCancel ||
      canceling
    ) {
      return;
    }

    setCanceling(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/bookings/cancel/${bookingId}`,
        {
          method: "POST"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message
            ? `${payload.message}${
                payload.details
                  ? ` | ${payload.details}`
                  : ""
              }`
            : "Cancel failed"
        );

        return;
      }

      setBooking(payload);
      setSuccess(tr.cancelledOk);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Cancel failed"
      );
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[620px] bg-[radial-gradient(circle_at_5%_10%,rgba(18,184,196,0.12),transparent_30%),radial-gradient(circle_at_95%_10%,rgba(118,87,223,0.09),transparent_30%)]" />

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="rounded-[30px] border border-white/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(7,63,67,0.07)]">
            <div className="flex items-center gap-3 text-sm font-bold text-[#60797b]">
              <span className="size-5 animate-spin rounded-full border-2 border-[#12b8c4]/20 border-t-[#078b7b]" />
              {tr.loading}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-800">
          <span className="font-black">
            {tr.error}:
          </span>{" "}
          {error}
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(7,63,67,0.07)]">
          <div className="text-sm font-bold text-[#60797b]">
            {tr.notFound}
          </div>

          <Link
            href="/psychologists"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] to-[#3977e8] px-6 text-sm font-extrabold text-white"
          >
            {tr.openCatalog}
            <ArrowRightIcon />
          </Link>
        </div>
      </main>
    );
  }

  const status = statusMeta(
    booking.status,
    tr
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_2%_8%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_12%,rgba(118,87,223,0.10),transparent_31%),radial-gradient(circle_at_55%_40%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.back}
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[34px] border border-white/80 bg-white/88 p-6 shadow-[0_24px_75px_rgba(7,63,67,0.08)] backdrop-blur-xl sm:p-9">
          <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/8 to-[#7657df]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                {tr.eyebrow}
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-[#073f43] sm:text-[42px] sm:leading-[1.08]">
                {tr.title}
              </h1>

              <div className="mt-3 text-base font-black text-[#456668]">
                <PsychologistName
                  psychologistId={
                    booking.psychologistId
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-[18px] border border-[#073f43]/7 bg-white/80 px-4 py-3 shadow-sm">
                <div className="text-[9px] font-black uppercase tracking-[0.08em] text-[#95a4a5]">
                  {tr.booking}
                </div>

                <div className="mt-1 text-sm font-black text-[#31595b]">
                  #{booking.id}
                </div>
              </div>

              <span
                className={`inline-flex rounded-full border px-4 py-2.5 text-xs font-black ${status.cls}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              icon={<CalendarIcon />}
              label={tr.date}
              value={fmtDate(
                booking.startAtUtc,
                lang
              )}
            />

            <DetailCard
              icon={<ClockIcon />}
              label={tr.start}
              value={fmtTime(
                booking.startAtUtc,
                lang
              )}
            />

            <DetailCard
              icon={<ClockIcon />}
              label={tr.end}
              value={fmtTime(
                booking.endAtUtc,
                lang
              )}
            />

            <DetailCard
              icon={<ShieldIcon />}
              label={tr.status}
              value={status.label}
            />
          </div>
        </section>

        {success && (
          <div className="mt-5 rounded-[24px] border border-[#078b7b]/15 bg-[#eaf8f5] p-5 text-sm font-bold leading-6 text-[#076d62]">
            {success}
          </div>
        )}

        {error && booking && (
          <div className="mt-5 rounded-[24px] border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
            <span className="font-black">
              {tr.error}:
            </span>{" "}
            {error}
          </div>
        )}

        {paymentRequired && (
          <section className="mt-6 flex flex-col gap-5 rounded-[28px] border border-amber-200/80 bg-amber-50/80 p-6 shadow-[0_14px_40px_rgba(180,120,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-white text-amber-600 shadow-sm">
                <AlertIcon />
              </div>

              <div>
                <h2 className="text-sm font-black text-amber-900">
                  {tr.paymentRequired}
                </h2>

                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-amber-800/80">
                  {tr.paymentRequiredDesc}
                </p>
              </div>
            </div>

            <Link
              href={`/app/checkout/${booking.id}`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-6 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(21,159,175,0.20)] transition-all duration-300 hover:-translate-y-0.5"
            >
              {tr.continuePayment}
              <ArrowRightIcon />
            </Link>
          </section>
        )}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-6">
            <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.06)] sm:p-8">
              <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                {tr.psychologist}
              </h2>

              <div className="mt-5 rounded-[24px] border border-[#073f43]/7 bg-[#f8fbfb] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#eaf8f5] text-[#078b7b]">
                    <UserIcon />
                  </div>

                  <div className="min-w-0">
                    <div className="text-base font-black text-[#244e51]">
                      <PsychologistName
                        psychologistId={
                          booking.psychologistId
                        }
                      />
                    </div>

                    <Link
                      href={`/psychologists/${booking.psychologistId}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-extrabold text-[#3977e8] hover:text-[#078b7b]"
                    >
                      {tr.psychologist}
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] bg-white p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.07em] text-[#91a1a2]">
                      {tr.psychologistGender}
                    </div>

                    <div className="mt-1.5 text-sm font-black text-[#49696b]">
                      {formatGender(
                        psychologistProfile?.gender,
                        tr
                      )}
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-white p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.07em] text-[#91a1a2]">
                      {tr.psychologistAge}
                    </div>

                    <div className="mt-1.5 text-sm font-black text-[#49696b]">
                      {psychologistProfile?.age != null
                        ? `${psychologistProfile.age} ${tr.years}`
                        : tr.unknown}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.06)] sm:p-8">
              <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                {tr.actions}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7a8f90]">
                {tr.actionsDesc}
              </p>

              <div className="mt-5 space-y-3">
                <ActionCard
                  href={`/app/bookings/${booking.id}/chat`}
                  title={tr.openChat}
                  description={tr.chatDesc}
                  icon={<ChatIcon />}
                  tone="teal"
                />

                {canOpenVideo && (
                  <ActionCard
                    href={`/app/bookings/${booking.id}/video`}
                    title={tr.openVideo}
                    description={tr.videoDesc}
                    icon={<VideoIcon />}
                    tone="blue"
                  />
                )}

                {canCancel && (
                  <button
                    type="button"
                    onClick={cancelBooking}
                    disabled={canceling}
                    className="group flex w-full items-center gap-4 rounded-[24px] border border-rose-100 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50/40 hover:shadow-[0_16px_38px_rgba(190,24,93,0.06)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-rose-50 text-rose-600">
                      <AlertIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black text-rose-700">
                        {canceling
                          ? tr.cancelling
                          : tr.cancel}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-rose-700/65">
                        {tr.cancelDesc}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </section>

            {canReview && (
              <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.06)] sm:p-8">
                <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                  {tr.reviewTitle}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7a8f90]">
                  {tr.reviewDesc}
                </p>

                <div className="mt-5">
                  <ReviewFormCard
                    bookingId={booking.id}
                    lang={lang}
                    targetRole="PSYCHOLOGIST"
                  />
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <section className="rounded-[28px] border border-[#073f43]/7 bg-white/92 p-6 shadow-[0_16px_45px_rgba(7,63,67,0.05)]">
              <div className="text-xs font-black uppercase tracking-[0.08em] text-[#819596]">
                {tr.type}
              </div>

              <div className="mt-2 text-lg font-black text-[#31595b]">
                {formatType(
                  booking.type,
                  tr
                )}
              </div>

              <div className="mt-5 border-t border-[#073f43]/7 pt-5">
                <div className="text-xs font-black uppercase tracking-[0.08em] text-[#819596]">
                  {tr.language}
                </div>

                <div className="mt-2 text-sm font-black text-[#3977e8]">
                  {formatLanguage(
                    booking.language,
                    tr
                  )}
                </div>
              </div>
            </section>

            <details
              open={canCancel}
              className="group rounded-[28px] border border-[#078b7b]/10 bg-[#f1faf8] p-5 shadow-[0_14px_40px_rgba(7,63,67,0.045)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#078b7b] shadow-sm">
                    <ShieldIcon />
                  </div>

                  <span className="text-sm font-black text-[#31595b]">
                    {tr.cancelPolicy}
                  </span>
                </div>

                <span className="flex size-7 items-center justify-center rounded-full bg-white text-lg font-medium text-[#6e8384] transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-xs leading-5 text-[#718687]">
                {tr.cancelPolicyIntro}
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-[16px] bg-white/80 p-3 text-xs leading-5 text-[#607b7d]">
                  {tr.p1}
                </div>

                <div className="rounded-[16px] bg-white/80 p-3 text-xs leading-5 text-[#607b7d]">
                  {tr.p2}
                </div>
              </div>
            </details>

            {hoursUntilStart != null &&
              hoursUntilStart >= 0 &&
              canCancel && (
                <div
                  className={`rounded-[24px] border p-5 text-xs font-medium leading-6 ${
                    hoursUntilStart < 24
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-[#078b7b]/12 bg-[#eaf8f5] text-[#176c64]"
                  }`}
                >
                  {hoursUntilStart < 24
                    ? tr.lessThan24h
                    : tr.moreThan24h}
                </div>
              )}
          </aside>
        </div>
      </div>
    </main>
  );
}
