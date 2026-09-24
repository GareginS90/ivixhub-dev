"use client";

import { useMemo, useState } from "react";

type Lang = "ru" | "en" | "hy";

type AvailabilityItem = {
  id: number;
  psychologistId: number;
  dayOfWeek: string;
  startTimeUtc: string;
  endTimeUtc: string;
};

const TXT = {
  ru: {
    title: "Календарь доступности",
    subtitle: "Повторяющиеся weekly-слоты отображаются в формате календарной недели.",
    prev: "← Предыдущая неделя",
    next: "Следующая неделя →",
    today: "Текущая неделя",
    empty: "Свободных окон нет",
    mon: "Пн",
    tue: "Вт",
    wed: "Ср",
    thu: "Чт",
    fri: "Пт",
    sat: "Сб",
    sun: "Вс"
  },
  en: {
    title: "Availability calendar",
    subtitle: "Recurring weekly slots are shown as a calendar week.",
    prev: "← Previous week",
    next: "Next week →",
    today: "Current week",
    empty: "No slots",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun"
  },
  hy: {
    title: "Հասանելիության օրացույց",
    subtitle: "Կրկնվող weekly սլոթերը ցուցադրվում են օրացուցային շաբաթվա ձևաչափով։",
    prev: "← Նախորդ շաբաթ",
    next: "Հաջորդ շաբաթ →",
    today: "Ընթացիկ շաբաթ",
    empty: "Ազատ ժամեր չկան",
    mon: "Երկ",
    tue: "Երք",
    wed: "Չրք",
    thu: "Հնգ",
    fri: "Ուրբ",
    sat: "Շբթ",
    sun: "Կիր"
  }
} as const;

function weekdayIndex(dayOfWeek: string) {
  switch ((dayOfWeek || "").toUpperCase()) {
    case "MON":
      return 0;
    case "TUE":
      return 1;
    case "WED":
      return 2;
    case "THU":
      return 3;
    case "FRI":
      return 4;
    case "SAT":
      return 5;
    case "SUN":
      return 6;
    default:
      return -1;
  }
}

function startOfWeekMonday(base: Date) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);

  const jsDay = d.getDay();
  const mondayBasedOffset = jsDay === 0 ? -6 : 1 - jsDay;
  d.setDate(d.getDate() + mondayBasedOffset);

  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDayDate(date: Date, lang: Lang) {
  const locale = lang === "ru" ? "ru-RU" : lang === "hy" ? "hy-AM" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit"
  }).format(date);
}

function formatWeekRange(start: Date, lang: Lang) {
  const locale = lang === "ru" ? "ru-RU" : lang === "hy" ? "hy-AM" : "en-US";
  const end = addDays(start, 6);

  const startLabel = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit"
  }).format(start);

  const endLabel = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(end);

  return `${startLabel} — ${endLabel}`;
}

function shortDayLabel(lang: Lang, index: number) {
  const tr = TXT[lang];
  if (index === 0) return tr.mon;
  if (index === 1) return tr.tue;
  if (index === 2) return tr.wed;
  if (index === 3) return tr.thu;
  if (index === 4) return tr.fri;
  if (index === 5) return tr.sat;
  return tr.sun;
}

export default function PsychologistAvailabilityCalendar({
  lang,
  availability
}: {
  lang: Lang;
  availability: AvailabilityItem[];
}) {
  const tr = TXT[lang];
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const now = new Date();
    const monday = startOfWeekMonday(now);
    return addDays(monday, weekOffset * 7);
  }, [weekOffset]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const slots = availability
        .filter((slot) => weekdayIndex(slot.dayOfWeek) === i)
        .sort((a, b) => a.startTimeUtc.localeCompare(b.startTimeUtc));

      return {
        index: i,
        date,
        slots
      };
    });
  }, [availability, weekStart]);

  return (
    <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{tr.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{tr.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((x) => x - 1)}
            className="rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            {tr.prev}
          </button>

          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            {tr.today}
          </button>

          <button
            type="button"
            onClick={() => setWeekOffset((x) => x + 1)}
            className="rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            {tr.next}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        {formatWeekRange(weekStart, lang)}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-7">
        {days.map((day) => (
          <div key={day.index} className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {shortDayLabel(lang, day.index)}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatDayDate(day.date, lang)}
            </div>

            <div className="mt-4 space-y-2">
              {day.slots.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-white px-3 py-3 text-xs text-slate-500">
                  {tr.empty}
                </div>
              ) : (
                day.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-xl border bg-white px-3 py-3 text-sm text-slate-800"
                  >
                    <div className="font-medium">
                      {slot.startTimeUtc} — {slot.endTimeUtc}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
