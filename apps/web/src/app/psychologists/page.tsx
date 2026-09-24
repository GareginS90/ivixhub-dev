export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";

type Lang = "en" | "ru" | "hy";
type Gender = "MALE" | "FEMALE" | "UNSPECIFIED";

type PublicPsych = {
  psychologistId: number;
  displayName: string;
  languages: string[];
  experienceYears: number;
  bio: string;
  verifiedAt: string;
  gender?: Gender | null;
  age?: number | null;
  avatarUrl?: string | null;
  ratingAvg: number | null;
  reviewsCount: number;
};

type CatalogItem = {
  code: string;
  name: string;
};

const TXT = {
  hy: {
    eyebrow: "IviXHub մասնագետներ",
    title: "Գտիր քեզ համապատասխան հոգեբանին",
    subtitle:
      "Ընտրիր մասնագետին ըստ լեզվի, փորձի, ուղղության և աշխատանքի մեթոդի։",
    filters: "Ընտրության ֆիլտրեր",
    filtersHint:
      "Նեղացրու արդյունքները ըստ քեզ կարևոր չափանիշների։",
    activeFilters: "ակտիվ ֆիլտր",
    results: "Մասնագետներ",
    resultOne: "մասնագետ",
    resultMany: "մասնագետ",
    gender: "Սեռ",
    language: "Լեզու",
    ageFrom: "Տարիքից",
    ageTo: "Տարիք մինչև",
    method: "Մեթոդ",
    specialization: "Մասնագիտացում",
    all: "Ցանկացածը",
    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ",
    reset: "Մաքրել",
    apply: "Կիրառել ֆիլտրերը",
    openProfile: "Դիտել պրոֆիլը",
    book: "Ամրագրել",
    notFound: "Այս ֆիլտրերով մասնագետներ չեն գտնվել։",
    notFoundHint:
      "Փորձիր փոխել կամ մաքրել ընտրված ֆիլտրերը։",
    languages: "Լեզուներ",
    rating: "Գնահատական",
    experience: "Փորձ",
    years: "տարի",
    age: "Տարիք",
    reviews: "կարծիք",
    bioEmpty: "Մասնագետի նկարագրությունը դեռ լրացված չէ։",
    verified: "Վերիֆիկացված",
    error: "Սխալ",
    profile: "Մասնագիտական պրոֆիլ"
  },
  ru: {
    eyebrow: "Специалисты IviXHub",
    title: "Найдите подходящего психолога",
    subtitle:
      "Выберите специалиста по языку, опыту, направлению и методу работы.",
    filters: "Фильтры выбора",
    filtersHint:
      "Уточните результаты по важным для вас критериям.",
    activeFilters: "активных фильтров",
    results: "Специалисты",
    resultOne: "специалист",
    resultMany: "специалистов",
    gender: "Пол",
    language: "Язык",
    ageFrom: "Возраст от",
    ageTo: "Возраст до",
    method: "Метод",
    specialization: "Специализация",
    all: "Любой",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано",
    reset: "Очистить",
    apply: "Применить фильтры",
    openProfile: "Открыть профиль",
    book: "Записаться",
    notFound: "По этим фильтрам специалисты не найдены.",
    notFoundHint:
      "Попробуйте изменить или очистить выбранные фильтры.",
    languages: "Языки",
    rating: "Рейтинг",
    experience: "Опыт",
    years: "лет",
    age: "Возраст",
    reviews: "отзывов",
    bioEmpty: "Описание специалиста пока не заполнено.",
    verified: "Верифицирован",
    error: "Ошибка",
    profile: "Профессиональный профиль"
  },
  en: {
    eyebrow: "IviXHub specialists",
    title: "Find the psychologist who fits you",
    subtitle:
      "Choose a specialist by language, experience, focus area and therapy method.",
    filters: "Selection filters",
    filtersHint:
      "Narrow the results using the criteria that matter to you.",
    activeFilters: "active filters",
    results: "Specialists",
    resultOne: "specialist",
    resultMany: "specialists",
    gender: "Gender",
    language: "Language",
    ageFrom: "Age from",
    ageTo: "Age to",
    method: "Method",
    specialization: "Specialization",
    all: "Any",
    male: "Male",
    female: "Female",
    unspecified: "Not specified",
    reset: "Clear",
    apply: "Apply filters",
    openProfile: "View profile",
    book: "Book session",
    notFound: "No specialists match these filters.",
    notFoundHint:
      "Try changing or clearing the selected filters.",
    languages: "Languages",
    rating: "Rating",
    experience: "Experience",
    years: "years",
    age: "Age",
    reviews: "reviews",
    bioEmpty: "The specialist's description has not been added yet.",
    verified: "Verified",
    error: "Error",
    profile: "Professional profile"
  }
} as const;

