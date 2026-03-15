"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

const TXT = {
  ru: {
    title: "Профиль психолога",
    subtitle:
      "Заполните профессиональный профиль специалиста. Эти данные используются для подбора, каталога и последующей модерации.",
    basic: "Основная информация",
    experience: "Опыт работы (лет)",
    bio: "О себе",
    bioPh: "Кратко опишите ваш профессиональный подход, специализацию и опыт.",
    languages: "Языки консультаций",
    methods: "Методы терапии",
    specializations: "Специализации",
    next: "Сохранить и продолжить",
    saving: "Сохранение...",
    back: "Назад",
    hintTitle: "Что важно на этом этапе",
    hint1: "Заполняйте профиль так, как он должен выглядеть для клиента.",
    hint2: "Укажите реальные языки консультаций, методы и специализации.",
    hint3: "Следующим шагом будет загрузка документов для верификации.",
    error: "Ошибка",
    loading: "Загрузка...",
    authRequired: "Сначала нужно войти в аккаунт и пройти путь подтверждения.",
    login: "Войти",
    register: "Создать аккаунт психолога",
    home: "На главную",
    startFailed: "Не удалось начать onboarding психолога.",
    profileFailed: "Не удалось сохранить профиль психолога.",
    validationExperience: "Укажите корректный опыт работы.",
    validationBio: "Кратко опишите опыт, подход и специализацию. Минимум 20 символов.",
    validationLanguages: "Выберите хотя бы один язык консультации.",
    validationMethods: "Выберите хотя бы один метод терапии.",
    validationSpecializations: "Выберите хотя бы одну специализацию.",
    catalogFallback: "Каталог временно загружен из локального безопасного набора.",
    langHY: "Армянский",
    langRU: "Русский",
    langEN: "Английский"
  },
  en: {
    title: "Psychologist profile",
    subtitle:
      "Complete the professional profile. This information is used for matching, catalog listing, and moderation.",
    basic: "Basic information",
    experience: "Years of experience",
    bio: "About you",
    bioPh: "Briefly describe your professional approach, specialization, and experience.",
    languages: "Consultation languages",
    methods: "Therapy methods",
    specializations: "Specializations",
    next: "Save and continue",
    saving: "Saving...",
    back: "Back",
    hintTitle: "What matters at this stage",
    hint1: "Fill in the profile the way it should appear to the client.",
    hint2: "Specify your real consultation languages, methods, and specializations.",
    hint3: "The next step will be document upload for verification.",
    error: "Error",
    loading: "Loading...",
    authRequired: "Please sign in first and complete the verification flow.",
    login: "Login",
    register: "Create psychologist account",
    deleteAccount: "Delete account",
    home: "Home",
    startFailed: "Failed to start psychologist onboarding.",
    profileFailed: "Failed to save psychologist profile.",
    validationExperience: "Please enter valid work experience.",
    validationBio: "Briefly describe experience, approach, and specialization. Minimum 20 characters.",
    validationLanguages: "Select at least one consultation language.",
    validationMethods: "Select at least one therapy method.",
    validationSpecializations: "Select at least one specialization.",
    catalogFallback: "Catalog is temporarily loaded from a safe local fallback.",
    langHY: "Armenian",
    langRU: "Russian",
    langEN: "English"
  },
  hy: {
    title: "Հոգեբանի պրոֆիլ",
    subtitle:
      "Լրացրեք մասնագիտական պրոֆիլը։ Այս տվյալները օգտագործվում են ընտրության, կատալոգի և մոդերացիայի համար։",
    basic: "Հիմնական տվյալներ",
    experience: "Աշխատանքային փորձ (տարի)",
    bio: "Ձեր մասին",
    bioPh: "Կարճ նկարագրեք ձեր մասնագիտական մոտեցումը, մասնագիտացումը և փորձը։",
    languages: "Խորհրդատվության լեզուներ",
    methods: "Թերապիայի մեթոդներ",
    specializations: "Մասնագիտացումներ",
    next: "Պահպանել և շարունակել",
    saving: "Պահպանվում է...",
    back: "Հետ",
    hintTitle: "Ինչն է կարևոր այս փուլում",
    hint1: "Լրացրեք պրոֆիլը այնպես, ինչպես այն պետք է տեսնի հաճախորդը։",
    hint2: "Նշեք ձեր իրական խորհրդատվական լեզուները, մեթոդներն ու մասնագիտացումները։",
    hint3: "Հաջորդ քայլը կլինի փաստաթղթերի բեռնումը վերիֆիկացիայի համար։",
    error: "Սխալ",
    loading: "Բեռնվում է...",
    authRequired: "Սկզբում պետք է մուտք գործել և անցնել հաստատման փուլը։",
    login: "Մուտք",
    register: "Ստեղծել հոգեբանի հաշիվ",
    home: "Գլխավոր էջ",
    startFailed: "Չհաջողվեց սկսել հոգեբանի onboarding-ը։",
    profileFailed: "Չհաջողվեց պահպանել հոգեբանի պրոֆիլը։",
    validationExperience: "Նշեք ճիշտ աշխատանքային փորձ։",
    validationBio: "Կարճ նկարագրեք փորձը, մոտեցումը և մասնագիտացումը։ Առնվազն 20 նիշ։",
    validationLanguages: "Ընտրեք գոնե մեկ խորհրդատվական լեզու։",
    validationMethods: "Ընտրեք գոնե մեկ թերապիայի մեթոդ։",
    validationSpecializations: "Ընտրեք գոնե մեկ մասնագիտացում։",
    catalogFallback: "Կատալոգը ժամանակավորապես բեռնվել է տեղային անվտանգ տարբերակից։",
    langHY: "Հայերեն",
    langRU: "Ռուսերեն",
    langEN: "Անգլերեն"
  }
} as const;

