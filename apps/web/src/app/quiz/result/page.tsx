export const dynamic = "force-dynamic";
import Link from "next/link";
import { cookies } from "next/headers";
import en from "@/i18n/en.json";
import ru from "@/i18n/ru.json";
import hy from "@/i18n/hy.json";

type Lang = "en" | "ru" | "hy";
function t(lang: Lang) {
  return lang === "hy" ? (hy as any) : lang === "en" ? (en as any) : (ru as any);
}

function recommend(issue?: string) {
  switch (issue) {
    case "ANXIETY": return { title: "Тревожные расстройства", specialization: "anxiety" };
    case "DEPRESSION": return { title: "Депрессивные состояния", specialization: "depression" };
    case "RELATIONSHIPS": return { title: "Отношения и пары", specialization: "relationships" };
    case "STRESS": return { title: "Стресс и выгорание", specialization: "stress" };
    case "SELF_ESTEEM": return { title: "Самооценка", specialization: "self_esteem" };
    case "TRAUMA": return { title: "Травма и ПТСР", specialization: "trauma" };
    default: return { title: "Общая консультация", specialization: "" };
  }
}

export default async function QuizResultPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = ((await cookies()).get("ivixhub_lang")?.value as Lang) || "ru";
  const tr = t(lang);

  const sp = await searchParams;
  const sessionLang = (sp.lang as string) || "HY";
  const issue = sp.issue as string | undefined;

  const rec = recommend(issue);

  return (
    <main className="min-h-screen p-6 bg-[#fbfcff]">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">{tr.result_title}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {tr.filter_language}: <b>{sessionLang}</b>
        </p>

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{rec.title}</h2>
          <div className="mt-2 text-xs text-gray-600">Code: {rec.specialization || "—"}</div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/psychologists?lang=${encodeURIComponent(sessionLang)}&tag=${encodeURIComponent(rec.specialization)}&method=`}
              className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90"
            >
              {tr.show_psychologists}
            </Link>
            <Link
              href="/quiz"
              className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
            >
              {tr.retry_quiz}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
