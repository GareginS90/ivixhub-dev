"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";
import PsychologistName from "@/components/psychologists/PsychologistName";
import ClientPersonalInfoCard from "@/components/account/ClientPersonalInfoCard";

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
    title: "Личный кабинет",
    subtitle: "Управляйте бронированиями, оплатами и будущими сессиями.",
    quiz: "Пройти тест",
    quizDesc: "Подобрать подходящего специалиста.",
    catalog: "Каталог психологов",
    catalogDesc: "Найти психолога и выбрать удобное время.",
    support: "Поддержка",
    supportDesc: "Правила, помощь и ответы на вопросы.",
    account: "Аккаунт",
    accountDesc: "Настройки аккаунта и запрос на удаление профиля.",
    deleteAccount: "Удалить аккаунт",
    pending: "Ожидают оплаты",
    upcoming: "Предстоящие сессии",
    past: "История сессий",
    noPending: "Нет сессий, ожидающих оплату.",
    noUpcoming: "Нет предстоящих сессий.",
    noPast: "История пока пуста.",
    psychologist: "Психолог",
    start: "Начало",
    end: "Конец",
    type: "Тип",
    language: "Язык",
    logout: "Выйти",
    loading: "Загрузка…",
    error: "Ошибка",
    continuePayment: "Продолжить оплату",
    openBooking: "Открыть бронь"
  },
  en: {
    title: "Dashboard",
    subtitle: "Manage bookings, payments and upcoming sessions.",
    quiz: "Take quiz",
    quizDesc: "Find the right specialist.",
    catalog: "Psychologists catalog",
    catalogDesc: "Find a psychologist and choose a convenient time.",
    support: "Support",
    supportDesc: "Policies, help and answers.",
    account: "Account",
    accountDesc: "Account settings and profile deletion request.",
    deleteAccount: "Delete account",
    pending: "Pending payment",
    upcoming: "Upcoming sessions",
    past: "Session history",
    noPending: "No sessions waiting for payment.",
    noUpcoming: "No upcoming sessions.",
    noPast: "History is empty.",
    psychologist: "Psychologist",
    start: "Start",
    end: "End",
    type: "Type",
    language: "Language",
    logout: "Logout",
    loading: "Loading…",
    error: "Error",
    continuePayment: "Continue payment",
    openBooking: "Open booking"
  },
  hy: {
    title: "Անձնական էջ",
    subtitle: "Կառավարեք ամրագրումները, վճարումները և առաջիկա սեանսները։",
    quiz: "Անցնել թեստը",
    quizDesc: "Գտնել համապատասխան մասնագետի։",
    catalog: "Հոգեբանների կատալոգ",
    catalogDesc: "Գտնել հոգեբան և ընտրել հարմար ժամ։",
    support: "Աջակցություն",
    supportDesc: "Կանոններ, օգնություն և պատասխաններ։",
    account: "Հաշիվ",
    accountDesc: "Հաշվի կարգավորումներ և պրոֆիլի հեռացման հարցում։",
    deleteAccount: "Հեռացնել հաշիվը",
    pending: "Սպասում են վճարման",
    upcoming: "Առաջիկա սեանսներ",
    past: "Սեանսների պատմություն",
    noPending: "Վճարման սպասող սեանսներ չկան։",
    noUpcoming: "Առաջիկա սեանսներ չկան։",
    noPast: "Պատմությունը դեռ դատարկ է։",
    psychologist: "Հոգեբան",
    start: "Սկիզբ",
    end: "Ավարտ",
    type: "Տեսակ",
    language: "Լեզու",
    logout: "Դուրս գալ",
    loading: "Բեռնվում է…",
    error: "Սխալ",
    continuePayment: "Շարունակել վճարումը",
    openBooking: "Բացել ամրագրումը"
  }
} as const;

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

function isPendingPayment(status: string) {
  const x = (status || "").toUpperCase();
  return x === "CREATED" || x === "PENDING_PAYMENT" || x === "INITIATED";
}

function isPast(status: string, startAtUtc: string) {
  const s = (status || "").toUpperCase();
  if (s === "COMPLETED" || s === "CANCELLED" || s === "CANCELLED_BY_CLIENT" || s === "CANCELLED_BY_PSYCHOLOGIST") {
    return true;
  }
  return new Date(startAtUtc).getTime() < Date.now();
}

function isUpcoming(status: string, startAtUtc: string) {
  const s = (status || "").toUpperCase();
  if (isPendingPayment(s)) return false;
  if (s === "COMPLETED" || s === "CANCELLED" || s === "CANCELLED_BY_CLIENT" || s === "CANCELLED_BY_PSYCHOLOGIST") {
    return false;
  }
  return new Date(startAtUtc).getTime() >= Date.now();
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toUpperCase();

  let cls = "bg-slate-50 text-slate-700 border-slate-200";
  if (s === "CONFIRMED") cls = "bg-emerald-50 text-emerald-800 border-emerald-200";
  else if (s === "CREATED" || s === "INITIATED" || s === "PENDING_PAYMENT") cls = "bg-amber-50 text-amber-800 border-amber-200";
  else if (s.includes("CANCELLED")) cls = "bg-rose-50 text-rose-800 border-rose-200";
  else if (s === "COMPLETED") cls = "bg-blue-50 text-blue-800 border-blue-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${cls}`}>
      {status}
    </span>
  );
}