const METHOD_FALLBACK: Record<Lang, CatalogItem[]> = {
  ru: [
    { code: "act", name: "ACT" },
    { code: "cbt", name: "КПТ" },
    { code: "dbt", name: "ДПТ" },
    { code: "emdr", name: "EMDR" },
    {
      code: "family_systems",
      name: "Семейная системная терапия"
    },
    { code: "gestalt", name: "Гештальт-терапия" },
    {
      code: "psychodynamic",
      name: "Психодинамическая терапия"
    }
  ],
  en: [
    { code: "act", name: "ACT" },
    { code: "cbt", name: "CBT" },
    { code: "dbt", name: "DBT" },
    { code: "emdr", name: "EMDR" },
    {
      code: "family_systems",
      name: "Family systems therapy"
    },
    { code: "gestalt", name: "Gestalt therapy" },
    {
      code: "psychodynamic",
      name: "Psychodynamic therapy"
    }
  ],
  hy: [
    { code: "act", name: "ACT" },
    { code: "cbt", name: "CBT" },
    { code: "dbt", name: "DBT" },
    { code: "emdr", name: "EMDR" },
    {
      code: "family_systems",
      name: "Ընտանեկան համակարգային թերապիա"
    },
    { code: "gestalt", name: "Գեշտալտ թերապիա" },
    {
      code: "psychodynamic",
      name: "Հոգեդինամիկ թերապիա"
    }
  ]
};

const SPEC_FALLBACK: Record<Lang, CatalogItem[]> = {
  ru: [
    { code: "addiction", name: "Зависимость" },
    { code: "anger", name: "Управление гневом" },
    { code: "anxiety", name: "Тревожность" },
    { code: "depression", name: "Депрессия" },
    { code: "family", name: "Семейные вопросы" },
    { code: "grief", name: "Горе / утрата" },
    { code: "relationships", name: "Отношения" },
    { code: "self_esteem", name: "Самооценка" },
    { code: "stress", name: "Стресс" },
    { code: "trauma", name: "Травма" }
  ],
  en: [
    { code: "addiction", name: "Addiction" },
    { code: "anger", name: "Anger management" },
    { code: "anxiety", name: "Anxiety" },
    { code: "depression", name: "Depression" },
    { code: "family", name: "Family issues" },
    { code: "grief", name: "Grief / Loss" },
    { code: "relationships", name: "Relationships" },
    { code: "self_esteem", name: "Self-esteem" },
    { code: "stress", name: "Stress" },
    { code: "trauma", name: "Trauma" }
  ],
  hy: [
    { code: "addiction", name: "Կախվածություն" },
    { code: "anger", name: "Զայրույթի կառավարում" },
    { code: "anxiety", name: "Տագնապ" },
    { code: "depression", name: "Դեպրեսիա" },
    { code: "family", name: "Ընտանեկան խնդիրներ" },
    { code: "grief", name: "Կորուստ / վիշտ" },
    { code: "relationships", name: "Հարաբերություններ" },
    { code: "self_esteem", name: "Ինքնագնահատական" },
    { code: "stress", name: "Սթրես" },
    { code: "trauma", name: "Տրավմա" }
  ]
};

