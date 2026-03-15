export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import en from "@/i18n/en.json";
import ru from "@/i18n/ru.json";
import hy from "@/i18n/hy.json";
import Link from "next/link";

type Lang = "en" | "ru" | "hy";
function t(lang: Lang) {
  return lang === "hy" ? (hy as any) : lang === "en" ? (en as any) : (ru as any);
}

type PublicPsych = {
  psychologistId: number;
  displayName: string;
  languages: string[];
  experienceYears: number;
  bio: string;
  verifiedAt: string;
  ratingAvg: number | null;
  reviewsCount: number;
};

function shortBio(bio: string, n = 180) {
  const x = (bio || "").trim();
  if (!x) return "";
  if (x.length <= n) return x;
  return x.slice(0, n).trim() + "…";
}

function list(x?: string[]) {
  return x && x.length ? x.join(", ") : "—";
}

function PsychCard({ p }: { p: PublicPsych }) {
  const rating = p.ratingAvg == null ? "—" : p.ratingAvg.toFixed(1);
  const reviews = p.reviewsCount ?? 0;

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold truncate">
            {p.displayName || `Психолог #${p.psychologistId}`}
          </div>

          <div className="mt-1 text-sm text-gray-600">
            Опыт: <b>{p.experienceYears}</b> лет
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 text-xs border border-emerald-200">
          VERIFIED
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <span className="text-gray-500">Языки:</span>{" "}
          <span className="font-medium">{list(p.languages)}</span>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <span className="text-gray-500">Рейтинг:</span>{" "}
          <span className="font-medium">
            {rating} {reviews > 0 ? `• ${reviews} отзывов` : ""}
          </span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 min-h-[72px]">
        {shortBio(p.bio) || "Описание пока не заполнено."}
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/psychologists/${p.psychologistId}`}
          className="flex-1 inline-flex justify-center rounded-2xl bg-black text-white py-2.5 hover:opacity-90"
        >
          Открыть профиль
        </Link>

        <Link
          href={`/psychologists/${p.psychologistId}/book`}
          className="inline-flex justify-center rounded-2xl border px-4 py-2.5 hover:bg-gray-50"
        >
          Бронь
        </Link>
      </div>
    </div>
  );
}

export default async function PsychologistsCatalog({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const langUi = ((await cookies()).get("ivixhub_lang")?.value as Lang) || "ru";
  const tr = t(langUi);

  const sp = await searchParams;
  const lang = (sp.lang as string | undefined) || "";
  const tag = (sp.tag as string | undefined) || "";
  const method = (sp.method as string | undefined) || "";

  const q = new URLSearchParams();
  if (lang) q.set("lang", lang);
  if (tag) q.set("tag", tag);
  if (method) q.set("method", method);

  const r = await fetch(`http://localhost:3000/api/psychologists/list?${q.toString()}`, {
    cache: "no-store"
  }).catch(() => null);

  let items: PublicPsych[] = [];
  let error: string | null = null;

  if (!r) {
    error = "Cannot reach /api/psychologists/list";
  } else if (!r.ok) {
    const j = await r.json().catch(() => null);
    error = j?.message || `Fetch failed (${r.status})`;
  } else {
    const data = await r.json();
    items = Array.isArray(data) ? (data as PublicPsych[]) : [];
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-semibold">Каталог психологов</h1>
          <p className="mt-2 text-sm text-gray-600">
            Выберите подходящего специалиста и перейдите к бронированию сессии.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-3xl border bg-red-50 p-5 text-sm text-red-800">
            <b>Error:</b> {error}
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Психологи не найдены.
          </div>
        )}

        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((p) => (
              <PsychCard key={p.psychologistId} p={p} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
