export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";

type Lang = "hy" | "ru" | "en";

type ReviewItem = {
  id: number;
  rating: number;
  comment: string | null;
  authorDisplayName: string;
  createdAt: string;
  replyComment?: string | null;
  repliedAt?: string | null;
};

type Profile = {
  psychologistId: number;
  displayName?: string | null;
  experienceYears: number;
  bio: string;
  languages: string[];
  methods: string[];
  specializations: string[];
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "UNSPECIFIED" | null;
  avatarUrl?: string | null;
  verifiedAt: string;
  ratingAvg?: number | null;
  reviewsCount?: number;
  recentReviews?: ReviewItem[];
};

const TXT = {
  hy: {
    back: "Վերադառնալ մասնագետներին",
    verified: "Վերիֆիկացված մասնագետ",
    profile: "Մասնագիտական պրոֆիլ",
    experience: "Փորձ",
    years: "տարի",
    age: "Տարիք",
    gender: "Սեռ",
    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ",
    rating: "Գնահատական",
    reviews: "Կարծիքներ",
    review: "կարծիք",
    languages: "Լեզուներ",
    methods: "Աշխատանքի մեթոդներ",
    specializations: "Մասնագիտացումներ",
    about: "Մասնագետի մասին",
    bioEmpty: "Մասնագետի նկարագրությունը դեռ լրացված չէ։",
    book: "Ամրագրել հանդիպում",
    quiz: "Անցնել համապատասխանության թեստը",
    clientReviews: "Հաճախորդների կարծիքներ",
    noReviews: "Այս մասնագետի համար դեռ կարծիքներ չկան։",
    noComment: "Առանց մեկնաբանության։",
    reply: "Մասնագետի պատասխան",
    verifiedSince: "Վերիֆիկացված է",
    error: "Սխալ",
    unavailable: "Չհաջողվեց բեռնել մասնագետի պրոֆիլը։"
  },
  ru: {
    back: "Вернуться к специалистам",
    verified: "Верифицированный специалист",
    profile: "Профессиональный профиль",
    experience: "Опыт",
    years: "лет",
    age: "Возраст",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано",
    rating: "Рейтинг",
    reviews: "Отзывы",
    review: "отзывов",
    languages: "Языки",
    methods: "Методы работы",
    specializations: "Специализации",
    about: "О специалисте",
    bioEmpty: "Описание специалиста пока не заполнено.",
    book: "Записаться на сессию",
    quiz: "Пройти тест совместимости",
    clientReviews: "Отзывы клиентов",
    noReviews: "У этого специалиста пока нет отзывов.",
    noComment: "Без комментария.",
    reply: "Ответ специалиста",
    verifiedSince: "Верифицирован",
    error: "Ошибка",
    unavailable: "Не удалось загрузить профиль специалиста."
  },
  en: {
    back: "Back to specialists",
    verified: "Verified specialist",
    profile: "Professional profile",
    experience: "Experience",
    years: "years",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    unspecified: "Not specified",
    rating: "Rating",
    reviews: "Reviews",
    review: "reviews",
    languages: "Languages",
    methods: "Therapy methods",
    specializations: "Specializations",
    about: "About the specialist",
    bioEmpty: "The specialist's description has not been added yet.",
    book: "Book a session",
    quiz: "Take the matching quiz",
    clientReviews: "Client reviews",
    noReviews: "This specialist does not have reviews yet.",
    noComment: "No comment.",
    reply: "Specialist reply",
    verifiedSince: "Verified",
    error: "Error",
    unavailable: "Unable to load the specialist profile."
  }
} as const;

const METHOD_LABELS: Record<string, Record<Lang, string>> = {
  act: {
    hy: "ACT",
    ru: "ACT",
    en: "ACT"
  },
  cbt: {
    hy: "Կոգնիտիվ-վարքային թերապիա (CBT)",
    ru: "Когнитивно-поведенческая терапия (КПТ)",
    en: "Cognitive behavioral therapy (CBT)"
  },
  dbt: {
    hy: "Դիալեկտիկ վարքային թերապիա (DBT)",
    ru: "Диалектическая поведенческая терапия (ДПТ)",
    en: "Dialectical behavior therapy (DBT)"
  },
  emdr: {
    hy: "EMDR",
    ru: "EMDR",
    en: "EMDR"
  },
  family_systems: {
    hy: "Ընտանեկան համակարգային թերապիա",
    ru: "Семейная системная терапия",
    en: "Family systems therapy"
  },
  gestalt: {
    hy: "Գեշտալտ թերապիա",
    ru: "Гештальт-терапия",
    en: "Gestalt therapy"
  },
  psychodynamic: {
    hy: "Հոգեդինամիկ թերապիա",
    ru: "Психодинамическая терапия",
    en: "Psychodynamic therapy"
  }
};