function shortBio(bio: string, n = 155) {
  const value = (bio || "").trim();

  if (!value) return "";
  if (value.length <= n) return value;

  return `${value.slice(0, n).trim()}…`;
}

function genderLabel(
  value: Gender | null | undefined,
  tr: (typeof TXT)[Lang]
) {
  if (value === "MALE") return tr.male;
  if (value === "FEMALE") return tr.female;

  return tr.unspecified;
}

function languageLabel(value: string) {
  const normalized = value.toUpperCase();

  if (normalized === "HY") return "Հայերեն";
  if (normalized === "RU") return "Русский";
  if (normalized === "EN") return "English";

  return value;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2.7 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.9l-5.56 2.92 1.06-6.2L3 9.23l6.22-.9L12 2.7Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PsychCard({
  psychologist,
  tr
}: {
  psychologist: PublicPsych;
  tr: (typeof TXT)[Lang];
}) {
  const rating =
    psychologist.ratingAvg == null
      ? null
      : psychologist.ratingAvg.toFixed(1);

  const reviews = psychologist.reviewsCount ?? 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[#073f43]/8 bg-white shadow-[0_12px_38px_rgba(7,63,67,0.055)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#12b8c4]/30 hover:shadow-[0_26px_70px_rgba(31,126,168,0.14)]">
      <div className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-gradient-to-br from-[#12b8c4]/0 via-[#3977e8]/0 to-[#7657df]/0 blur-3xl transition-all duration-500 group-hover:from-[#12b8c4]/14 group-hover:via-[#3977e8]/9 group-hover:to-[#7657df]/12" />

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[25px] border border-[#12b8c4]/15 bg-gradient-to-br from-[#e9f9f7] via-[#eef8fb] to-[#f1efff] shadow-[0_10px_25px_rgba(7,63,67,0.07)] transition-all duration-300 group-hover:scale-[1.025] group-hover:shadow-[0_14px_32px_rgba(57,119,232,0.13)]">
            {psychologist.avatarUrl ? (
              <img
                src={psychologist.avatarUrl}
                alt={
                  psychologist.displayName ||
                  `Psychologist #${psychologist.psychologistId}`
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#0b9694]">
                <UserIcon />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#078b7b]/8 bg-[#e8f8f5] px-2.5 py-1 text-[11px] font-extrabold text-[#078b7b]">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#078b7b] text-white">
                <CheckIcon />
              </span>
              {tr.verified}
            </span>

            <h2 className="mt-3 truncate text-[21px] font-black tracking-[-0.03em] text-[#073f43]">
              {psychologist.displayName ||
                `Psychologist #${psychologist.psychologistId}`}
            </h2>

            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.075em] text-[#8a9a9b]">
              {tr.profile}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#073f43]/8 bg-[#f7fbfb] px-3 py-1.5 text-xs font-bold text-[#506c6e]">
            {tr.experience}: {psychologist.experienceYears} {tr.years}
          </span>

          {typeof psychologist.age === "number" && (
            <span className="rounded-full border border-[#073f43]/8 bg-[#f7fbfb] px-3 py-1.5 text-xs font-bold text-[#506c6e]">
              {tr.age}: {psychologist.age}
            </span>
          )}

          <span className="rounded-full border border-[#073f43]/8 bg-[#f7fbfb] px-3 py-1.5 text-xs font-bold text-[#506c6e]">
            {genderLabel(psychologist.gender, tr)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#073f43]/7 pt-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#8b9a9b]">
              {tr.rating}
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[#f2ad32]">
                <StarIcon />
              </span>

              <span className="font-black text-[#173f42]">
                {rating ?? "—"}
              </span>

              {reviews > 0 && (
                <span className="truncate text-xs font-medium text-[#849596]">
                  ({reviews} {tr.reviews})
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#8b9a9b]">
              {tr.languages}
            </div>

            <div className="mt-1.5 truncate text-sm font-bold text-[#3f6062]">
              {psychologist.languages?.length
                ? psychologist.languages
                    .map(languageLabel)
                    .join(" · ")
                : "—"}
            </div>
          </div>
        </div>

        <p className="mt-5 min-h-[66px] text-sm leading-6 text-[#607778]">
          {shortBio(psychologist.bio) || tr.bioEmpty}
        </p>
      </div>

      <div className="relative mt-auto grid grid-cols-2 gap-2.5 border-t border-[#073f43]/7 bg-gradient-to-r from-[#fbfdfd] to-[#f8fbfd] p-4 sm:p-5">
        <Link
          href={`/psychologists/${psychologist.psychologistId}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#073f43]/11 bg-white px-4 text-center text-sm font-extrabold text-[#31595b] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/35 hover:bg-[#effaf8] hover:text-[#078b7b] hover:shadow-md"
        >
          {tr.openProfile}
        </Link>

        <Link
          href={`/psychologists/${psychologist.psychologistId}/book`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-4 text-center text-sm font-extrabold text-white shadow-[0_9px_24px_rgba(18,159,175,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(57,119,232,0.27)]"
        >
          {tr.book}
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

async function loadCatalogOptions(langUi: Lang) {
  try {
    const [methodsRes, specsRes] = await Promise.all([
      fetch(
        `http://localhost:3000/api/catalog/methods?lang=${langUi}`,
        { cache: "no-store" }
      ),
      fetch(
        `http://localhost:3000/api/catalog/specializations?lang=${langUi}`,
        { cache: "no-store" }
      )
    ]);

    const methodsJson = await methodsRes.json().catch(() => []);
    const specsJson = await specsRes.json().catch(() => []);

    const methods = Array.isArray(methodsJson) ? methodsJson : [];
    const specs = Array.isArray(specsJson) ? specsJson : [];

    const safeMethods = methods.filter(
      (item): item is CatalogItem =>
        Boolean(
          item &&
            typeof item === "object" &&
            "code" in item &&
            "name" in item &&
            typeof (item as { code: unknown }).code === "string" &&
            typeof (item as { name: unknown }).name === "string"
        )
    );

    const safeSpecs = specs.filter(
      (item): item is CatalogItem =>
        Boolean(
          item &&
            typeof item === "object" &&
            "code" in item &&
            "name" in item &&
            typeof (item as { code: unknown }).code === "string" &&
            typeof (item as { name: unknown }).name === "string"
        )
    );

    return {
      methods:
        safeMethods.length > 0
          ? safeMethods
          : METHOD_FALLBACK[langUi],
      specs:
        safeSpecs.length > 0
          ? safeSpecs
          : SPEC_FALLBACK[langUi]
    };
  } catch {
    return {
      methods: METHOD_FALLBACK[langUi],
      specs: SPEC_FALLBACK[langUi]
    };
  }
}

export default async function PsychologistsCatalog({
  searchParams
}: {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
}) {
  const langUi =
    ((await cookies()).get("ivixhub_lang")?.value as Lang) || "ru";

  const tr = TXT[langUi];
  const sp = await searchParams;

  const lang = typeof sp.lang === "string" ? sp.lang : "";
  const gender =
    typeof sp.gender === "string" ? sp.gender : "";
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const method =
    typeof sp.method === "string" ? sp.method : "";
  const ageFrom =
    typeof sp.ageFrom === "string" ? sp.ageFrom : "";
  const ageTo =
    typeof sp.ageTo === "string" ? sp.ageTo : "";

  const query = new URLSearchParams();

  if (lang) query.set("lang", lang);
  if (gender) query.set("gender", gender);
  if (tag) query.set("tag", tag);
  if (method) query.set("method", method);
  if (ageFrom) query.set("ageFrom", ageFrom);
  if (ageTo) query.set("ageTo", ageTo);

  const [catalogOptions, response] = await Promise.all([
    loadCatalogOptions(langUi),
    fetch(
      `http://localhost:3000/api/psychologists/list?${query.toString()}`,
      { cache: "no-store" }
    ).catch(() => null)
  ]);

  let items: PublicPsych[] = [];
  let error: string | null = null;

  if (!response) {
    error = "Cannot reach /api/psychologists/list";
  } else if (!response.ok) {
    const payload = await response.json().catch(() => null);
    error =
      payload?.message || `Fetch failed (${response.status})`;
  } else {
    const data = await response.json();
    items = Array.isArray(data) ? (data as PublicPsych[]) : [];
  }

  const ageOptions = Array.from(
    { length: 53 },
    (_, index) => String(index + 18)
  );

  const selectClass =
    "h-14 w-full appearance-none rounded-[18px] border border-[#073f43]/10 bg-white px-4 pr-11 text-[14px] font-semibold text-[#36595b] shadow-[0_4px_14px_rgba(7,63,67,0.025)] outline-none transition-all duration-200 hover:border-[#12b8c4]/35 hover:shadow-[0_7px_18px_rgba(18,184,196,0.06)] focus:border-[#12b8c4]/55 focus:ring-4 focus:ring-[#12b8c4]/10";

  const activeFilterCount = [
    lang,
    gender,
    tag,
    method,
    ageFrom,
    ageTo
  ].filter(Boolean).length;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[620px] bg-[radial-gradient(circle_at_4%_12%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_93%_10%,rgba(118,87,223,0.10),transparent_29%),radial-gradient(circle_at_55%_42%,rgba(57,119,232,0.045),transparent_34%)]" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <header className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#12b8c4]/18 bg-white/80 px-4 py-2 text-xs font-extrabold tracking-[0.07em] text-[#078b7b] shadow-sm backdrop-blur">
            {tr.eyebrow}
          </span>

          <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-[#073f43] sm:text-4xl lg:text-[46px] lg:leading-[1.08]">
            {tr.title}
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#647879] sm:text-base">
            {tr.subtitle}
          </p>
        </header>

        <section className="relative mt-9 overflow-hidden rounded-[32px] border border-white/80 bg-white/88 shadow-[0_24px_70px_rgba(7,63,67,0.085)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(18,184,196,0.075),transparent_30%),radial-gradient(circle_at_100%_0%,rgba(118,87,223,0.065),transparent_28%)]" />

          <div className="relative flex flex-col gap-4 border-b border-[#073f43]/7 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#e4f9f6] via-[#eaf8fb] to-[#efefff] text-[#078b7b] shadow-sm">
                <FilterIcon />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                    {tr.filters}
                  </h2>

                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-[#e8f8f5] px-2.5 py-1 text-[11px] font-extrabold text-[#078b7b]">
                      {activeFilterCount} {tr.activeFilters}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-sm leading-6 text-[#7a8d8e]">
                  {tr.filtersHint}
                </p>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Link
                href="/psychologists"
                className="inline-flex min-h-10 items-center justify-center self-start rounded-full border border-[#073f43]/9 bg-white px-4 text-xs font-extrabold text-[#078b7b] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-[#effaf8]"
              >
                {tr.reset}
              </Link>
            )}
          </div>

          <form
            method="GET"
            className="relative p-5 sm:p-7"
          >
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.075em] text-[#718687]">
                  {tr.gender}
                </span>

                <div className="relative">
                  <select
                    name="gender"
                    defaultValue={gender}
                    className={selectClass}
                  >
                    <option value="">{tr.all}</option>
                    <option value="MALE">{tr.male}</option>
                    <option value="FEMALE">{tr.female}</option>
                    <option value="UNSPECIFIED">
                      {tr.unspecified}
                    </option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8587]">
                    ↓
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.075em] text-[#718687]">
                  {tr.language}
                </span>

                <div className="relative">
                  <select
                    name="lang"
                    defaultValue={lang}
                    className={selectClass}
                  >
                    <option value="">{tr.all}</option>
                    <option value="HY">Հայերեն</option>
                    <option value="RU">Русский</option>
                    <option value="EN">English</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8587]">
                    ↓
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.075em] text-[#718687]">
                  {tr.specialization}
                </span>

                <div className="relative">
                  <select
                    name="tag"
                    defaultValue={tag}
                    className={selectClass}
                  >
                    <option value="">{tr.all}</option>

                    {catalogOptions.specs.map((item) => (
                      <option
                        key={item.code}
                        value={item.code}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8587]">
                    ↓
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.075em] text-[#718687]">
                  {tr.method}
                </span>

                <div className="relative">
                  <select
                    name="method"
                    defaultValue={method}
                    className={selectClass}
                  >
                    <option value="">{tr.all}</option>

                    {catalogOptions.methods.map((item) => (
                      <option
                        key={item.code}
                        value={item.code}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8587]">
                    ↓
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.075em] text-[#718687]">
                  {tr.ageFrom}
                </span>

                <div className="relative">
                  <select
                    name="ageFrom"
                    defaultValue={ageFrom}
                    className={selectClass}
                  >
                    <option value="">{tr.all}</option>

                    {ageOptions.map((age) => (
                      <option
                        key={`from-${age}`}
                        value={age}
                      >
                        {age}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8587]">
                    ↓
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.075em] text-[#718687]">
                  {tr.ageTo}
                </span>

                <div className="relative">
                  <select
                    name="ageTo"
                    defaultValue={ageTo}
                    className={selectClass}
                  >
                    <option value="">{tr.all}</option>

                    {ageOptions.map((age) => (
                      <option
                        key={`to-${age}`}
                        value={age}
                      >
                        {age}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8587]">
                    ↓
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-[#073f43]/6 pt-5 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-8 text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(18,159,175,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_36px_rgba(57,119,232,0.26)]"
              >
                {tr.apply}
              </button>

              <Link
                href="/psychologists"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#073f43]/10 bg-white px-6 text-sm font-extrabold text-[#506c6e] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7657df]/22 hover:bg-[#f5f3ff] hover:text-[#5f5dcc]"
              >
                {tr.reset}
              </Link>
            </div>
          </form>
        </section>

        {error && (
          <div className="mt-7 rounded-[24px] border border-red-200 bg-red-50/90 p-5 text-sm text-red-800">
            <strong>{tr.error}:</strong> {error}
          </div>
        )}

        {!error && (
          <section className="mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.035em] text-[#073f43] sm:text-[28px]">
                  {tr.results}
                </h2>

                <p className="mt-1.5 text-sm font-medium text-[#7a8d8e]">
                  {items.length}{" "}
                  {items.length === 1
                    ? tr.resultOne
                    : tr.resultMany}
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="rounded-[30px] border border-[#073f43]/8 bg-white px-6 py-16 text-center shadow-[0_14px_45px_rgba(7,63,67,0.055)]">
                <div className="mx-auto flex size-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#e7f8f5] via-[#edf7fb] to-[#efefff] text-[#078b7b]">
                  <UserIcon />
                </div>

                <h3 className="mt-5 text-lg font-black text-[#173f42]">
                  {tr.notFound}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b8e8f]">
                  {tr.notFoundHint}
                </p>

                <Link
                  href="/psychologists"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#073f43]/10 bg-white px-6 text-sm font-extrabold text-[#078b7b] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-[#effaf8]"
                >
                  {tr.reset}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((psychologist) => (
                  <PsychCard
                    key={psychologist.psychologistId}
                    psychologist={psychologist}
                    tr={tr}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
