"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState
} from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type Mode = "client" | "psychologist";

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type NotificationListResponse = {
  unreadCount: number;
  items: NotificationItem[];
};

const TXT = {
  hy: {
    backClient: "Վերադառնալ անձնական էջ",
    backPsychologist:
      "Վերադառնալ հոգեբանի էջ",
    eyebrow: "IviXHub",
    title: "Ծանուցումներ",
    subtitleClient:
      "Այստեղ կտեսնեք ամրագրումների, վճարումների, չատի և տեսասեանսների կարևոր թարմացումները։",
    subtitlePsychologist:
      "Այստեղ կտեսնեք հաճախորդների ամրագրումների, սեանսների և աշխատանքային գործողությունների կարևոր թարմացումները։",
    unread: "Չընթերցված",
    all: "Բոլոր ծանուցումները",
    loading:
      "Ծանուցումները բեռնվում են…",
    empty:
      "Նոր ծանուցումներ դեռ չկան",
    emptyHint:
      "Ամրագրումների, վճարումների և հանդիպումների թարմացումները կհայտնվեն այստեղ։",
    loadFailed:
      "Չհաջողվեց բեռնել ծանուցումները։",
    markRead: "Նշել ընթերցված",
    markAllRead:
      "Նշել բոլորը ընթերցված",
    markingAllRead: "Նշվում է…",
    read: "Ընթերցված",
    readFailed:
      "Չհաջողվեց նշել ծանուցումը որպես ընթերցված։",
    readAllFailed:
      "Չհաջողվեց նշել բոլոր ծանուցումները որպես ընթերցված։",
    refresh: "Թարմացնել",
    refreshing: "Թարմացվում է…",
    createdAt: "Ստացվել է",
    autoRefresh:
      "Ավտոմատ թարմացում",
    inbox: "Ծանուցումների կենտրոն"
  },

  ru: {
    backClient: "Вернуться в кабинет",
    backPsychologist:
      "Вернуться в кабинет психолога",
    eyebrow: "IviXHub",
    title: "Уведомления",
    subtitleClient:
      "Здесь вы увидите важные обновления по бронированиям, платежам, чату и видеосессиям.",
    subtitlePsychologist:
      "Здесь вы увидите важные обновления по клиентским бронированиям, сессиям и рабочим операциям.",
    unread: "Непрочитанные",
    all: "Все уведомления",
    loading:
      "Загружаем уведомления…",
    empty:
      "Новых уведомлений пока нет",
    emptyHint:
      "Обновления по бронированиям, платежам и встречам появятся здесь.",
    loadFailed:
      "Не удалось загрузить уведомления.",
    markRead: "Отметить прочитанным",
    markAllRead:
      "Отметить все прочитанными",
    markingAllRead: "Отмечаем…",
    read: "Прочитано",
    readFailed:
      "Не удалось отметить уведомление как прочитанное.",
    readAllFailed:
      "Не удалось отметить все уведомления как прочитанные.",
    refresh: "Обновить",
    refreshing: "Обновляем…",
    createdAt: "Получено",
    autoRefresh:
      "Автообновление",
    inbox: "Центр уведомлений"
  },

  en: {
    backClient: "Back to dashboard",
    backPsychologist:
      "Back to psychologist dashboard",
    eyebrow: "IviXHub",
    title: "Notifications",
    subtitleClient:
      "See important updates about bookings, payments, chat, and video sessions.",
    subtitlePsychologist:
      "See important updates about client bookings, sessions, and operational events.",
    unread: "Unread",
    all: "All notifications",
    loading:
      "Loading notifications…",
    empty:
      "No new notifications yet",
    emptyHint:
      "Updates about bookings, payments, and sessions will appear here.",
    loadFailed:
      "Failed to load notifications.",
    markRead: "Mark as read",
    markAllRead:
      "Mark all as read",
    markingAllRead: "Marking…",
    read: "Read",
    readFailed:
      "Failed to mark the notification as read.",
    readAllFailed:
      "Failed to mark all notifications as read.",
    refresh: "Refresh",
    refreshing: "Refreshing…",
    createdAt: "Received",
    autoRefresh:
      "Auto refresh",
    inbox: "Notification center"
  }
} as const;

