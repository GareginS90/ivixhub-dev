"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";
import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { NotificationsPreviewCard } from "@/components/notifications/NotificationsPreviewCard";
import PsychologistAvailabilityPlanner from "@/components/pro/PsychologistAvailabilityPlanner";

type Lang = "ru" | "en" | "hy";

type MeResponse = {
  id: number;
  email: string;
  fullName: string | null;
  username: string | null;
  birthDate: string | null;
  phone: string | null;
  phoneVerified: boolean;
  role: string;
  active: boolean;
};

type OnboardingStartResponse = {
  psychologistId: number;
  status: string;
  experienceYears: number;
  bio: string | null;
  languages: string[];
  methods: string[];
  specializations: string[];
};

type AvailabilityItem = {
  id: number;
  psychologistId: number;
  dayOfWeek: string;
  startTimeUtc: string;
  endTimeUtc: string;
};

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
  ru: {
    title: "Кабинет психолога",
    subtitle: "Управляйте профилем, расписанием, бронями и уведомлениями в одном месте.",
    logout: "Выйти",
    loading: "Загрузка...",
    error: "Ошибка",
    statusCard: "Статус профессионального аккаунта",
    accountCard: "Данные аккаунта",
    quickActions: "Быстрые действия",
    moderation: "Модерация",
    fullName: "Имя и фамилия",
    username: "Никнейм",
    email: "Email",
    phone: "Телефон",
    phoneVerified: "Телефон подтверждён",
    yes: "Да",
    no: "Нет",
    onboardingStatus: "Статус onboarding",
    profileStep: "Профиль психолога",
    documentsStep: "Документы",
    support: "Поддержка",
    deleteAccount: "Удалить аккаунт",
    myReviews: "Мои отзывы и оценки",
    myReviewsDesc: "Посмотреть репутацию, комментарии клиентов и официальные ответы.",
    open: "Открыть",
    draftTitle: "Профиль ещё не завершён",
    draftText: "Заполните профессиональный профиль и загрузите документы, чтобы отправить аккаунт на модерацию.",
    pendingTitle: "Анкета на проверке",
    pendingText: "Профиль уже отправлен на модерацию. Пока проверка не завершена, редактирование профессиональных настроек ограничено.",
    verifiedTitle: "Профиль подтверждён",
    verifiedText: "Профиль подтверждён. Ниже вы можете управлять доступностью, бронями и ежедневной работой с клиентами.",
    rejectedTitle: "Нужны изменения по анкете",
    rejectedText: "Профиль возвращён на доработку. Откройте профиль и документы, внесите изменения и отправьте анкету повторно.",
    unknownTitle: "Статус загружается",
    unknownText: "Мы пытаемся получить актуальный статус профессионального профиля.",
    startFailed: "Не удалось загрузить статус onboarding. Попробуйте обновить страницу.",
    profileFailed: "Не удалось загрузить данные аккаунта. Попробуйте обновить страницу.",
    availability: "Свободные часы",
    bookings: "Мои брони",
    upcoming: "Предстоящие",
    history: "История",
    noAvailability: "Свободные часы пока не добавлены.",
    noUpcoming: "Предстоящих броней пока нет.",
    noHistory: "История пока пуста.",
    addSlot: "Добавить слот",
    remove: "Удалить",
    day: "День",
    startTime: "Начало",
    endTime: "Конец",
    creating: "Сохранение...",
    deleting: "Удаление...",
    cancelBooking: "Отменить бронь",
    cancellingBooking: "Отмена...",
    openChat: "Открыть чат",
    openBooking: "Открыть бронь",
    openVideo: "Открыть видео",
    status: "Статус",
    start: "Начало",
    end: "Конец",
    type: "Тип",
    language: "Язык",
    lessThan24: "Если психолог отменяет сессию, клиент получает 100% возврат средств.",
    verifiedOnlyAvailability: "Управление расписанием доступно только после верификации профиля.",
    pendingLimited: "После верификации здесь откроется полноценное управление рабочими слотами.",
    mon: "Понедельник",
    tue: "Вторник",
    wed: "Среда",
    thu: "Четверг",
    fri: "Пятница",
    sat: "Суббота",
    sun: "Воскресенье"
  },
  en: {
    title: "Psychologist dashboard",
    subtitle: "Manage your profile, schedule, bookings, and notifications in one place.",
    logout: "Logout",
    loading: "Loading...",
    error: "Error",
    statusCard: "Professional account status",
    accountCard: "Account details",
    quickActions: "Quick actions",
    moderation: "Moderation",
    fullName: "Full name",
    username: "Username",
    email: "Email",
    phone: "Phone",
    phoneVerified: "Phone verified",
    yes: "Yes",
    no: "No",
    onboardingStatus: "Onboarding status",
    profileStep: "Psychologist profile",
    documentsStep: "Documents",
    support: "Support",
    deleteAccount: "Delete account",
    myReviews: "My reviews and ratings",
    myReviewsDesc: "View your reputation, client comments, and official replies.",
    open: "Open",
    draftTitle: "Your profile is not finished yet",
    draftText: "Complete your professional profile and upload the required documents before submitting the account for moderation.",
    pendingTitle: "Application under review",
    pendingText: "Your profile has already been submitted for moderation. Professional operational settings are limited until the review is complete.",
    verifiedTitle: "Profile verified",
    verifiedText: "Your profile is verified. Below you can manage availability, bookings, and daily client operations.",
    rejectedTitle: "Changes are required",
    rejectedText: "The profile was returned for revision. Open the profile and documents, update them, and submit again.",
    unknownTitle: "Status is loading",
    unknownText: "We are trying to get the latest professional profile status.",
    startFailed: "Failed to load onboarding status. Please refresh the page.",
    profileFailed: "Failed to load account data. Please refresh the page.",
    availability: "Availability",
    bookings: "My bookings",
    upcoming: "Upcoming",
    history: "History",
    noAvailability: "No availability slots yet.",
    noUpcoming: "No upcoming bookings yet.",
    noHistory: "History is empty.",
    addSlot: "Add slot",
    remove: "Remove",
    day: "Day",
    startTime: "Start",
    endTime: "End",
    creating: "Saving...",
    deleting: "Deleting...",
    cancelBooking: "Cancel booking",
    cancellingBooking: "Cancelling...",
    openChat: "Open chat",
    openBooking: "Open booking",
    openVideo: "Open video",
    status: "Status",
    start: "Start",
    end: "End",
    type: "Type",
    language: "Language",
    lessThan24: "If the psychologist cancels the session, the client receives a 100% refund.",
    verifiedOnlyAvailability: "Availability management is available only after profile verification.",
    pendingLimited: "After verification, full working slot management will become available here.",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday"
  },
  hy: {
    title: "Հոգեբանի անձնական էջ",
    subtitle: "Կառավարեք պրոֆիլը, գրաֆիկը, ամրագրումները և ծանուցումները մեկ վայրից։",
    logout: "Դուրս գալ",
    loading: "Բեռնվում է...",
    error: "Սխալ",
    statusCard: "Մասնագիտական հաշվի կարգավիճակ",
    accountCard: "Հաշվի տվյալներ",
    quickActions: "Արագ գործողություններ",
    moderation: "Մոդերացիա",
    fullName: "Անուն և ազգանուն",
    username: "Նիք",
    email: "Email",
    phone: "Հեռախոս",
    phoneVerified: "Հեռախոսը հաստատված է",
    yes: "Այո",
    no: "Ոչ",
    onboardingStatus: "Onboarding-ի կարգավիճակ",
    profileStep: "Հոգեբանի պրոֆիլ",
    documentsStep: "Փաստաթղթեր",
    support: "Աջակցություն",
    deleteAccount: "Հեռացնել հաշիվը",
    myReviews: "Իմ կարծիքներն ու գնահատականները",
    myReviewsDesc: "Տեսնել հեղինակությունը, հաճախորդների մեկնաբանությունները և պաշտոնական պատասխանները։",
    open: "Բացել",
    draftTitle: "Պրոֆիլը դեռ ավարտված չէ",
    draftText: "Լրացրեք մասնագիտական պրոֆիլը և բեռնեք պարտադիր փաստաթղթերը, որպեսզի ուղարկեք հաշիվը մոդերացիայի։",
    pendingTitle: "Հայտը ստուգման փուլում է",
    pendingText: "Պրոֆիլն արդեն ուղարկվել է մոդերացիայի։ Մինչ ստուգման ավարտը մասնագիտական գործառույթների մի մասը սահմանափակված է։",
    verifiedTitle: "Պրոֆիլը հաստատված է",
    verifiedText: "Պրոֆիլը հաստատված է։ Ստորև կարող եք կառավարել հասանելիությունը, ամրագրումները և հաճախորդների հետ ամենօրյա աշխատանքը։",
    rejectedTitle: "Պահանջվում են փոփոխություններ",
    rejectedText: "Պրոֆիլը վերադարձվել է խմբագրման։ Բացեք պրոֆիլն ու փաստաթղթերը, թարմացրեք տվյալները և ուղարկեք կրկին։",
    unknownTitle: "Կարգավիճակը բեռնվում է",
    unknownText: "Փորձում ենք ստանալ մասնագիտական պրոֆիլի արդիական կարգավիճակը։",
    startFailed: "Չհաջողվեց բեռնել onboarding-ի կարգավիճակը։ Թարմացրեք էջը։",
    profileFailed: "Չհաջողվեց բեռնել հաշվի տվյալները։ Թարմացրեք էջը։",
    availability: "Ազատ ժամեր",
    bookings: "Իմ ամրագրումները",
    upcoming: "Առաջիկա",
    history: "Պատմություն",
    noAvailability: "Ազատ ժամեր դեռ չկան։",
    noUpcoming: "Առաջիկա ամրագրումներ դեռ չկան։",
    noHistory: "Պատմությունը դեռ դատարկ է։",
    addSlot: "Ավելացնել ժամ",
    remove: "Հեռացնել",
    day: "Օր",
    startTime: "Սկիզբ",
    endTime: "Ավարտ",
    creating: "Պահպանվում է...",
    deleting: "Ջնջվում է...",
    cancelBooking: "Չեղարկել ամրագրումը",
    cancellingBooking: "Չեղարկվում է...",
    openChat: "Բացել չատը",
    openBooking: "Բացել ամրագրումը",
    openVideo: "Բացել վիդեոն",
    status: "Կարգավիճակ",
    start: "Սկիզբ",
    end: "Ավարտ",
    type: "Տեսակ",
    language: "Լեզու",
    lessThan24: "Եթե հոգեբանը չեղարկում է սեանսը, հաճախորդը ստանում է 100% վերադարձ։",
    verifiedOnlyAvailability: "Գրաֆիկի կառավարումը հասանելի է միայն պրոֆիլի հաստատումից հետո։",
    pendingLimited: "Հաստատումից հետո այստեղ կբացվի աշխատանքային ժամերի լիարժեք կառավարումը։",
    mon: "Երկուշաբթի",
    tue: "Երեքշաբթի",
    wed: "Չորեքշաբթի",
    thu: "Հինգշաբթի",
    fri: "Ուրբաթ",
    sat: "Շաբաթ",
    sun: "Կիրակի"
  }
} as const;

