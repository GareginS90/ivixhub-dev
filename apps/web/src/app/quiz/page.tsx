"use client";

import { useRouter } from "next/navigation";
import { getUiLangFromCookie, tClient } from "@/i18n/client";
import { useState } from "react";

type Lang = "HY" | "RU" | "EN";
type Issue = "ANXIETY" | "DEPRESSION" | "RELATIONSHIPS" | "STRESS" | "SELF_ESTEEM" | "TRAUMA";
type Duration = "DAYS" | "WEEKS" | "MONTHS" | "YEAR_PLUS";
type Format = "VIDEO" | "CHAT" | "ANY";

export default function QuizPage() {
  const uiLang = getUiLangFromCookie();
  const tr = tClient(uiLang);

  const router = useRouter();

  const [sessionLang, setSessionLang] = useState<Lang>("HY");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [format, setFormat] = useState<Format>("ANY");

  const can = issue && duration;

  function submit() {
    const sp = new URLSearchParams();
    sp.set("lang", sessionLang);
    sp.set("issue", issue!);
    sp.set("duration", duration!);
    sp.set("format", format);
    router.push(`/quiz/result?${sp.toString()}`);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">{tr.quiz_title}</h1>
        <p className="text-sm text-gray-600 mt-1">{tr.quiz_subtitle}</p>

        <div className="mt-6 rounded-2xl border p-5 bg-white">
          <label className="text-sm font-medium">Язык сессии</label>
          <div className="mt-2 flex gap-2">
            {(["HY","RU","EN"] as Lang[]).map((v) => (
              <button key={v}
                onClick={() => setSessionLang(v)}
                className={`rounded-xl border px-3 py-2 text-sm ${sessionLang===v ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                {v}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Что беспокоит больше всего?</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {([
                ["ANXIETY","Тревога"],
                ["DEPRESSION","Пониженное настроение"],
                ["RELATIONSHIPS","Отношения"],
                ["STRESS","Стресс/выгорание"],
                ["SELF_ESTEEM","Самооценка"],
                ["TRAUMA","Травма/тяжёлый опыт"]
              ] as [Issue,string][]).map(([k,label]) => (
                <button key={k}
                  onClick={() => setIssue(k)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm ${issue===k ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Как давно это длится?</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {([
                ["DAYS","Несколько дней"],
                ["WEEKS","Несколько недель"],
                ["MONTHS","Несколько месяцев"],
                ["YEAR_PLUS","Больше года"]
              ] as [Duration,string][]).map(([k,label]) => (
                <button key={k}
                  onClick={() => setDuration(k)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm ${duration===k ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Формат</label>
            <div className="mt-2 flex gap-2">
              {([
                ["ANY","Любой"],
                ["VIDEO","Видео"],
                ["CHAT","Чат"]
              ] as [Format,string][]).map(([k,label]) => (
                <button key={k}
                  onClick={() => setFormat(k)}
                  className={`rounded-xl border px-3 py-2 text-sm ${format===k ? "bg-black text-white" : "hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!can}
            onClick={submit}
            className="mt-6 w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
          >
            {tr.show_result}
          </button>
        </div>
      </div>
    </main>
  );
}