const SPECIALIZATION_LABELS: Record<
  string,
  Record<Lang, string>
> = {
  addiction: {
    hy: "Կախվածություն",
    ru: "Зависимость",
    en: "Addiction"
  },
  anger: {
    hy: "Զայրույթի կառավարում",
    ru: "Управление гневом",
    en: "Anger management"
  },
  anxiety: {
    hy: "Տագնապ",
    ru: "Тревожность",
    en: "Anxiety"
  },
  depression: {
    hy: "Դեպրեսիա",
    ru: "Депрессия",
    en: "Depression"
  },
  family: {
    hy: "Ընտանեկան խնդիրներ",
    ru: "Семейные вопросы",
    en: "Family issues"
  },
  grief: {
    hy: "Կորուստ և վիշտ",
    ru: "Горе и утрата",
    en: "Grief and loss"
  },
  relationships: {
    hy: "Հարաբերություններ",
    ru: "Отношения",
    en: "Relationships"
  },
  self_esteem: {
    hy: "Ինքնագնահատական",
    ru: "Самооценка",
    en: "Self-esteem"
  },
  stress: {
    hy: "Սթրես",
    ru: "Стресс",
    en: "Stress"
  },
  trauma: {
    hy: "Տրավմա",
    ru: "Травма",
    en: "Trauma"
  }
};

function languageLabel(value: string) {
  const code = value.toUpperCase();

  if (code === "HY") return "Հայերեն";
  if (code === "RU") return "Русский";
  if (code === "EN") return "English";

  return value;
}

function genderLabel(
  value: Profile["gender"],
  lang: Lang
) {
  const tr = TXT[lang];

  if (value === "MALE") return tr.male;
  if (value === "FEMALE") return tr.female;

  return tr.unspecified;
}

function methodLabel(code: string, lang: Lang) {
  return METHOD_LABELS[code]?.[lang] ?? code.replaceAll("_", " ");
}

function specializationLabel(code: string, lang: Lang) {
  return (
    SPECIALIZATION_LABELS[code]?.[lang] ??
    code.replaceAll("_", " ")
  );
}

function formatDate(value: string, lang: Lang) {
  const locale =
    lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

function formatDateTime(value: string, lang: Lang) {
  const locale =
    lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
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

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="38"
      height="38"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2.7 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.9l-5.56 2.92 1.06-6.2L3 9.23l6.22-.9L12 2.7Z" />
    </svg>
  );
}

