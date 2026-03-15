export const dynamic = "force-dynamic";
import Link from "next/link";
import { cookies } from "next/headers";
import en from "@/i18n/en.json";
import ru from "@/i18n/ru.json";
import hy from "@/i18n/hy.json";
import { PublicHeader } from "@/components/PublicHeader";

type Lang = "en" | "ru" | "hy";
function t(lang: Lang) {
  return lang === "ru" ? ru : lang === "hy" ? hy : en;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 text-xs text-gray-700 backdrop-blur">
      {children}
    </span>
  );
}

function Card({
  title,
  desc,
  tag,
}: {
  title: string;
  desc: string;
  tag?: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-1 text-sm text-gray-600">{desc}</div>
        </div>
        {tag && (
          <span className="shrink-0 rounded-full bg-black text-white px-3 py-1 text-xs">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

function FeaturedCard({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-b from-slate-100 to-white border grid place-items-center font-semibold">
          PSY
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{name}</div>
          <div className="text-xs text-gray-600 truncate">{meta}</div>
        </div>
        <span className="ml-auto rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs border border-amber-200">
          ⭐ Featured
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600">Rating</span>
        <span className="font-medium">4.9 • 120 reviews</span>
      </div>

      <Link
        href="/psychologists"
        className="mt-4 inline-flex w-full justify-center rounded-2xl bg-black text-white py-2 hover:opacity-90"
      >
        View profile
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const lang = ((await cookies()).get("ivixhub_lang")?.value as Lang) || "ru";
  const tr = t(lang);

  return (
    <div className="min-h-screen bg-[#fbfcff]">
      <PublicHeader />

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="relative overflow-hidden rounded-[2.25rem] border bg-gradient-to-b from-slate-50 to-white p-8 md:p-12 shadow-sm">
          {/* soft blobs */}
          <div className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-indigo-200/45 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-20 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>🇦🇲 Armenia</Badge>
                <Badge>🌍 Diaspora-friendly</Badge>
                <Badge>🔒 Confidential</Badge>
              </div>

              <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight">
                {tr.hero_title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-gray-600 max-w-xl">
                {tr.hero_subtitle}
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex justify-center rounded-2xl bg-black text-white px-6 py-3 hover:opacity-90"
                >
                  {tr.cta_quiz}
                </Link>
                <Link
                  href="/psychologists"
                  className="inline-flex justify-center rounded-2xl border bg-white px-6 py-3 hover:bg-gray-50"
                >
                  {tr.cta_catalog}
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-2xl border bg-white/80 p-3">
                  <div className="text-xs text-gray-500">Avg match time</div>
                  <div className="mt-1 font-semibold">~1 min</div>
                </div>
                <div className="rounded-2xl border bg-white/80 p-3">
                  <div className="text-xs text-gray-500">Formats</div>
                  <div className="mt-1 font-semibold">Video / Chat</div>
                </div>
                <div className="rounded-2xl border bg-white/80 p-3">
                  <div className="text-xs text-gray-500">Languages</div>
                  <div className="mt-1 font-semibold">HY / RU / EN</div>
                </div>
                <div className="rounded-2xl border bg-white/80 p-3">
                  <div className="text-xs text-gray-500">Payments</div>
                  <div className="mt-1 font-semibold">Card / IDram / TelCell</div>
                </div>
              </div>
            </div>

            {/* Illustration (inline SVG, calm) */}
            <div className="relative">
              <div className="rounded-[2rem] border bg-white/70 p-6 shadow-sm">
                <div className="text-sm font-semibold">Your path</div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-xs text-gray-500">Step 1</div>
                    <div className="font-medium">Quick quiz</div>
                  </div>
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-xs text-gray-500">Step 2</div>
                    <div className="font-medium">Recommended specialization</div>
                  </div>
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-xs text-gray-500">Step 3</div>
                    <div className="font-medium">Book safely (escrow)</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border p-4">
                  <div className="text-xs text-gray-500">Preview</div>
                  <div className="mt-2 text-sm">
                    “Based on your answers, we recommend: <b>Anxiety specialist</b>”
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs bg-white">Language: RU</span>
                    <span className="rounded-full border px-3 py-1 text-xs bg-white">Format: Video</span>
                  </div>
                </div>
              </div>

              <svg
                className="pointer-events-none absolute -bottom-8 -right-8 opacity-70"
                width="220"
                height="220"
                viewBox="0 0 220 220"
                fill="none"
              >
                <circle cx="110" cy="110" r="90" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="110" cy="110" r="60" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="110" cy="110" r="30" stroke="#e5e7eb" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Trust block */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card title={tr.trust_1} desc="Onboarding + moderation (documents & checks)." />
          <Card title={tr.trust_2} desc="Private sessions, safe storage practices." />
          <Card title={tr.trust_3} desc="Multiple methods with feature flags." />
          <Card title={tr.trust_4} desc="Hold funds until session is completed." />
        </section>

        {/* Featured + Ad slots */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Featured on IviXHub</h2>
              <p className="mt-1 text-sm text-gray-600">
                Платные места (прозрачно помечены). В MVP+ подключим из backend и добавим правила отбора.
              </p>
            </div>
            <Link href="/psychologists" className="hidden sm:inline-flex rounded-xl border px-4 py-2 hover:bg-gray-50">
              View all
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <FeaturedCard name="Featured Psychologist #1" meta="CBT • Anxiety • RU/EN" />
            <FeaturedCard name="Featured Psychologist #2" meta="Relationships • Family • HY/RU" />
            <FeaturedCard name="Featured Psychologist #3" meta="Stress • Burnout • EN" />
          </div>

          <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-semibold">Ad / Partner space</div>
                <div className="text-sm text-gray-600 mt-1">
                  Рекламный блок (в MVP+ — строго с правилами: без токсичных тем, только уместные партнёры).
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/support" className="rounded-xl border px-4 py-2 hover:bg-gray-50">Policy</Link>
                <Link href="/support" className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-90">Become a partner</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz teaser */}
        <section className="mt-12">
          <div className="rounded-[2rem] border bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold">Не знаешь с чего начать?</h2>
                <p className="mt-2 text-gray-600">
                  Пройди мини-тест (5 вопросов). Мы предложим нужную специализацию и подберём психологов по языку сессии.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link href="/quiz" className="inline-flex justify-center rounded-2xl bg-black text-white px-6 py-3 hover:opacity-90">
                    Start quiz
                  </Link>
                  <Link href="/psychologists" className="inline-flex justify-center rounded-2xl border bg-white px-6 py-3 hover:bg-gray-50">
                    Browse specialists
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border bg-white p-5">
                <div className="text-sm font-semibold">Quiz preview</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-2xl border px-3 py-2">Language: HY / RU / EN</div>
                  <div className="rounded-2xl border px-3 py-2">Problem: anxiety / stress / relationships</div>
                  <div className="rounded-2xl border px-3 py-2">Format: video / chat</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 pb-10 text-sm text-gray-600">
          <div className="border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>© {new Date().getFullYear()} IviXHub</div>
            <div className="flex gap-4">
              <Link href="/legal/terms" className="hover:text-black">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-black">Privacy</Link>
              <Link href="/support" className="hover:text-black">Support</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