type Lang = keyof typeof TXT;
type ApiLang = "HY" | "RU" | "EN";

type OnboardingResponse = {
  psychologistId: number;
  status: string;
  experienceYears: number;
  bio: string | null;
  languages: ApiLang[];
  methods: string[];
  specializations: string[];
};

type CatalogItem = {
  code: string;
  name: string;
};

const METHOD_FALLBACK = {
  ru: [
    { code: "act", name: "ACT (Терапия принятия и ответственности)" },
    { code: "cbt", name: "КПТ (Когнитивно-поведенческая терапия)" },
    { code: "dbt", name: "ДПТ (Диалектическая поведенческая терапия)" },
    { code: "emdr", name: "EMDR" },
    { code: "family_systems", name: "Семейная системная терапия" },
    { code: "gestalt", name: "Гештальт-терапия" },
    { code: "psychodynamic", name: "Психодинамическая терапия" }
  ],
  en: [
    { code: "act", name: "Acceptance and Commitment Therapy (ACT)" },
    { code: "cbt", name: "Cognitive Behavioral Therapy (CBT)" },
    { code: "dbt", name: "Dialectical Behavior Therapy (DBT)" },
    { code: "emdr", name: "EMDR" },
    { code: "family_systems", name: "Family systems therapy" },
    { code: "gestalt", name: "Gestalt therapy" },
    { code: "psychodynamic", name: "Psychodynamic therapy" }
  ],
  hy: [
    { code: "act", name: "Ընդունման և հանձնառության թերապիա (ACT)" },
    { code: "cbt", name: "Կոգնիտիվ-վարքաբանական թերապիա (CBT)" },
    { code: "dbt", name: "Դիալեկտիկական վարքաբանական թերապիա (DBT)" },
    { code: "emdr", name: "EMDR" },
    { code: "family_systems", name: "Ընտանեկան համակարգային թերապիա" },
    { code: "gestalt", name: "Գեշտալտ թերապիա" },
    { code: "psychodynamic", name: "Հոգեդինամիկ թերապիա" }
  ]
} as const;

const SPEC_FALLBACK = {
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
} as const;

function ToggleChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2 text-sm transition ${
        active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function extractDetail(details: string): string | null {
  if (!details) return null;

  try {
    const parsed = JSON.parse(details);
    if (parsed?.detail) return String(parsed.detail);
    if (parsed?.message) return String(parsed.message);
  } catch {}

  if (details.includes("detail")) {
    return details;
  }

  return details;
}

export default function PsychologistOnboardingProfilePage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogFallbackUsed, setCatalogFallbackUsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState<ApiLang[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);

  const [catalogMethods, setCatalogMethods] = useState<CatalogItem[]>([]);
  const [catalogSpecs, setCatalogSpecs] = useState<CatalogItem[]>([]);

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();

    const onFocus = () => syncLang();
    const onVisible = () => {
      if (document.visibilityState === "visible") syncLang();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(syncLang, 700);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, []);

  const tr = TXT[lang];
  const catalogLang = lang === "ru" ? "ru" : lang === "hy" ? "hy" : "en";

  useEffect(() => {
    (async () => {
      try {
        setCatalogLoading(true);
        setCatalogFallbackUsed(false);

        const [mRes, sRes] = await Promise.all([
          fetch(`/api/catalog/methods?lang=${catalogLang}`, { cache: "no-store" }),
          fetch(`/api/catalog/specializations?lang=${catalogLang}`, { cache: "no-store" })
        ]);

        const mJson = await mRes.json().catch(() => []);
        const sJson = await sRes.json().catch(() => []);

        const methodsList = Array.isArray(mJson) ? mJson : [];
        const specsList = Array.isArray(sJson) ? sJson : [];

        if (!mRes.ok || !sRes.ok || methodsList.length === 0 || specsList.length === 0) {
          setCatalogMethods([...METHOD_FALLBACK[catalogLang]]);
          setCatalogSpecs([...SPEC_FALLBACK[catalogLang]]);
          setCatalogFallbackUsed(true);
          return;
        }

        setCatalogMethods(
          methodsList
            .filter((x: any) => x && x.code && x.name)
            .map((x: any) => ({ code: x.code, name: x.name }))
        );
        setCatalogSpecs(
          specsList
            .filter((x: any) => x && x.code && x.name)
            .map((x: any) => ({ code: x.code, name: x.name }))
        );
      } catch {
        setCatalogMethods([...METHOD_FALLBACK[catalogLang]]);
        setCatalogSpecs([...SPEC_FALLBACK[catalogLang]]);
        setCatalogFallbackUsed(true);
      } finally {
        setCatalogLoading(false);
      }
    })();
  }, [catalogLang]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setAuthRequired(false);

        const r = await fetch("/api/psychologists/onboarding/start", {
          method: "POST"
        });

        const j = await r.json().catch(() => null);

        if (!r.ok) {
          const details = j?.details || "";
          const is401 =
            r.status === 401 ||
            details.includes('"status":401') ||
            details.includes("Authentication required");

          if (is401) {
            setAuthRequired(true);
            return;
          }

          setError(tr.startFailed);
          return;
        }

        const data = j as OnboardingResponse;
        setExperienceYears(data.experienceYears > 0 ? String(data.experienceYears) : "");
        setBio(data.bio || "");
        setLanguages(Array.isArray(data.languages) ? data.languages : []);
        setMethods(Array.isArray(data.methods) ? data.methods : []);
        setSpecializations(Array.isArray(data.specializations) ? data.specializations : []);
      } catch {
        setError(tr.startFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [tr.startFailed]);

  const visibleMethods = useMemo(() => catalogMethods, [catalogMethods]);
  const visibleSpecs = useMemo(() => catalogSpecs, [catalogSpecs]);

  function toggleString(current: string[], setter: (v: string[]) => void, value: string) {
    setter(current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);
  }

  function toggleLang(value: ApiLang) {
    setLanguages(
      languages.includes(value)
        ? languages.filter((x) => x !== value)
        : [...languages, value]
    );
  }

  async function saveProfile() {
    setError(null);

    if (!experienceYears || Number(experienceYears) <= 0) {
      setError(tr.validationExperience);
      return;
    }

    if (!bio || bio.trim().length < 20) {
      setError(tr.validationBio);
      return;
    }

    if (languages.length === 0) {
      setError(tr.validationLanguages);
      return;
    }

    if (methods.length === 0) {
      setError(tr.validationMethods);
      return;
    }

    if (specializations.length === 0) {
      setError(tr.validationSpecializations);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        experienceYears: Number(experienceYears),
        bio: bio.trim(),
        languages,
        methods,
        specializations
      };

      const r = await fetch("/api/psychologists/onboarding/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const details = j?.details || "";
        const is401 =
          r.status === 401 ||
          details.includes('"status":401') ||
          details.includes("Authentication required");

        if (is401) {
          setAuthRequired(true);
          return;
        }

        const backendDetail = extractDetail(details);
        setError(backendDetail || j?.message || tr.profileFailed);
        return;
      }

      window.location.href = "/psychologists/onboarding/documents";
    } catch {
      setError(tr.profileFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <section className="rounded-3xl border bg-white p-8 shadow-sm">
            <div className="text-sm text-gray-500">IvixHUB</div>
            <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">{tr.subtitle}</p>

            {loading ? (
              <div className="mt-8 rounded-2xl border bg-slate-50 p-5 text-sm text-gray-700">
                {tr.loading}
              </div>
            ) : authRequired ? (
              <div className="mt-8 rounded-3xl border bg-amber-50 p-6">
                <div className="text-sm text-amber-900">{tr.authRequired}</div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/auth/login?next=/psychologists/onboarding/profile"
                    className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90"
                  >
                    {tr.login}
                  </Link>
                  <Link
                    href="/auth/register?role=psychologist"
                    className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
                  >
                    {tr.register}
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
                  >
                    {tr.home}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-8 rounded-3xl border bg-slate-50 p-5">
                  <div className="font-medium">{tr.basic}</div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">{tr.experience}</label>
                      <input
                        type="number"
                        min="1"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">{tr.bio}</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={tr.bioPh}
                        rows={6}
                        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border bg-white p-5">
                  <div className="font-medium">{tr.languages}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ToggleChip active={languages.includes("HY")} onClick={() => toggleLang("HY")}>
                      {tr.langHY}
                    </ToggleChip>
                    <ToggleChip active={languages.includes("RU")} onClick={() => toggleLang("RU")}>
                      {tr.langRU}
                    </ToggleChip>
                    <ToggleChip active={languages.includes("EN")} onClick={() => toggleLang("EN")}>
                      {tr.langEN}
                    </ToggleChip>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border bg-white p-5">
                  <div className="font-medium">{tr.methods}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {catalogLoading ? (
                      <div className="text-sm text-gray-500">{tr.loading}</div>
                    ) : (
                      visibleMethods.map((item) => (
                        <ToggleChip
                          key={item.code}
                          active={methods.includes(item.code)}
                          onClick={() => toggleString(methods, setMethods, item.code)}
                        >
                          {item.name}
                        </ToggleChip>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border bg-white p-5">
                  <div className="font-medium">{tr.specializations}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {catalogLoading ? (
                      <div className="text-sm text-gray-500">{tr.loading}</div>
                    ) : (
                      visibleSpecs.map((item) => (
                        <ToggleChip
                          key={item.code}
                          active={specializations.includes(item.code)}
                          onClick={() => toggleString(specializations, setSpecializations, item.code)}
                        >
                          {item.name}
                        </ToggleChip>
                      ))
                    )}
                  </div>
                </div>

                {catalogFallbackUsed && (
                  <div className="mt-6 rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
                    {tr.catalogFallback}
                  </div>
                )}

                {error && (
                  <div className="mt-6 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
                    <b>{tr.error}:</b> {error}
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving || loading || catalogLoading}
                    className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? tr.saving : tr.next}
                  </button>

                  <Link
                    href="/psychologists/onboarding"
                    className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
                  >
                    {tr.back}
                  </Link>

                  <Link
                    href="/psychologists/account/delete"
                    className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
                  >
                    {tr.deleteAccount}
                  </Link>
                </div>
              </>
            )}
          </section>

          <aside className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">{tr.hintTitle}</h2>

            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <div className="rounded-2xl bg-slate-50 p-4">{tr.hint1}</div>
              <div className="rounded-2xl bg-slate-50 p-4">{tr.hint2}</div>
              <div className="rounded-2xl bg-slate-50 p-4">{tr.hint3}</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
