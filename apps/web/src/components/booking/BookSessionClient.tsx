"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Slot = {
  startAtUtc: string;
  endAtUtc: string;
  available: boolean;
};

const TXT = {
  ru: {
    back: "← Назад к профилю",
    logged: "Вы вошли",
    login: "Войти, чтобы забронировать",
    title: "Забронировать сессию",
    subtitle: "Время показано в вашей локальной зоне.",
    policy: "Политика отмены",
    p1: "Бесплатная отмена не позднее чем за 24 часа до начала сессии.",
    p2: "Если осталось меньше 24 часов, отмена может быть ограничена.",
    p3: "Все платежи проходят через escrow.",
    type: "Тип сессии",
    language: "Язык сессии",
    chooseDay: "Выберите день",
    chooseTime: "Выберите время",
    noSlots: "Пока нет доступных слотов.",
    cont: "Продолжить",
    confirm: "Подтверждение",
    confirmBtn: "Подтвердить бронь",
    creating: "Создание…",
    backBtn: "Назад",
    loading: "Загрузка доступности…",
    slotTaken: "Этот слот уже заняли. Пожалуйста, выберите другой.",
    individual: "Индивидуальная",
    couples: "Для пары",
    group: "Групповая",
    booked: "Занято",
    selected: "Выбрано",
    summary: "Детали бронирования",
    day: "Дата",
    time: "Время"
  },
  en: {
    back: "← Back to profile",
    logged: "Logged in",
    login: "Login to book",
    title: "Book a session",
    subtitle: "Times are shown in your local timezone.",
    policy: "Cancellation policy",
    p1: "Free cancellation up to 24 hours before the session start.",
    p2: "If less than 24 hours remain, cancellation may be restricted.",
    p3: "All payments use escrow.",
    type: "Session type",
    language: "Session language",
    chooseDay: "Choose a day",
    chooseTime: "Choose a time",
    noSlots: "No available slots yet.",
    cont: "Continue",
    confirm: "Confirmation",
    confirmBtn: "Confirm booking",
    creating: "Creating…",
    backBtn: "Back",
    loading: "Loading availability…",
    slotTaken: "This slot has already been booked. Please choose another one.",
    individual: "Individual",
    couples: "Couples",
    group: "Group",
    booked: "Booked",
    selected: "Selected",
    summary: "Booking details",
    day: "Date",
    time: "Time"
  },
  hy: {
    back: "← Վերադառնալ պրոֆիլ",
    logged: "Դուք մուտք եք գործել",
    login: "Մուտք գործել ամրագրման համար",
    title: "Ամրագրել սեանս",
    subtitle: "Ժամը ցուցադրվում է ձեր տեղական ժամային գոտով։",
    policy: "Չեղարկման կանոններ",
    p1: "Անվճար չեղարկում՝ սեանսից 24 ժամ առաջ։",
    p2: "Եթե մնացել է 24 ժամից քիչ, չեղարկումը կարող է սահմանափակվել։",
    p3: "Բոլոր վճարումները անցնում են escrow-ով։",
    type: "Սեանսի տեսակ",
    language: "Սեանսի լեզու",
    chooseDay: "Ընտրեք օրը",
    chooseTime: "Ընտրեք ժամը",
    noSlots: "Առայժմ ազատ ժամեր չկան։",
    cont: "Շարունակել",
    confirm: "Հաստատում",
    confirmBtn: "Հաստատել ամրագրումը",
    creating: "Ստեղծվում է…",
    backBtn: "Հետ",
    loading: "Բեռնվում է հասանելիությունը…",
    slotTaken: "Այս ժամը արդեն ամրագրված է։ Խնդրում ենք ընտրել մյուսը։",
    individual: "Անհատական",
    couples: "Զույգի համար",
    group: "Խմբային",
    booked: "Զբաղված",
    selected: "Ընտրված",
    summary: "Ամրագրման տվյալներ",
    day: "Ամսաթիվ",
    time: "Ժամ"
  }
} as const;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("hy-AM", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("hy-AM", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function fmtWeekday(d: Date) {
  return d.toLocaleDateString("hy-AM", {
    weekday: "short"
  });
}

function dayKeyFromIso(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function BookSessionClient({ psychologistId }: { psychologistId: number }) {
  const lang = getUiLangFromCookie();
  const tr = TXT[lang];

  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const nextUrl = `/psychologists/${psychologistId}/book`;

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"SELF" | "COUPLES" | "GROUP">("SELF");
  const [sessionLanguage, setSessionLanguage] = useState<"HY" | "RU" | "EN">("HY");

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
    const to = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url =
          `/api/psychologists/${psychologistId}/slots` +
          `?from=${encodeURIComponent(from.toISOString())}` +
          `&to=${encodeURIComponent(to.toISOString())}` +
          `&type=${encodeURIComponent(type)}`;

        const r = await fetch(url, { cache: "no-store" as any });
        const j = await r.json().catch(() => null);

        if (!r.ok) {
          setError(j?.message || `Slots fetch failed (${r.status})`);
          return;
        }

        setSlots(Array.isArray(j) ? j : []);
        setSelectedSlot(null);
        setStep("SELECT");
      } catch (e: any) {
        setError(e?.message || "Failed to load slots");
      } finally {
        setLoading(false);
      }
    })();
  }, [psychologistId, type]);

  const slotsByDate = useMemo(() => {
    const unique = new Map<string, Slot>();

    for (const s of slots) {
      const key = `${s.startAtUtc}__${s.endAtUtc}`;
      const prev = unique.get(key);

      if (!prev) {
        unique.set(key, s);
      } else {
        unique.set(key, {
          ...s,
          available: prev.available && s.available
        });
      }
    }

    const map = new Map<string, Slot[]>();
    for (const s of unique.values()) {
      const dateKey = dayKeyFromIso(s.startAtUtc);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(s);
    }

    for (const arr of map.values()) {
      arr.sort((a, b) => a.startAtUtc.localeCompare(b.startAtUtc));
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  useEffect(() => {
    if (slotsByDate.length === 0) {
      setSelectedDay(null);
      return;
    }

    if (!selectedDay || !slotsByDate.find(([d]) => d === selectedDay)) {
      setSelectedDay(slotsByDate[0][0]);
    }
  }, [slotsByDate, selectedDay]);

  const visibleSlots = useMemo(() => {
    if (!selectedDay) return [];
    const found = slotsByDate.find(([d]) => d === selectedDay);
    return found ? found[1] : [];
  }, [slotsByDate, selectedDay]);

  async function createBooking() {
    if (!selectedSlot || creating || !selectedSlot.available) return;

    setCreating(true);
    setError(null);

    try {
      const r = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psychologistId,
          startAtUtc: selectedSlot.startAtUtc,
          type,
          language: sessionLanguage
        })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const details = j?.details || "";
        if (details.includes("Slot is already booked")) {
          setError(tr.slotTaken);
          setSelectedSlot(null);
          setStep("SELECT");
          return;
        }
        setError(j?.details ? `${j?.message || "Booking create failed"} | ${j.details}` : (j?.message || "Booking create failed"));
        return;
      }

      if (j?.id) {
        window.location.href = `/app/checkout/${j.id}`;
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link href={`/psychologists/${psychologistId}`} className="text-sm text-gray-600 hover:text-black">
            {tr.back}
          </Link>

          {!mounted ? (
            <span className="text-xs text-gray-400">...</span>
          ) : !isAuthed ? (
            <Link href={`/auth/login?next=${encodeURIComponent(nextUrl)}`} className="rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90">
              {tr.login}
            </Link>
          ) : (
            <span className="text-xs text-gray-600">{tr.logged}</span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-semibold">{tr.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{tr.subtitle}</p>

        <div className="mt-4 rounded-3xl border bg-white p-5 shadow-sm text-sm">
          <div className="font-semibold">{tr.policy}</div>
          <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
            <li>{tr.p1}</li>
            <li>{tr.p2}</li>
            <li>{tr.p3}</li>
          </ul>
        </div>

        {loading && <div className="mt-6 rounded-3xl border bg-white p-6">{tr.loading}</div>}
        {error && (
          <div className="mt-6 rounded-3xl border bg-red-50 p-6 text-red-800 text-sm">
            <b>Error:</b> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium">{tr.type}</div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setType("SELF")} className={`rounded-2xl border px-4 py-3 text-sm ${type === "SELF" ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                    {tr.individual}
                  </button>
                  <button onClick={() => setType("COUPLES")} className={`rounded-2xl border px-4 py-3 text-sm ${type === "COUPLES" ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                    {tr.couples}
                  </button>
                  <button onClick={() => setType("GROUP")} className={`rounded-2xl border px-4 py-3 text-sm ${type === "GROUP" ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                    {tr.group}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium">{tr.language}</div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setSessionLanguage("HY")} className={`rounded-2xl border px-4 py-3 text-sm ${sessionLanguage === "HY" ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                    Հայերեն
                  </button>
                  <button onClick={() => setSessionLanguage("RU")} className={`rounded-2xl border px-4 py-3 text-sm ${sessionLanguage === "RU" ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                    Русский
                  </button>
                  <button onClick={() => setSessionLanguage("EN")} className={`rounded-2xl border px-4 py-3 text-sm ${sessionLanguage === "EN" ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                    English
                  </button>
                </div>
              </div>
            </div>

            {step === "SELECT" && (
              <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium">{tr.chooseDay}</div>

                {slotsByDate.length === 0 ? (
                  <div className="mt-4 text-sm text-gray-700">{tr.noSlots}</div>
                ) : (
                  <>
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                      {slotsByDate.map(([dateKey, list]) => {
                        const d = new Date(`${dateKey}T00:00:00`);
                        const availableCount = list.filter(x => x.available).length;
                        const active = selectedDay === dateKey;

                        return (
                          <button
                            key={dateKey}
                            onClick={() => {
                              setSelectedDay(dateKey);
                              setSelectedSlot(null);
                            }}
                            className={`min-w-[140px] rounded-2xl border px-4 py-3 text-left transition ${
                              active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-xs opacity-80">{fmtWeekday(d)}</div>
                            <div className="mt-1 font-medium">{fmtDate(d)}</div>
                            <div className="mt-1 text-xs opacity-80">
                              {availableCount}/{list.length}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 text-sm font-medium">{tr.chooseTime}</div>

                    {visibleSlots.length === 0 ? (
                      <div className="mt-3 text-sm text-gray-700">{tr.noSlots}</div>
                    ) : (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {visibleSlots.map((s) => {
                          const local = new Date(s.startAtUtc);
                          const selected = selectedSlot?.startAtUtc === s.startAtUtc;

                          return (
                            <button
                              key={`${s.startAtUtc}-${s.endAtUtc}`}
                              onClick={() => s.available && setSelectedSlot(s)}
                              disabled={!s.available}
                              className={`rounded-2xl border px-3 py-3 text-sm transition ${
                                !s.available
                                  ? "bg-gray-800 text-white border-gray-800 cursor-not-allowed opacity-90"
                                  : selected
                                    ? "bg-black text-white border-black"
                                    : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="font-medium">{fmtTime(local)}</div>
                              <div className="mt-1 text-[11px] opacity-80">
                                {!s.available ? tr.booked : selected ? tr.selected : ""}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button
                      disabled={!selectedSlot}
                      onClick={() => setStep("CONFIRM")}
                      className="mt-6 w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
                    >
                      {tr.cont}
                    </button>
                  </>
                )}
              </div>
            )}

            {step === "CONFIRM" && (
              <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-lg font-semibold">{tr.confirm}</div>

                <div className="mt-4 rounded-2xl border bg-slate-50 p-5 text-sm">
                  <div className="font-medium">{tr.summary}</div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">{tr.type}</div>
                      <div className="mt-1 font-medium">{type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{tr.language}</div>
                      <div className="mt-1 font-medium">{sessionLanguage}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{tr.day}</div>
                      <div className="mt-1 font-medium">
                        {selectedSlot ? fmtDate(new Date(selectedSlot.startAtUtc)) : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{tr.time}</div>
                      <div className="mt-1 font-medium">
                        {selectedSlot ? fmtTime(new Date(selectedSlot.startAtUtc)) : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!selectedSlot || creating || !selectedSlot.available}
                  onClick={createBooking}
                  className="mt-6 w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
                >
                  {creating ? tr.creating : tr.confirmBtn}
                </button>

                <button
                  onClick={() => setStep("SELECT")}
                  className="mt-3 w-full rounded-2xl border py-3 hover:bg-gray-50"
                >
                  {tr.backBtn}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
