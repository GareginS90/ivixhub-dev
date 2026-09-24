"use client";

import { useMemo, useState } from "react";

type Lang = "ru" | "en" | "hy";

const TXT = {
  ru: {
    title: "Рабочие часы",
    subtitle: "Выберите дату в календаре и рабочее окно. Платформа будет повторять это окно каждую неделю в соответствующий день недели.",
    date: "Дата",
    weekday: "День недели",
    start: "Начало окна",
    end: "Конец окна",
    add: "Сохранить окно",
    saving: "Сохранение...",
    repeatHint: "Выбранная дата нужна только для выбора дня недели. После сохранения окно будет повторяться еженедельно.",
    invalidRange: "Время окончания должно быть позже времени начала.",
    mon: "Понедельник",
    tue: "Вторник",
    wed: "Среда",
    thu: "Четверг",
    fri: "Пятница",
    sat: "Суббота",
    sun: "Воскресенье"
  },
  en: {
    title: "Working hours",
    subtitle: "Choose a date in the calendar and a working window. The platform will repeat this window every week on the corresponding weekday.",
    date: "Date",
    weekday: "Weekday",
    start: "Window start",
    end: "Window end",
    add: "Save window",
    saving: "Saving...",
    repeatHint: "The selected date is used only to determine the weekday. After saving, the window will repeat weekly.",
    invalidRange: "End time must be later than start time.",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday"
  },
  hy: {
    title: "Աշխատանքային ժամեր",
    subtitle: "Ընտրեք ամսաթիվ օրացույցից և աշխատանքային պատուհան։ Հարթակը կկրկնի այս պատուհանը ամեն շաբաթ համապատասխան շաբաթվա օրը։",
    date: "Ամսաթիվ",
    weekday: "Շաբաթվա օր",
    start: "Պատուհանի սկիզբ",
    end: "Պատուհանի ավարտ",
    add: "Պահպանել պատուհանը",
    saving: "Պահպանվում է...",
    repeatHint: "Ընտրված ամսաթիվը պետք է միայն շաբաթվա օրը որոշելու համար։ Պահպանելուց հետո պատուհանը կկրկնվի ամեն շաբաթ։",
    invalidRange: "Ավարտի ժամը պետք է ավելի ուշ լինի, քան սկզբի ժամը։",
    mon: "Երկուշաբթի",
    tue: "Երեքշաբթի",
    wed: "Չորեքշաբթի",
    thu: "Հինգշաբթի",
    fri: "Ուրբաթ",
    sat: "Շաբաթ",
    sun: "Կիրակի"
  }
} as const;

function todayLocalDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildTimeOptions() {
  const items: string[] = [];
  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += 5) {
      items.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return items;
}

const TIME_OPTIONS = buildTimeOptions();

function mapDateToDayOfWeek(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00`);
  const day = date.getDay();

  if (day === 1) return "MON";
  if (day === 2) return "TUE";
  if (day === 3) return "WED";
  if (day === 4) return "THU";
  if (day === 5) return "FRI";
  if (day === 6) return "SAT";
  return "SUN";
}

function dayLabel(lang: Lang, dayOfWeek: string) {
  const tr = TXT[lang];
  switch ((dayOfWeek || "").toUpperCase()) {
    case "MON":
      return tr.mon;
    case "TUE":
      return tr.tue;
    case "WED":
      return tr.wed;
    case "THU":
      return tr.thu;
    case "FRI":
      return tr.fri;
    case "SAT":
      return tr.sat;
    default:
      return tr.sun;
  }
}

export default function PsychologistAvailabilityPlanner({
  lang,
  saving,
  onSubmit
}: {
  lang: Lang;
  saving: boolean;
  onSubmit: (payload: {
    dayOfWeek: string;
    startTimeUtc: string;
    endTimeUtc: string;
  }) => Promise<void> | void;
}) {
  const tr = TXT[lang];
  const [dateValue, setDateValue] = useState(todayLocalDate());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedDayOfWeek = useMemo(() => mapDateToDayOfWeek(dateValue), [dateValue]);
  const selectedDayLabel = useMemo(() => dayLabel(lang, selectedDayOfWeek), [lang, selectedDayOfWeek]);

  async function submit() {
    setLocalError(null);

    if (!dateValue || !startTime || !endTime) {
      return;
    }

    if (endTime <= startTime) {
      setLocalError(tr.invalidRange);
      return;
    }

    await onSubmit({
      dayOfWeek: selectedDayOfWeek,
      startTimeUtc: startTime,
      endTimeUtc: endTime
    });
  }

  return (
    <div className="mt-5 rounded-3xl border bg-slate-50 p-5">
      <div>
        <div className="text-base font-semibold">{tr.title}</div>
        <div className="mt-2 text-sm text-slate-600">{tr.subtitle}</div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <label className="block">
          <div className="mb-2 text-sm font-medium text-slate-700">{tr.date}</div>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          />
        </label>

        <div className="block">
          <div className="mb-2 text-sm font-medium text-slate-700">{tr.weekday}</div>
          <div className="w-full rounded-2xl border bg-white px-4 py-3 text-slate-800">
            {selectedDayLabel}
          </div>
        </div>

        <div className="hidden md:block" />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm font-medium text-slate-700">{tr.start}</div>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          >
            {TIME_OPTIONS.map((time) => (
              <option key={`start-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="mb-2 text-sm font-medium text-slate-700">{tr.end}</div>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          >
            {TIME_OPTIONS.map((time) => (
              <option key={`end-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-slate-600">
        {tr.repeatHint}
      </div>

      {localError && (
        <div className="mt-4 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
          {localError}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="mt-4 rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
      >
        {saving ? tr.saving : tr.add}
      </button>
    </div>
  );
}