function formatDate(
  value: string,
  lang: Lang
) {
  try {
    const locale =
      lang === "ru"
        ? "ru-RU"
        : lang === "hy"
          ? "hy-AM"
          : "en-US";

    return new Intl.DateTimeFormat(
      locale,
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    ).format(new Date(value));
  } catch {
    return value;
  }
}

function notificationMeta(
  type: string
) {
  const value = (
    type || ""
  ).toUpperCase();

  if (
    value.includes("CANCEL") ||
    value.includes("EXPIRED") ||
    value.includes("FAILED")
  ) {
    return {
      icon: "alert",
      iconClass:
        "bg-rose-50 text-rose-600",
      badgeClass:
        "border-rose-200 bg-rose-50 text-rose-700"
    };
  }

  if (
    value.includes("COMPLETED") ||
    value.includes("STARTED") ||
    value.includes("READY") ||
    value.includes("CONFIRMED") ||
    value.includes("PAID")
  ) {
    return {
      icon: "check",
      iconClass:
        "bg-[#e9f8f5] text-[#078b7b]",
      badgeClass:
        "border-[#12b8c4]/15 bg-[#e9f8f5] text-[#078b7b]"
    };
  }

  if (
    value.includes("REMINDER")
  ) {
    return {
      icon: "clock",
      iconClass:
        "bg-amber-50 text-amber-600",
      badgeClass:
        "border-amber-200 bg-amber-50 text-amber-700"
    };
  }

  if (
    value.includes("CHAT") ||
    value.includes("MESSAGE")
  ) {
    return {
      icon: "message",
      iconClass:
        "bg-[#eef3ff] text-[#3977e8]",
      badgeClass:
        "border-[#3977e8]/15 bg-[#eef3ff] text-[#3977e8]"
    };
  }

  if (
    value.includes("VIDEO") ||
    value.includes("SESSION")
  ) {
    return {
      icon: "video",
      iconClass:
        "bg-[#f2efff] text-[#7657df]",
      badgeClass:
        "border-[#7657df]/15 bg-[#f2efff] text-[#7657df]"
    };
  }

  return {
    icon: "bell",
    iconClass:
      "bg-[#edf9fb] text-[#159faf]",
    badgeClass:
      "border-[#12b8c4]/15 bg-[#edf9fb] text-[#078b7b]"
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

function BellIcon({
  size = 22
}: {
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
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

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MessageIcon() {
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
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.3-4A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

function VideoIcon() {
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
      <rect
        x="3"
        y="6"
        width="13"
        height="12"
        rx="3"
      />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}

function AlertIcon() {
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
      <path d="M12 3 2.5 20h19Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function RefreshIcon() {
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
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8" />
      <path d="M5.5 15A7 7 0 0 0 17.8 17.8L20 16" />
    </svg>
  );
}

function iconFor(
  icon: string
) {
  if (icon === "check") {
    return <CheckIcon />;
  }

  if (icon === "clock") {
    return <ClockIcon />;
  }

  if (icon === "message") {
    return <MessageIcon />;
  }

  if (icon === "video") {
    return <VideoIcon />;
  }

  if (icon === "alert") {
    return <AlertIcon />;
  }

  return <BellIcon size={20} />;
}

export function NotificationsClientPage({
  mode
}: {
  mode: Mode;
}) {
  const [lang, setLang] =
    useState<Lang>("hy");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [markingId, setMarkingId] =
    useState<number | null>(null);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [data, setData] =
    useState<NotificationListResponse>({
      unreadCount: 0,
      items: []
    });

  useEffect(() => {
    const syncLang = () => {
      setLang(
        getUiLangFromCookie()
      );
    };

    syncLang();

    const onFocus = () =>
      syncLang();

    const onVisible = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        syncLang();
      }
    };

    window.addEventListener(
      "focus",
      onFocus
    );

    document.addEventListener(
      "visibilitychange",
      onVisible
    );

    const timer =
      window.setInterval(
        syncLang,
        700
      );

    return () => {
      window.removeEventListener(
        "focus",
        onFocus
      );

      document.removeEventListener(
        "visibilitychange",
        onVisible
      );

      window.clearInterval(timer);
    };
  }, []);

  const tr = TXT[lang];

  const backHref =
    mode === "psychologist"
      ? "/pro"
      : "/app";

  const backText =
    mode === "psychologist"
      ? tr.backPsychologist
      : tr.backClient;

  const subtitle =
    mode === "psychologist"
      ? tr.subtitlePsychologist
      : tr.subtitleClient;

  async function loadNotifications(
    silent = false
  ) {
    try {
      if (!silent) {
        if (data.items.length > 0) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
      }

      setError(null);

      const response = await fetch(
        "/api/notifications/me",
        {
          cache: "no-store"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        if (!silent) {
          setError(
            payload?.message ||
              tr.loadFailed
          );
        }
        return;
      }

      setData({
        unreadCount:
          typeof payload?.unreadCount ===
          "number"
            ? payload.unreadCount
            : 0,
        items: Array.isArray(
          payload?.items
        )
          ? payload.items
          : []
      });
    } catch {
      if (!silent) {
        setError(tr.loadFailed);
      }
    } finally {
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    void loadNotifications(false);

    const timer =
      window.setInterval(() => {
        void loadNotifications(true);
      }, 15000);

    return () =>
      window.clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function markAsRead(
    notificationId: number
  ) {
    try {
      setMarkingId(
        notificationId
      );

      setError(null);

      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "POST"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message ||
            tr.readFailed
        );
        return;
      }

      setData((previous) => {
        const wasUnread =
          previous.items.some(
            (item) =>
              item.id ===
                notificationId &&
              !item.read
          );

        return {
          unreadCount: wasUnread
            ? Math.max(
                0,
                previous.unreadCount -
                  1
              )
            : previous.unreadCount,

          items:
            previous.items.map(
              (item) =>
                item.id ===
                notificationId
                  ? {
                      ...item,
                      read: true
                    }
                  : item
            )
        };
      });
    } catch {
      setError(tr.readFailed);
    } finally {
      setMarkingId(null);
    }
  }

  async function markAllAsRead() {
    if (
      markingAll ||
      data.unreadCount === 0
    ) {
      return;
    }

    try {
      setMarkingAll(true);
      setError(null);

      const response = await fetch(
        "/api/notifications/read-all",
        {
          method: "POST"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message ||
            tr.readAllFailed
        );
        return;
      }

      setData((previous) => ({
        unreadCount: 0,
        items: Array.isArray(
          payload?.items
        )
          ? payload.items
          : previous.items.map(
              (item) => ({
                ...item,
                read: true
              })
            )
      }));
    } catch {
      setError(
        tr.readAllFailed
      );
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadItems = useMemo(
    () =>
      data.items.filter(
        (item) => !item.read
      ).length,
    [data.items]
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_4%_7%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_8%,rgba(118,87,223,0.09),transparent_31%),radial-gradient(circle_at_52%_38%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {backText}
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_65px_rgba(7,63,67,0.07)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/9 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                <BellIcon size={16} />
                {tr.eyebrow}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-[38px]">
                {tr.title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73898b]">
                {subtitle}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#829697]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#12b8c4]" />
                {tr.autoRefresh}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  void markAllAsRead()
                }
                disabled={
                  markingAll ||
                  unreadItems === 0
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#073f43]/8 bg-white px-5 text-sm font-extrabold text-[#557173] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                <CheckIcon />

                {markingAll
                  ? tr.markingAllRead
                  : tr.markAllRead}
              </button>

              <button
                type="button"
                onClick={() =>
                  void loadNotifications(
                    false
                  )
                }
                disabled={refreshing}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(21,159,175,0.18)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                >
                  <RefreshIcon />
                </span>

                {refreshing
                  ? tr.refreshing
                  : tr.refresh}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="group rounded-[26px] border border-[#12b8c4]/12 bg-gradient-to-br from-[#effbf9] to-white p-5 shadow-[0_14px_40px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,63,67,0.07)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-[#70888a]">
                {tr.unread}
              </div>

              <div className="flex size-9 items-center justify-center rounded-[13px] bg-[#e3f7f4] text-[#078b7b]">
                <BellIcon size={18} />
              </div>
            </div>

            <div className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43]">
              {data.unreadCount}
            </div>
          </div>

          <div className="group rounded-[26px] border border-[#3977e8]/10 bg-gradient-to-br from-[#f2f6ff] to-white p-5 shadow-[0_14px_40px_rgba(7,63,67,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,63,67,0.07)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-[#70888a]">
                {tr.all}
              </div>

              <div className="flex size-9 items-center justify-center rounded-[13px] bg-[#eaf0ff] text-[#3977e8]">
                <CheckIcon />
              </div>
            </div>

            <div className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43]">
              {data.items.length}
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[30px] border border-[#073f43]/7 bg-white shadow-[0_20px_60px_rgba(7,63,67,0.06)]">
          <div className="flex items-center gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:px-6">
            <div className="flex size-10 items-center justify-center rounded-[14px] bg-[#edf9fb] text-[#078b7b]">
              <BellIcon size={19} />
            </div>

            <div className="text-sm font-black text-[#31595b]">
              {tr.inbox}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center p-6">
              <div className="text-center">
                <div className="mx-auto size-7 animate-spin rounded-full border-[3px] border-[#12b8c4]/15 border-t-[#078b7b]" />

                <div className="mt-4 text-sm font-bold text-[#6d8587]">
                  {tr.loading}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-5 sm:p-6">
              <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                {error}
              </div>
            </div>
          ) : data.items.length ===
            0 ? (
            <div className="flex min-h-[320px] items-center justify-center p-6">
              <div className="max-w-md text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#edf9fb] text-[#078b7b]">
                  <BellIcon size={28} />
                </div>

                <div className="mt-5 text-base font-black text-[#31595b]">
                  {tr.empty}
                </div>

                <p className="mt-2 text-sm leading-6 text-[#839697]">
                  {tr.emptyHint}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#073f43]/6">
              {data.items.map(
                (item) => {
                  const meta =
                    notificationMeta(
                      item.type
                    );

                  return (
                    <article
                      key={item.id}
                      className={`relative px-5 py-5 transition-colors sm:px-6 ${
                        item.read
                          ? "bg-white hover:bg-[#fbfdfd]"
                          : "bg-gradient-to-r from-[#effbf9]/75 via-white to-[#f3f7ff]/65 hover:from-[#eaf9f6]"
                      }`}
                    >
                      {!item.read && (
                        <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-gradient-to-b from-[#12b8c4] to-[#3977e8]" />
                      )}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-[16px] ${meta.iconClass}`}
                        >
                          {iconFor(
                            meta.icon
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${meta.badgeClass}`}
                            >
                              {item.type}
                            </span>

                            {!item.read && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f8f5] px-2.5 py-1 text-[10px] font-black text-[#078b7b]">
                                <span className="size-1.5 rounded-full bg-[#12b8c4]" />
                                {tr.unread}
                              </span>
                            )}
                          </div>

                          <h2 className="mt-3 text-base font-black leading-6 text-[#234d50]">
                            {item.title}
                          </h2>

                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[#667f81]">
                            {item.message}
                          </p>

                          <div className="mt-3 text-[11px] font-bold text-[#98a7a8]">
                            {tr.createdAt}:{" "}
                            {formatDate(
                              item.createdAt,
                              lang
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 sm:pt-1">
                          {item.read ? (
                            <span className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[#f2f6f6] px-3.5 text-xs font-extrabold text-[#849596]">
                              <CheckIcon />
                              {tr.read}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                void markAsRead(
                                  item.id
                                )
                              }
                              disabled={
                                markingId ===
                                item.id
                              }
                              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#12b8c4]/18 bg-white px-4 text-xs font-extrabold text-[#078b7b] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#12b8c4]/35 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {markingId ===
                              item.id
                                ? "…"
                                : tr.markRead}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