function InfoCard({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-[#073f43]/8 bg-[#f8fbfb] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:bg-white hover:shadow-[0_12px_30px_rgba(7,63,67,0.06)]">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#839596]">
        {label}
      </div>

      <div className="mt-2 text-sm font-bold leading-6 text-[#31595b]">
        {value}
      </div>
    </div>
  );
}

function TagList({
  items,
  empty = "—"
}: {
  items: string[];
  empty?: string;
}) {
  if (!items.length) {
    return <span className="text-sm text-[#879798]">{empty}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-[#12b8c4]/14 bg-[#f1faf9] px-3 py-1.5 text-xs font-bold text-[#397071]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default async function PsychologistProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const lang =
    ((await cookies()).get("ivixhub_lang")?.value as Lang) || "ru";

  const tr = TXT[lang];
  const { id } = await params;

  const response = await fetch(
    `http://localhost:3000/api/psychologists/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  ).catch(() => null);

  if (!response) {
    return (
      <main className="min-h-screen px-5 py-12">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-800">
          {tr.unavailable}
        </div>
      </main>
    );
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);

    return (
      <main className="min-h-screen px-5 py-12">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-800">
          <strong>{tr.error}:</strong>{" "}
          {payload?.message || `Fetch failed (${response.status})`}
        </div>
      </main>
    );
  }

  const p = (await response.json()) as Profile;

  const displayName =
    p.displayName?.trim() || "Psychologist";

  const rating =
    typeof p.ratingAvg === "number"
      ? p.ratingAvg.toFixed(1)
      : "—";

  const reviewsCount =
    typeof p.reviewsCount === "number"
      ? p.reviewsCount
      : 0;

  const recentReviews =
    Array.isArray(p.recentReviews)
      ? p.recentReviews
      : [];

  const languages = Array.isArray(p.languages)
    ? p.languages.map(languageLabel)
    : [];

  const methods = Array.isArray(p.methods)
    ? p.methods.map((item) => methodLabel(item, lang))
    : [];

  const specializations = Array.isArray(p.specializations)
    ? p.specializations.map((item) =>
        specializationLabel(item, lang)
      )
    : [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[650px] bg-[radial-gradient(circle_at_3%_8%,rgba(18,184,196,0.11),transparent_28%),radial-gradient(circle_at_94%_12%,rgba(118,87,223,0.10),transparent_30%),radial-gradient(circle_at_55%_35%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <Link
          href="/psychologists"
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/80 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.back}
        </Link>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(7,63,67,0.09)] backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[32px] border border-[#12b8c4]/16 bg-gradient-to-br from-[#e7f8f5] via-[#edf8fb] to-[#f0efff] shadow-[0_15px_36px_rgba(7,63,67,0.10)] sm:h-36 sm:w-36">
                  {p.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#0b9694]">
                      <UserIcon />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#078b7b]/8 bg-[#e8f8f5] px-3 py-1.5 text-xs font-extrabold text-[#078b7b]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#078b7b] text-white">
                      <CheckIcon />
                    </span>
                    {tr.verified}
                  </span>

                  <h1 className="mt-4 break-words text-3xl font-black tracking-[-0.045em] text-[#073f43] sm:text-[42px] sm:leading-[1.08]">
                    {displayName}
                  </h1>

                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.075em] text-[#8a9a9b]">
                    {tr.profile}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#073f43]/8 bg-[#f7fbfb] px-3.5 py-2 text-xs font-bold text-[#506c6e]">
                      {tr.experience}: {p.experienceYears} {tr.years}
                    </span>

                    {typeof p.age === "number" && (
                      <span className="rounded-full border border-[#073f43]/8 bg-[#f7fbfb] px-3.5 py-2 text-xs font-bold text-[#506c6e]">
                        {tr.age}: {p.age}
                      </span>
                    )}

                    <span className="rounded-full border border-[#073f43]/8 bg-[#f7fbfb] px-3.5 py-2 text-xs font-bold text-[#506c6e]">
                      {tr.gender}: {genderLabel(p.gender, lang)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                <InfoCard
                  label={tr.rating}
                  value={
                    <span className="flex items-center gap-2">
                      <span className="text-[#f2ad32]">
                        <StarIcon />
                      </span>
                      <span>{rating} / 5</span>
                    </span>
                  }
                />

                <InfoCard
                  label={tr.reviews}
                  value={`${reviewsCount} ${tr.review}`}
                />

                <InfoCard
                  label={tr.verifiedSince}
                  value={formatDate(p.verifiedAt, lang)}
                />
              </div>
            </section>

            <section className="rounded-[30px] border border-[#073f43]/7 bg-white p-6 shadow-[0_16px_50px_rgba(7,63,67,0.06)] sm:p-8">
              <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                {tr.about}
              </h2>

              <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-[#5f7678]">
                {p.bio?.trim() || tr.bioEmpty}
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[27px] border border-[#073f43]/7 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/25 hover:shadow-[0_20px_50px_rgba(18,184,196,0.09)]">
                <h3 className="text-sm font-black text-[#173f42]">
                  {tr.languages}
                </h3>

                <div className="mt-4">
                  <TagList items={languages} />
                </div>
              </div>

              <div className="rounded-[27px] border border-[#073f43]/7 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#3977e8]/22 hover:shadow-[0_20px_50px_rgba(57,119,232,0.09)]">
                <h3 className="text-sm font-black text-[#173f42]">
                  {tr.methods}
                </h3>

                <div className="mt-4">
                  <TagList items={methods} />
                </div>
              </div>

              <div className="rounded-[27px] border border-[#073f43]/7 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7657df]/22 hover:shadow-[0_20px_50px_rgba(118,87,223,0.09)]">
                <h3 className="text-sm font-black text-[#173f42]">
                  {tr.specializations}
                </h3>

                <div className="mt-4">
                  <TagList items={specializations} />
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#073f43]/7 bg-white p-6 shadow-[0_16px_50px_rgba(7,63,67,0.06)] sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.025em] text-[#173f42]">
                    {tr.clientReviews}
                  </h2>

                  <p className="mt-1.5 text-sm text-[#7c8f90]">
                    {reviewsCount} {tr.review}
                  </p>
                </div>

                {typeof p.ratingAvg === "number" && (
                  <div className="flex items-center gap-2 rounded-full bg-[#fff8e8] px-3.5 py-2 text-sm font-black text-[#7c5a16]">
                    <span className="text-[#f2ad32]">
                      <StarIcon />
                    </span>
                    {rating}
                  </div>
                )}
              </div>

              {recentReviews.length === 0 ? (
                <div className="mt-5 rounded-[22px] border border-[#073f43]/7 bg-[#f8fbfb] p-5 text-sm leading-6 text-[#6f8384]">
                  {tr.noReviews}
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {recentReviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-[24px] border border-[#073f43]/7 bg-[#fbfdfd] p-5 transition-all duration-300 hover:border-[#12b8c4]/20 hover:bg-white hover:shadow-[0_12px_35px_rgba(7,63,67,0.05)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-[#31595b]">
                            {review.authorDisplayName}
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm tracking-[0.08em] text-[#f2ad32]">
                              {"★".repeat(
                                Math.max(
                                  0,
                                  Math.min(5, review.rating)
                                )
                              )}
                            </span>

                            <span className="text-xs font-bold text-[#819394]">
                              {review.rating} / 5
                            </span>
                          </div>
                        </div>

                        <time className="text-xs font-medium text-[#8b9a9b]">
                          {formatDateTime(review.createdAt, lang)}
                        </time>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#5f7678]">
                        {review.comment?.trim() || tr.noComment}
                      </p>

                      {review.replyComment && (
                        <div className="mt-4 rounded-[20px] border border-[#12b8c4]/12 bg-[#f1faf9] p-4">
                          <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#078b7b]">
                            {tr.reply}
                          </div>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#47696b]">
                            {review.replyComment}
                          </p>

                          {review.repliedAt && (
                            <time className="mt-3 block text-xs text-[#849697]">
                              {formatDateTime(
                                review.repliedAt,
                                lang
                              )}
                            </time>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_22px_65px_rgba(7,63,67,0.09)] backdrop-blur-xl">
              <div className="bg-[radial-gradient(circle_at_90%_0%,rgba(118,87,223,0.12),transparent_42%),radial-gradient(circle_at_0%_0%,rgba(18,184,196,0.13),transparent_45%)] p-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f8f5] px-3 py-1.5 text-xs font-extrabold text-[#078b7b]">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#078b7b] text-white">
                    <CheckIcon />
                  </span>
                  {tr.verified}
                </span>

                <h2 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#073f43]">
                  {displayName}
                </h2>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#f2ad32]">
                    <StarIcon />
                  </span>

                  <span className="font-black text-[#173f42]">
                    {rating}
                  </span>

                  <span className="text-sm text-[#7e9091]">
                    · {reviewsCount} {tr.review}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#073f43]/6 p-5">
                <Link
                  href={`/psychologists/${p.psychologistId}/book`}
                  className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-5 text-sm font-extrabold text-white shadow-[0_11px_28px_rgba(18,159,175,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(57,119,232,0.28)]"
                >
                  {tr.book}
                  <ArrowRightIcon />
                </Link>

                <Link
                  href="/quiz"
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#073f43]/10 bg-white px-5 text-center text-sm font-extrabold text-[#506c6e] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7657df]/25 hover:bg-[#f5f3ff] hover:text-[#625bc8]"
                >
                  {tr.quiz}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
