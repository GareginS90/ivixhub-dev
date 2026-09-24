"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NotificationListResponse = {
  unreadCount: number;
  items: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
};

export function NotificationsBell({
  href
}: {
  href: string;
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await fetch("/api/notifications/me", { cache: "no-store" });
        const j = (await r.json().catch(() => null)) as NotificationListResponse | null;

        if (!cancelled && r.ok) {
          setUnreadCount(typeof j?.unreadCount === "number" ? j.unreadCount : 0);
        }
      } catch {
        if (!cancelled) {
          setUnreadCount(0);
        }
      }
    }

    load();
    const timer = window.setInterval(load, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Link
      href={href}
      aria-label="Notifications"
      className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-white hover:bg-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="text-slate-700"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18H9M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4.5 18H19.5L18 16ZM13.73 21C13.5531 21.3031 13.2994 21.5542 12.9944 21.7278C12.6894 21.9013 12.3442 21.9912 11.9933 21.9886C11.6425 21.9861 11.2986 21.8912 10.9962 21.7133C10.6937 21.5353 10.4436 21.2806 10.2711 20.975L10.25 20.9375"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {unreadCount > 0 && (
        <>
          <span className="absolute right-1.5 top-1.5 min-w-[20px] rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
          <span className="sr-only">{unreadCount} unread notifications</span>
        </>
      )}
    </Link>
  );
}