function statusContent(status: string | null, tr: (typeof TXT)[Lang]) {
  switch ((status || "").toUpperCase()) {
    case "DRAFT":
      return { title: tr.draftTitle, text: tr.draftText, tone: "amber" };
    case "PENDING_VERIFICATION":
      return { title: tr.pendingTitle, text: tr.pendingText, tone: "blue" };
    case "VERIFIED":
      return { title: tr.verifiedTitle, text: tr.verifiedText, tone: "emerald" };
    case "REJECTED":
      return { title: tr.rejectedTitle, text: tr.rejectedText, tone: "rose" };
    default:
      return { title: tr.unknownTitle, text: tr.unknownText, tone: "slate" };
  }
}

function toneClasses(tone: string) {
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-900";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-slate-900";
  if (tone === "emerald") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (tone === "rose") return "border-rose-200 bg-rose-50 text-rose-900";
  return "border-slate-200 bg-slate-50 text-slate-900";
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("hy-AM", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function mapDayLabel(lang: Lang, day: string) {
  const x = day?.toUpperCase();
  if (x === "MON") return TXT[lang].mon;
  if (x === "TUE") return TXT[lang].tue;
  if (x === "WED") return TXT[lang].wed;
  if (x === "THU") return TXT[lang].thu;
  if (x === "FRI") return TXT[lang].fri;
  if (x === "SAT") return TXT[lang].sat;
  return TXT[lang].sun;
}

function isUpcoming(status: string, startAtUtc: string, endAtUtc: string) {
  const s = (status || "").toUpperCase();

  if (
    s === "COMPLETED" ||
    s === "CANCELLED" ||
    s === "CANCELLED_BY_CLIENT" ||
    s === "CANCELLED_BY_PSYCHOLOGIST" ||
    s === "EXPIRED_PAYMENT"
  ) {
    return false;
  }

  const now = Date.now();

  if (s === "CONFIRMED" && new Date(endAtUtc).getTime() <= now) {
    return false;
  }

  return new Date(startAtUtc).getTime() >= now || (s === "CONFIRMED" && new Date(endAtUtc).getTime() > now);
}

export default function ProDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ru");
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [deletingAvailabilityId, setDeletingAvailabilityId] = useState<number | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);

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

  async function logout() {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/auth/login?role=psychologist");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  }

  async function loadAll() {
    const [meRes, onboardingRes, availabilityRes, bookingsRes] = await Promise.all([
      fetch("/api/me", { cache: "no-store" as any }),
      fetch("/api/psychologists/onboarding/start", {
        method: "POST",
        cache: "no-store" as any
      }),
      fetch("/api/pro/availability", { cache: "no-store" as any }),
      fetch("/api/pro/bookings", { cache: "no-store" as any })
    ]);

    const meJson = await meRes.json().catch(() => null);
    const onboardingJson = await onboardingRes.json().catch(() => null);
    const availabilityJson = await availabilityRes.json().catch(() => null);
    const bookingsJson = await bookingsRes.json().catch(() => null);

    if (!meRes.ok) throw new Error(meJson?.message || tr.profileFailed);
    if (!onboardingRes.ok) throw new Error(onboardingJson?.message || tr.startFailed);
    if (!availabilityRes.ok) throw new Error(availabilityJson?.message || "Failed to load psychologist availability");
    if (!bookingsRes.ok) throw new Error(bookingsJson?.message || "Failed to load psychologist bookings");

    setMe(meJson as MeResponse);
    setStatus((onboardingJson as OnboardingStartResponse).status || null);
    setAvailability(Array.isArray(availabilityJson) ? availabilityJson : []);
    setBookings(Array.isArray(bookingsJson) ? bookingsJson : []);
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await loadAll();
      } catch (e: any) {
        setError(e?.message || tr.startFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [tr.profileFailed, tr.startFailed]);

  const currentStatus = useMemo(() => statusContent(status, tr), [status, tr]);

  const upcomingBookings = useMemo(
    () => bookings.filter((x) => isUpcoming(x.status, x.startAtUtc, x.endAtUtc)),
    [bookings]
  );

  const historyBookings = useMemo(
    () => bookings.filter((x) => !isUpcoming(x.status, x.startAtUtc, x.endAtUtc)),
    [bookings]
  );

  const canManageAvailability = (status || "").toUpperCase() === "VERIFIED";

  async function addAvailabilitySlot(payload: {
    dayOfWeek: string;
    startTimeUtc: string;
    endTimeUtc: string;
  }) {
    if (!canManageAvailability || savingAvailability) return;

    try {
      setSavingAvailability(true);
      setError(null);

      const r = await fetch("/api/pro/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Create availability failed");
        return;
      }

      setAvailability((prev) =>
        [...prev, j].sort((a, b) => {
          if (a.dayOfWeek === b.dayOfWeek) return a.startTimeUtc.localeCompare(b.startTimeUtc);
          return a.dayOfWeek.localeCompare(b.dayOfWeek);
        })
      );
    } catch (e: any) {
      setError(e?.message || "Create availability failed");
    } finally {
      setSavingAvailability(false);
    }
  }

  async function deleteAvailability(id: number) {
    if (deletingAvailabilityId) return;

    try {
      setDeletingAvailabilityId(id);
      setError(null);

      const r = await fetch(`/api/pro/availability/${id}`, { method: "DELETE" });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Delete availability failed");
        return;
      }

      setAvailability((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e?.message || "Delete availability failed");
    } finally {
      setDeletingAvailabilityId(null);
    }
  }

  async function cancelBooking(bookingId: number) {
    if (cancellingBookingId) return;

    try {
      setCancellingBookingId(bookingId);
      setError(null);

      const r = await fetch(`/api/pro/bookings/cancel/${bookingId}`, { method: "POST" });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Psychologist cancel failed");
        return;
      }

      setBookings((prev) => prev.map((x) => (x.id === bookingId ? j : x)));
    } catch (e: any) {
      setError(e?.message || "Psychologist cancel failed");
    } finally {
      setCancellingBookingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm text-gray-500">IvixHUB</div>
            <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{tr.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsBell href="/pro/notifications" />

            <button
              type="button"
              onClick={logout}
              disabled={logoutLoading}
              className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50 disabled:opacity-50"
            >
              {logoutLoading ? "..." : tr.logout}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border bg-white p-8 shadow-sm">{tr.loading}</div>
        ) : error ? (
          <div className="rounded-3xl border bg-red-50 p-8 text-sm text-red-800 shadow-sm">
            <b>{tr.error}:</b> {error}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <h2 className="text-lg font-semibold">{tr.statusCard}</h2>

                <div className={`mt-5 rounded-3xl border p-6 ${toneClasses(currentStatus.tone)}`}>
                  <div className="text-sm font-medium">{tr.onboardingStatus}: {status || "—"}</div>
                  <h3 className="mt-3 text-xl font-semibold">{currentStatus.title}</h3>
                  <p className="mt-3 text-sm leading-6">{currentStatus.text}</p>
                </div>

                <h2 className="mt-8 text-lg font-semibold">{tr.quickActions}</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Link href="/psychologists/onboarding/profile" className="rounded-3xl border p-5 hover:bg-gray-50">
                    <div className="text-base font-semibold">{tr.profileStep}</div>
                    <div className="mt-2 text-sm text-gray-600">{tr.open}</div>
                  </Link>

                  <Link href="/psychologists/onboarding/documents" className="rounded-3xl border p-5 hover:bg-gray-50">
                    <div className="text-base font-semibold">{tr.documentsStep}</div>
                    <div className="mt-2 text-sm text-gray-600">{tr.open}</div>
                  </Link>

                  <Link href="/support" className="rounded-3xl border p-5 hover:bg-gray-50">
                    <div className="text-base font-semibold">{tr.support}</div>
                    <div className="mt-2 text-sm text-gray-600">{tr.open}</div>
                  </Link>

                  <Link href="/pro/reviews" className="rounded-3xl border p-5 hover:bg-gray-50">
                    <div className="text-base font-semibold">{tr.myReviews}</div>
                    <div className="mt-2 text-sm text-gray-600">{tr.myReviewsDesc}</div>
                  </Link>

                  <Link href="/psychologists/account/delete" className="rounded-3xl border p-5 hover:bg-gray-50 sm:col-span-2">
                    <div className="text-base font-semibold">{tr.deleteAccount}</div>
                    <div className="mt-2 text-sm text-gray-600">{tr.open}</div>
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{tr.availability}</h2>
                </div>

                {!canManageAvailability ? (
                  <div className="mt-5 rounded-3xl border bg-slate-50 p-6 text-sm text-slate-700">
                    <div className="font-medium">{tr.verifiedOnlyAvailability}</div>
                    <div className="mt-2">{tr.pendingLimited}</div>
                  </div>
                ) : (
                  <PsychologistAvailabilityPlanner
                    lang={lang}
                    saving={savingAvailability}
                    onSubmit={addAvailabilitySlot}
                  />
                )}

                <div className="mt-6 space-y-3">
                  {availability.length === 0 ? (
                    <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-gray-600">
                      {tr.noAvailability}
                    </div>
                  ) : (
                    availability.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex flex-col gap-3 rounded-2xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="grid gap-1 text-sm">
                          <div><span className="text-gray-500">{tr.day}:</span> <span className="font-medium">{mapDayLabel(lang, slot.dayOfWeek)}</span></div>
                          <div><span className="text-gray-500">{tr.startTime}:</span> <span className="font-medium">{slot.startTimeUtc}</span></div>
                          <div><span className="text-gray-500">{tr.endTime}:</span> <span className="font-medium">{slot.endTimeUtc}</span></div>
                        </div>

                        {canManageAvailability && (
                          <button
                            type="button"
                            onClick={() => deleteAvailability(slot.id)}
                            disabled={deletingAvailabilityId === slot.id}
                            className="rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                          >
                            {deletingAvailabilityId === slot.id ? tr.deleting : tr.remove}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{tr.bookings}</h2>
                </div>

                <div className="mt-4 rounded-2xl border bg-blue-50 p-4 text-sm text-slate-900">
                  {tr.lessThan24}
                </div>

                <div className="mt-6">
                  <h3 className="text-base font-semibold">{tr.upcoming}</h3>

                  <div className="mt-4 space-y-4">
                    {upcomingBookings.length === 0 ? (
                      <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-gray-600">
                        {tr.noUpcoming}
                      </div>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <div key={booking.id} className="rounded-3xl border bg-slate-50 p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-base font-semibold">#{booking.id}</div>
                            <div className="rounded-full border bg-white px-3 py-1 text-xs">{booking.status}</div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                            <div><span className="text-gray-500">{tr.start}:</span> <span className="font-medium">{fmtDateTime(booking.startAtUtc)}</span></div>
                            <div><span className="text-gray-500">{tr.end}:</span> <span className="font-medium">{fmtDateTime(booking.endAtUtc)}</span></div>
                            <div><span className="text-gray-500">{tr.type}:</span> <span className="font-medium">{booking.type || "—"}</span></div>
                            <div><span className="text-gray-500">{tr.language}:</span> <span className="font-medium">{booking.language || "—"}</span></div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                            <Link
                              href={`/pro/bookings/${booking.id}`}
                              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
                            >
                              {tr.openBooking}
                            </Link>

                            <Link
                              href={`/pro/bookings/${booking.id}/chat`}
                              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
                            >
                              {tr.openChat}
                            </Link>

                            <Link
                              href={`/pro/bookings/${booking.id}/video`}
                              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
                            >
                              {tr.openVideo}
                            </Link>

                            {(booking.status === "CREATED" || booking.status === "CONFIRMED") && (
                              <button
                                type="button"
                                onClick={() => cancelBooking(booking.id)}
                                disabled={cancellingBookingId === booking.id}
                                className="rounded-2xl bg-black py-3 text-white disabled:opacity-50"
                              >
                                {cancellingBookingId === booking.id ? tr.cancellingBooking : tr.cancelBooking}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-base font-semibold">{tr.history}</h3>

                  <div className="mt-4 space-y-4">
                    {historyBookings.length === 0 ? (
                      <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-gray-600">
                        {tr.noHistory}
                      </div>
                    ) : (
                      historyBookings.map((booking) => (
                        <div key={booking.id} className="rounded-3xl border bg-slate-50 p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-base font-semibold">#{booking.id}</div>
                            <div className="rounded-full border bg-white px-3 py-1 text-xs">{booking.status}</div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                            <div><span className="text-gray-500">{tr.start}:</span> <span className="font-medium">{fmtDateTime(booking.startAtUtc)}</span></div>
                            <div><span className="text-gray-500">{tr.end}:</span> <span className="font-medium">{fmtDateTime(booking.endAtUtc)}</span></div>
                            <div><span className="text-gray-500">{tr.type}:</span> <span className="font-medium">{booking.type || "—"}</span></div>
                            <div><span className="text-gray-500">{tr.language}:</span> <span className="font-medium">{booking.language || "—"}</span></div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Link
                              href={`/pro/bookings/${booking.id}`}
                              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
                            >
                              {tr.openBooking}
                            </Link>

                            <Link
                              href={`/pro/bookings/${booking.id}/chat`}
                              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
                            >
                              {tr.openChat}
                            </Link>

                            <Link
                              href={`/pro/bookings/${booking.id}/video`}
                              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
                            >
                              {tr.openVideo}
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-6">
              <aside className="rounded-3xl border bg-white p-8 shadow-sm">
                <h2 className="text-lg font-semibold">{tr.accountCard}</h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <div className="text-gray-500">{tr.fullName}</div>
                    <div className="mt-1 font-medium">{me?.fullName || "—"}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">{tr.username}</div>
                    <div className="mt-1 font-medium">{me?.username || "—"}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">{tr.email}</div>
                    <div className="mt-1 font-medium">{me?.email || "—"}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">{tr.phone}</div>
                    <div className="mt-1 font-medium">{me?.phone || "—"}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">{tr.phoneVerified}</div>
                    <div className="mt-1 font-medium">
                      {me?.phoneVerified ? tr.yes : tr.no}
                    </div>
                  </div>
                </div>
              </aside>

              <NotificationsPreviewCard href="/pro/notifications" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
