"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";

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
  ru: {
    title: "Уведомления",
    openAll: "Открыть все",
    unread: "Непрочитанные",
    empty: "Пока уведомлений нет.",
    loading: "Загрузка уведомлений...",
    loadFailed: "Не удалось загрузить уведомления.",
    markRead: "Прочитать",
    read: "Прочитано",
    readFailed: "Не удалось отметить уведомление как прочитанное."
  },
  en: {
    title: "Notifications",
    openAll: "Open all",
    unread: "Unread",
    empty: "No notifications yet.",
    loading: "Loading notifications...",
    loadFailed: "Failed to load notifications.",
    markRead: "Mark as read",
    read: "Read",
    readFailed: "Failed to mark the notification as read."
  },
  hy: {
    title: "Ծանուցումներ",
    openAll: "Բացել բոլորը",
    unread: "Չընթերցված",
    empty: "Ծանուցումներ դեռ չկան։",
    loading: "Ծանուցումները բեռնվում են...",
    loadFailed: "Չհաջողվեց բեռնել ծանուցումները։",
    markRead: "Նշել որպես ընթերցված",
    read: "Ընթերցված է",
    readFailed: "Չհաջողվեց նշել ծանուցումը որպես ընթերցված։"
  }
} as const;

function formatDate(value: string, lang: Lang) {
  try {
    const locale = lang === "ru" ? "ru-RU" : lang === "hy" ? "hy-AM" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function typeTone(type: string) {
  const x = (type || "").toUpperCase();

  if (x.includes("CANCEL") || x.includes("EXPIRED")) {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (x.includes("COMPLETED") || x.includes("STARTED") || x.includes("READY")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (x.includes("REMINDER")) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-sky-200 bg-sky-50 text-sky-800";
}

export function NotificationsPreviewCard({
  href
}: {
  href: string;
}) {
  const [lang, setLang] = useState<Lang>("ru");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [data, setData] = useState<NotificationListResponse>({
    unreadCount: 0,
    items: []
  });

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();

    const onFocus = () => syncLang();
    const onVisible = () => {
      if (document.visibilityState === "visible") syncLang();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const tr = TXT[lang];

  async function loadNotifications(silent = false) {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const r = await fetch("/api/notifications/me", { cache: "no-store" });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.loadFailed);
        return;
      }

      const items = Array.isArray(j?.items) ? j.items.slice(0, 3) : [];
      const unreadCount = typeof j?.unreadCount === "number" ? j.unreadCount : 0;

      setData({ unreadCount, items });
    } catch {
      setError(tr.loadFailed);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadNotifications(false);

    const timer = window.setInterval(() => {
      loadNotifications(true);
    }, 15000);

    return () => window.clearInterval(timer);
  }, [lang]);

  async function markAsRead(notificationId: number) {
    try {
      setMarkingId(notificationId);
      setError(null);

      const r = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST"
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.readFailed);
        return;
      }

      setData((prev) => {
        const wasUnread = prev.items.some((item) => item.id === notificationId && !item.read);

        return {
          unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
          items: prev.items.map((item) =>
            item.id === notificationId ? { ...item, read: true } : item
          )
        };
      });
    } catch {
      setError(tr.readFailed);
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold">{tr.title}</div>
          <div className="mt-1 text-sm text-gray-600">
            {tr.unread}: {data.unreadCount}
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          {tr.openAll}
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
          {tr.loading}
        </div>
      ) : error ? (
        <div className="mt-4 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : data.items.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
          {tr.empty}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 ${item.read ? "bg-white" : "bg-sky-50/40"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs ${typeTone(item.type)}`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="mt-2 font-medium text-slate-900">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {item.message}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {formatDate(item.createdAt, lang)}
                  </div>
                </div>

                <div className="shrink-0">
                  {item.read ? (
                    <span className="inline-flex rounded-full border bg-slate-50 px-3 py-1 text-xs text-slate-600">
                      {tr.read}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      disabled={markingId === item.id}
                      className="inline-flex rounded-2xl border px-3 py-2 text-xs hover:bg-white disabled:opacity-50"
                    >
                      {markingId === item.id ? "..." : tr.markRead}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