function BookingCard({
  b,
  tr,
  action
}: {
  b: Booking;
  tr: (typeof TXT)["ru"];
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold">#{b.id}</div>
        <StatusBadge status={b.status} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="text-gray-500">{tr.psychologist}:</span>{" "}
          <span className="font-medium"><PsychologistName psychologistId={b.psychologistId} /></span>
        </div>
        <div>
          <span className="text-gray-500">{tr.start}:</span>{" "}
          <span className="font-medium">{fmtDateTime(b.startAtUtc)}</span>
        </div>
        <div>
          <span className="text-gray-500">{tr.end}:</span>{" "}
          <span className="font-medium">{fmtDateTime(b.endAtUtc)}</span>
        </div>
        <div>
          <span className="text-gray-500">{tr.type}:</span>{" "}
          <span className="font-medium">{b.type}</span>
        </div>
        <div>
          <span className="text-gray-500">{tr.language}:</span>{" "}
          <span className="font-medium">{b.language || "—"}</span>
        </div>
      </div>

      <div className="mt-4">
        {action ? action : (
          <Link
            href={`/app/bookings/${b.id}`}
            className="inline-flex w-full justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
          >
            {tr.openBooking}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const router = useRouter();
  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  async function logout() {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/bookings/my", { cache: "no-store" as any });
        if (!r.ok) {
          const j = await r.json().catch(() => null);
          setError(j?.message || `Failed to load bookings (${r.status})`);
          return;
        }
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pending = useMemo(
    () => items.filter(x => isPendingPayment(x.status)).sort((a, b) => a.startAtUtc.localeCompare(b.startAtUtc)),
    [items]
  );

  const upcoming = useMemo(
    () => items.filter(x => isUpcoming(x.status, x.startAtUtc)).sort((a, b) => a.startAtUtc.localeCompare(b.startAtUtc)),
    [items]
  );

  const past = useMemo(
    () => items.filter(x => isPast(x.status, x.startAtUtc)).sort((a, b) => b.startAtUtc.localeCompare(a.startAtUtc)),
    [items]
  );

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">{tr.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{tr.subtitle}</p>
          </div>

          <button
            onClick={logout}
            disabled={logoutLoading}
            className="rounded-2xl border px-4 py-3 hover:bg-gray-50 disabled:opacity-60"
          >
            {logoutLoading ? "..." : tr.logout}
          </button>
        </div>

        <ClientPersonalInfoCard />

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/quiz" className="rounded-3xl border bg-white p-5 shadow-sm hover:bg-gray-50">
            <div className="font-semibold">{tr.quiz}</div>
            <div className="mt-2 text-sm text-gray-600">{tr.quizDesc}</div>
          </Link>

          <Link href="/psychologists" className="rounded-3xl border bg-white p-5 shadow-sm hover:bg-gray-50">
            <div className="font-semibold">{tr.catalog}</div>
            <div className="mt-2 text-sm text-gray-600">{tr.catalogDesc}</div>
          </Link>

          <Link href="/support" className="rounded-3xl border bg-white p-5 shadow-sm hover:bg-gray-50">
            <div className="font-semibold">{tr.support}</div>
            <div className="mt-2 text-sm text-gray-600">{tr.supportDesc}</div>
          </Link>
        </section>

        <section className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="font-semibold">{tr.account}</div>
          <div className="mt-2 text-sm text-gray-600">{tr.accountDesc}</div>

          <div className="mt-4">
            <Link
              href="/app/account/delete"
              className="inline-flex justify-center rounded-2xl border px-4 py-3 hover:bg-gray-50"
            >
              {tr.deleteAccount}
            </Link>
          </div>
        </section>

        {loading && (
          <div className="mt-8 rounded-3xl border bg-white p-6">
            {tr.loading}
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-3xl border bg-red-50 p-6 text-sm text-red-800">
            <b>{tr.error}:</b> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="mt-8">
              <h2 className="text-xl font-semibold">{tr.pending}</h2>
              {pending.length === 0 ? (
                <div className="mt-3 rounded-3xl border bg-white p-5 text-sm text-gray-700">
                  {tr.noPending}
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pending.map((b) => (
                    <BookingCard
                      key={b.id}
                      b={b}
                      tr={tr}
                      action={
                        <Link
                          href={`/app/checkout/${b.id}`}
                          className="inline-flex w-full justify-center rounded-2xl bg-black text-white px-4 py-3 hover:opacity-90"
                        >
                          {tr.continuePayment}
                        </Link>
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">{tr.upcoming}</h2>
              {upcoming.length === 0 ? (
                <div className="mt-3 rounded-3xl border bg-white p-5 text-sm text-gray-700">
                  {tr.noUpcoming}
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} b={b} tr={tr} />
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">{tr.past}</h2>
              {past.length === 0 ? (
                <div className="mt-3 rounded-3xl border bg-white p-5 text-sm text-gray-700">
                  {tr.noPast}
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {past.map((b) => (
                    <BookingCard key={b.id} b={b} tr={tr} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
