export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";

type Profile = {
  psychologistId: number;
  experienceYears: number;
  bio: string;
  languages: string[];
  methods: string[];
  specializations: string[];
  verifiedAt: string;
};

function list(x?: string[]) {
  return x && x.length ? x.join(", ") : "—";
}

export default async function PsychologistProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const r = await fetch(
    `http://localhost:3000/api/psychologists/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  ).catch(() => null);

  if (!r) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl">Cannot reach profile API.</div>
      </main>
    );
  }

  if (!r.ok) {
    const j = await r.json().catch(() => null);
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-red-50 p-6">
          <b>Error:</b> {j?.message || `Fetch failed (${r.status})`}
        </div>
      </main>
    );
  }

  const p = (await r.json()) as Profile;

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/psychologists"
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Назад к каталогу
        </Link>

        <div className="mt-4 rounded-3xl border bg-white p-8 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <h1 className="text-3xl font-semibold">
                Психолог #{p.psychologistId}
              </h1>

              <div className="mt-2 text-sm text-gray-600">
                Опыт: <b>{p.experienceYears}</b> лет
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 text-emerald-800 px-4 py-1 text-xs border border-emerald-200">
              VERIFIED
            </span>

          </div>

          {p.bio && (
            <div className="mt-6 text-sm text-gray-800 whitespace-pre-line">
              {p.bio}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">
                Языки
              </div>
              <div className="mt-1 font-medium">
                {list(p.languages)}
              </div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">
                Методы
              </div>
              <div className="mt-1 font-medium">
                {list(p.methods)}
              </div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-xs text-gray-500">
                Специализации
              </div>
              <div className="mt-1 font-medium">
                {list(p.specializations)}
              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Link
              href={`/psychologists/${p.psychologistId}/book`}
              className="inline-flex justify-center rounded-2xl bg-black text-white px-6 py-3 hover:opacity-90"
            >
              Забронировать сессию
            </Link>

            <Link
              href="/quiz"
              className="inline-flex justify-center rounded-2xl border px-6 py-3 hover:bg-gray-50"
            >
              Пройти тест
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}
