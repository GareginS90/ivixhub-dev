"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type ApiLang = "HY" | "RU" | "EN";
type Gender = "MALE" | "FEMALE" | "UNSPECIFIED";

type OnboardingResponse = {
  psychologistId: number;
  userId?: number;
  status: string;
  experienceYears: number;
  bio: string | null;
  gender?: Gender | null;
  languages: ApiLang[];
  methods: string[];
  specializations: string[];
  avatarUrl?: string | null;
};

type CatalogItem = {
  code: string;
  name: string;
};

type UploadedDocument = {
  id: number;
  psychologistId: number;
  docType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

const TXT = {
  ru: {
    title: "Профессиональный профиль",
    subtitle:
      "Заполните профиль так, как он должен выглядеть для клиента и для будущей проверки командой IviXHub.",
    basic: "Основная информация",
    experience: "Опыт работы (лет)",
    bio: "О вас как о специалисте",
    bioPh:
      "Коротко опишите ваш профессиональный подход, ключевые темы работы и практический опыт.",
    gender: "Пол",
    photo: "Фото профиля",
    photoHint: "Загрузите основное фото профиля. JPG, PNG или WEBP, до 5 MB.",
    photoReplace: "Заменить фото",
    photoUpload: "Загрузить фото",
    photoUploading: "Загрузка фото...",
    noPhoto: "Фото пока не загружено",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано",
    languages: "Языки консультаций",
    methods: "Методы терапии",
    specializations: "Специализации",
    next: "Сохранить и продолжить",
    saving: "Сохранение...",
    back: "Назад",
    hintTitle: "Что важно на этом этапе",
    hint1: "Пишите так, как клиент увидит вас в каталоге.",
    hint2: "Выберите реальные языки консультаций, методы и специализации.",
    hint3: "Следующим шагом будет загрузка документов и фото профиля.",
    error: "Ошибка",
    warning: "Внимание",
    loading: "Загрузка...",
    retry: "Повторить загрузку",
    authRequired:
      "Сначала нужно войти в аккаунт и пройти шаг подтверждения телефона.",
    login: "Войти",
    register: "Создать аккаунт психолога",
    home: "На главную",
    startFailed:
      "Мы не смогли подтянуть сохранённый статус профиля. Вы всё равно можете продолжить заполнение формы.",
    profileFailed:
      "Не удалось сохранить профиль. Проверьте данные и попробуйте снова.",
    validationExperience:
      "Укажите ваш профессиональный опыт в годах, чтобы мы могли корректно оформить профиль.",
    validationBio:
      "Добавьте короткое профессиональное описание: подход, специализацию и опыт. Минимум 20 символов.",
    validationLanguages:
      "Выберите хотя бы один язык, на котором вы будете проводить консультации.",
    validationMethods:
      "Выберите хотя бы один метод терапии, с которым вы действительно работаете.",
    validationSpecializations:
      "Выберите хотя бы одну специализацию, чтобы клиентам было проще вас найти.",
    catalogFallback:
      "Справочники временно загружены из локального безопасного набора.",
    langHY: "Армянский",
    langRU: "Русский",
    langEN: "Английский",
    pendingTitle: "Профиль уже отправлен на проверку",
    pendingText:
      "Сейчас редактирование временно недоступно, потому что анкета находится на модерации. После проверки мы покажем следующий статус в вашем кабинете.",
    pendingHint:
      "Вы можете вернуться на шаг с документами или перейти в кабинет психолога.",
    documents: "Документы",
    dashboard: "Кабинет психолога"
  },
  en: {
    title: "Professional profile",
    subtitle:
      "Complete your profile the way it should appear both to the client and to the IviXHub moderation team.",
    basic: "Basic information",
    experience: "Years of experience",
    bio: "About you as a specialist",
    bioPh:
      "Briefly describe your professional approach, key work topics, and practical experience.",
    gender: "Gender",
    photo: "Profile photo",
    photoHint: "Upload the main profile photo. JPG, PNG or WEBP, up to 5 MB.",
    photoReplace: "Replace photo",
    photoUpload: "Upload photo",
    photoUploading: "Uploading photo...",
    noPhoto: "No profile photo uploaded yet",
    male: "Male",
    female: "Female",
    unspecified: "Not specified",
    languages: "Consultation languages",
    methods: "Therapy methods",
    specializations: "Specializations",
    next: "Save and continue",
    saving: "Saving...",
    back: "Back",
    hintTitle: "What matters at this stage",
    hint1: "Write your profile the way clients should see it in the catalog.",
    hint2: "Choose the real consultation languages, methods, and specializations you work with.",
    hint3: "The next step is uploading documents and a profile photo.",
    error: "Error",
    warning: "Notice",
    loading: "Loading...",
    retry: "Retry",
    authRequired:
      "Please sign in first and complete the phone verification step.",
    login: "Login",
    register: "Create psychologist account",
    home: "Home",
    startFailed:
      "We could not load your saved profile status. You can still continue filling out the form.",
    profileFailed:
      "Failed to save the profile. Please review your data and try again.",
    validationExperience:
      "Enter your professional experience in years so we can prepare the profile correctly.",
    validationBio:
      "Add a short professional description with your approach, specialization, and experience. Minimum 20 characters.",
    validationLanguages:
      "Choose at least one language in which you provide consultations.",
    validationMethods:
      "Choose at least one therapy method that you actually use in practice.",
    validationSpecializations:
      "Choose at least one specialization so clients can find you more easily.",
    catalogFallback:
      "Reference catalogs are temporarily loaded from a safe local fallback.",
    langHY: "Armenian",
    langRU: "Russian",
    langEN: "English",
    pendingTitle: "Your profile is already under review",
    pendingText:
      "Editing is temporarily unavailable because your onboarding form has already been submitted for moderation. We will show the next status in your dashboard after review.",
    pendingHint:
      "You can return to the documents step or open the psychologist dashboard.",
    documents: "Documents",
    dashboard: "Psychologist dashboard"
  },
  hy: {
    title: "Մասնագիտական պրոֆիլ",
    subtitle:
      "Լրացրեք պրոֆիլը այնպես, ինչպես այն պետք է տեսնի և՛ հաճախորդը, և՛ IviXHub-ի մոդերացիոն թիմը։",
    basic: "Հիմնական տվյալներ",
    experience: "Աշխատանքային փորձ (տարի)",
    bio: "Ձեր մասին որպես մասնագետ",
    bioPh:
      "Կարճ նկարագրեք ձեր մասնագիտական մոտեցումը, հիմնական աշխատանքային ուղղությունները և գործնական փորձը։",
    gender: "Սեռ",
    photo: "Պրոֆիլի լուսանկար",
    photoHint: "Բեռնեք հիմնական պրոֆիլի լուսանկարը։ JPG, PNG կամ WEBP, մինչև 5 MB։",
    photoReplace: "Փոխել լուսանկարը",
    photoUpload: "Բեռնել լուսանկարը",
    photoUploading: "Լուսանկարը բեռնվում է...",
    noPhoto: "Լուսանկար դեռ բեռնված չէ",
    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ",
    languages: "Խորհրդատվության լեզուներ",
    methods: "Թերապիայի մեթոդներ",
    specializations: "Մասնագիտացումներ",
    next: "Պահպանել և շարունակել",
    saving: "Պահպանվում է...",
    back: "Հետ",
    hintTitle: "Ինչն է կարևոր այս փուլում",
    hint1: "Գրեք պրոֆիլը այնպես, ինչպես հաճախորդը պետք է տեսնի այն կատալոգում։",
    hint2: "Ընտրեք այն լեզուները, մեթոդներն ու մասնագիտացումները, որոնցով իսկապես աշխատում եք։",
    hint3: "Հաջորդ քայլը փաստաթղթերի և պրոֆիլի լուսանկարի բեռնումն է։",
    error: "Սխալ",
    warning: "Ուշադրություն",
    loading: "Բեռնվում է...",
    retry: "Կրկնել բեռնումը",
    authRequired:
      "Նախ պետք է մուտք գործել և անցնել հեռախոսի հաստատման քայլը։",
    login: "Մուտք",
    register: "Ստեղծել հոգեբանի հաշիվ",
    home: "Գլխավոր էջ",
    startFailed:
      "Չկարողացանք բեռնել պահպանված պրոֆիլի կարգավիճակը։ Դուք կարող եք շարունակել լրացնել ձևը։",
    profileFailed:
      "Չհաջողվեց պահպանել պրոֆիլը։ Ստուգեք տվյալները և փորձեք կրկին։",
    validationExperience:
      "Նշեք ձեր մասնագիտական փորձը տարիներով, որպեսզի կարողանանք ճիշտ ձևավորել պրոֆիլը։",
    validationBio:
      "Ավելացրեք կարճ մասնագիտական նկարագրություն՝ մոտեցումը, մասնագիտացումը և փորձը։ Առնվազն 20 նիշ։",
    validationLanguages:
      "Ընտրեք առնվազն մեկ լեզու, որով անցկացնելու եք խորհրդատվությունները։",
    validationMethods:
      "Ընտրեք առնվազն մեկ թերապիայի մեթոդ, որով իրականում աշխատում եք։",
    validationSpecializations:
      "Ընտրեք առնվազն մեկ մասնագիտացում, որպեսզի հաճախորդները ձեզ հեշտ գտնեն։",
    catalogFallback:
      "Տեղեկատուները ժամանակավորապես բեռնվել են տեղային անվտանգ տարբերակից։",
    langHY: "Հայերեն",
    langRU: "Ռուսերեն",
    langEN: "Անգլերեն",
    pendingTitle: "Պրոֆիլն արդեն ուղարկված է ստուգման",
    pendingText:
      "Խմբագրումը ժամանակավորապես հասանելի չէ, քանի որ հարցաթերթիկն արդեն ուղարկվել է մոդերացիայի։ Ստուգումից հետո հաջորդ կարգավիճակը կերևա ձեր անձնական էջում։",
    pendingHint:
      "Կարող եք վերադառնալ փաստաթղթերի քայլին կամ բացել հոգեբանի անձնական էջը։",
    documents: "Փաստաթղթեր",
    dashboard: "Հոգեբանի անձնական էջ"
  }
} as const;

const METHOD_FALLBACK: Record<Lang, CatalogItem[]> = {
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
      className={
        active
          ? "rounded-2xl border border-black bg-black px-4 py-2 text-sm text-white"
          : "rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50"
      }
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
  } catch {
    return details;
  }

  return details || null;
}

function mapBackendError(detail: string | null, tr: (typeof TXT)[Lang]) {
  if (!detail) return tr.profileFailed;

  if (detail.includes("PENDING_VERIFICATION")) {
    return tr.pendingText;
  }

  return detail;
}

function mapLangLabel(value: ApiLang, tr: (typeof TXT)[Lang]) {
  if (value === "HY") return tr.langHY;
  if (value === "RU") return tr.langRU;
  return tr.langEN;
}

function latestProfilePhotoUrl(items: UploadedDocument[]): string | null {
  return items
    .filter((item) => item.docType === "PROFILE_PHOTO" && item.fileUrl)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    .map((item) => item.fileUrl)
    .find(Boolean) || null;
}

export default function PsychologistOnboardingProfilePage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogFallbackUsed, setCatalogFallbackUsed] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [softWarning, setSoftWarning] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<Gender>("UNSPECIFIED");
  const [languages, setLanguages] = useState<ApiLang[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);

  const [catalogMethods, setCatalogMethods] = useState<CatalogItem[]>([]);
  const [catalogSpecs, setCatalogSpecs] = useState<CatalogItem[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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
  const isPending = (status || "").toUpperCase() === "PENDING_VERIFICATION";
  const currentStatusUpper = (status || "").toUpperCase();

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
          setCatalogMethods([...METHOD_FALLBACK[lang]]);
          setCatalogSpecs([...SPEC_FALLBACK[lang]]);
          setCatalogFallbackUsed(true);
          return;
        }

        setCatalogMethods(
          methodsList
            .filter((x: unknown): x is CatalogItem => {
              return Boolean(
                x &&
                typeof x === "object" &&
                "code" in x &&
                "name" in x &&
                typeof (x as { code: unknown }).code === "string" &&
                typeof (x as { name: unknown }).name === "string"
              );
            })
            .map((x) => ({ code: x.code, name: x.name }))
        );

        setCatalogSpecs(
          specsList
            .filter((x: unknown): x is CatalogItem => {
              return Boolean(
                x &&
                typeof x === "object" &&
                "code" in x &&
                "name" in x &&
                typeof (x as { code: unknown }).code === "string" &&
                typeof (x as { name: unknown }).name === "string"
              );
            })
            .map((x) => ({ code: x.code, name: x.name }))
        );
      } catch {
        setCatalogMethods([...METHOD_FALLBACK[lang]]);
        setCatalogSpecs([...SPEC_FALLBACK[lang]]);
        setCatalogFallbackUsed(true);
      } finally {
        setCatalogLoading(false);
      }
    })();
  }, [catalogLang, lang]);

  async function loadDocuments() {
    const r = await fetch("/api/psychologists/documents", { cache: "no-store" });
    const j = await r.json().catch(() => []);
    if (!r.ok) return;

    const docs = Array.isArray(j) ? (j as UploadedDocument[]) : [];
    setAvatarUrl(latestProfilePhotoUrl(docs));
  }

  async function loadOnboardingState() {
    try {
      setLoading(true);
      setError(null);
      setSoftWarning(null);
      setAuthRequired(false);

      const r = await fetch("/api/psychologists/onboarding/start", {
        method: "POST"
      });

      const j = (await r.json().catch(() => null)) as OnboardingResponse | { details?: string } | null;

      if (!r.ok) {
        const details = typeof j === "object" && j && "details" in j ? j.details || "" : "";
        const is401 =
          r.status === 401 ||
          details.includes('"status":401') ||
          details.includes("Authentication required");

        if (is401) {
          setAuthRequired(true);
          return;
        }

        setSoftWarning(tr.startFailed);
      } else if (j && "status" in j) {
        const data = j as OnboardingResponse;
        setStatus(data.status || null);
        setExperienceYears(data.experienceYears > 0 ? String(data.experienceYears) : "");
        setBio(data.bio || "");
        setGender(data.gender || "UNSPECIFIED");
        setLanguages(Array.isArray(data.languages) ? data.languages : []);
        setMethods(Array.isArray(data.methods) ? data.methods : []);
        setSpecializations(Array.isArray(data.specializations) ? data.specializations : []);
        setAvatarUrl(data.avatarUrl || null);
      }

      await loadDocuments();
    } catch {
      setSoftWarning(tr.startFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOnboardingState();
  }, [lang]);

  function toggleArrayValue<T extends string>(list: T[], value: T, setter: (next: T[]) => void) {
    if (list.includes(value)) {
      setter(list.filter((x) => x !== value));
    } else {
      setter([...list, value]);
    }
  }

  function onPhotoSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
  }

  async function uploadProfilePhotoIfNeeded() {
    if (!photoFile) return;

    const form = new FormData();
    form.append("docType", "PROFILE_PHOTO");
    form.append("file", photoFile);

    const r = await fetch("/api/psychologists/documents/upload", {
      method: "POST",
      body: form
    });

    const j = await r.json().catch(() => null);

    if (!r.ok) {
      const details =
        typeof j?.details === "string" && j.details.trim()
          ? extractDetail(j.details) || j.details
          : j?.message || tr.profileFailed;
      throw new Error(details);
    }

    const uploadedUrl =
      typeof j?.fileUrl === "string" && j.fileUrl.trim() ? j.fileUrl.trim() : null;

    if (uploadedUrl) {
      setAvatarUrl(uploadedUrl);
    }

    setPhotoFile(null);
  }

  async function saveAndContinue() {
    if (saving || uploadingPhoto || isPending) return;

    setError(null);

    const years = Number(experienceYears);

    if (!Number.isFinite(years) || years <= 0) {
      setError(tr.validationExperience);
      return;
    }

    if (bio.trim().length < 20) {
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

    try {
      setSaving(true);

      const r = await fetch("/api/psychologists/onboarding/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          experienceYears: years,
          bio: bio.trim(),
          gender,
          languages,
          methods,
          specializations
        })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const details =
          typeof j?.details === "string" ? extractDetail(j.details) : null;
        setError(mapBackendError(details || j?.message || null, tr));
        return;
      }

      if (photoFile) {
        setUploadingPhoto(true);
        await uploadProfilePhotoIfNeeded();
      }

      if (currentStatusUpper === "VERIFIED" || currentStatusUpper === "REJECTED") {
        window.location.href = "/pro";
        return;
      }

      window.location.href = "/psychologists/onboarding/documents";
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : tr.profileFailed);
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  }

  const genderOptions = useMemo(
    () => [
      { code: "MALE" as const, label: tr.male },
      { code: "FEMALE" as const, label: tr.female },
      { code: "UNSPECIFIED" as const, label: tr.unspecified }
    ],
    [tr]
  );

  if (authRequired) {
    return (
      <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
          <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
            <b>{tr.warning}:</b> {tr.authRequired}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/login?role=psychologist" className="rounded-2xl bg-black px-5 py-3 text-center text-white hover:opacity-90">
              {tr.login}
            </Link>
            <Link href="/auth/register?role=psychologist" className="rounded-2xl border px-5 py-3 text-center hover:bg-gray-50">
              {tr.register}
            </Link>
            <Link href="/" className="rounded-2xl border px-5 py-3 text-center hover:bg-gray-50">
              {tr.home}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
          {tr.loading}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="text-sm text-gray-500">IvixHUB</div>
          <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-600">{tr.subtitle}</p>

          {softWarning && (
            <div className="mt-6 rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
              <b>{tr.warning}:</b> {softWarning}
            </div>
          )}

          {catalogFallbackUsed && (
            <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
              {tr.catalogFallback}
            </div>
          )}

          {isPending ? (
            <div className="mt-6 rounded-3xl border bg-slate-50 p-6">
              <h2 className="text-lg font-semibold">{tr.pendingTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{tr.pendingText}</p>
              <p className="mt-3 text-sm text-slate-600">{tr.pendingHint}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/psychologists/onboarding/documents"
                  className="rounded-2xl border px-5 py-3 text-center hover:bg-white"
                >
                  {tr.documents}
                </Link>
                <Link
                  href="/pro"
                  className="rounded-2xl bg-black px-5 py-3 text-center text-white hover:opacity-90"
                >
                  {tr.dashboard}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-6">
                <div className="rounded-3xl border bg-slate-50 p-6">
                  <h2 className="text-lg font-semibold">{tr.basic}</h2>

                  <div className="mt-6 grid gap-5">
                    <label className="block">
                      <div className="mb-2 text-sm font-medium">{tr.experience}</div>
                      <input
                        type="number"
                        min={1}
                        max={80}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </label>

                    <label className="block">
                      <div className="mb-2 text-sm font-medium">{tr.bio}</div>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={6}
                        maxLength={2000}
                        placeholder={tr.bioPh}
                        className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </label>

                    <div>
                      <div className="mb-2 text-sm font-medium">{tr.gender}</div>
                      <div className="flex flex-wrap gap-2">
                        {genderOptions.map((item) => (
                          <ToggleChip
                            key={item.code}
                            active={gender === item.code}
                            onClick={() => setGender(item.code)}
                          >
                            {item.label}
                          </ToggleChip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">{tr.photo}</div>

                      <div className="rounded-3xl border bg-white p-5">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                          <div className="h-28 w-28 overflow-hidden rounded-3xl border bg-slate-100">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="Profile"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                PHOTO
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="text-sm text-slate-600">{tr.photoHint}</div>
                            {!avatarUrl && (
                              <div className="mt-2 text-sm text-slate-500">{tr.noPhoto}</div>
                            )}

                            {photoFile && (
                              <div className="mt-2 text-sm text-slate-700">
                                {photoFile.name}
                              </div>
                            )}

                            <label className="mt-4 inline-flex cursor-pointer rounded-2xl border px-4 py-3 text-sm hover:bg-gray-50">
                              {avatarUrl ? tr.photoReplace : tr.photoUpload}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={onPhotoSelected}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">{tr.languages}</div>
                      <div className="flex flex-wrap gap-2">
                        {(["HY", "RU", "EN"] as const).map((item) => (
                          <ToggleChip
                            key={item}
                            active={languages.includes(item)}
                            onClick={() => toggleArrayValue(languages, item, setLanguages)}
                          >
                            {mapLangLabel(item, tr)}
                          </ToggleChip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">{tr.methods}</div>
                      <div className="flex flex-wrap gap-2">
                        {catalogLoading ? (
                          <div className="text-sm text-gray-500">{tr.loading}</div>
                        ) : (
                          catalogMethods.map((item) => (
                            <ToggleChip
                              key={item.code}
                              active={methods.includes(item.code)}
                              onClick={() => toggleArrayValue(methods, item.code, setMethods)}
                            >
                              {item.name}
                            </ToggleChip>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">{tr.specializations}</div>
                      <div className="flex flex-wrap gap-2">
                        {catalogLoading ? (
                          <div className="text-sm text-gray-500">{tr.loading}</div>
                        ) : (
                          catalogSpecs.map((item) => (
                            <ToggleChip
                              key={item.code}
                              active={specializations.includes(item.code)}
                              onClick={() => toggleArrayValue(specializations, item.code, setSpecializations)}
                            >
                              {item.name}
                            </ToggleChip>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
                    <b>{tr.error}:</b> {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/pro"
                    className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
                  >
                    {tr.back}
                  </Link>

                  <button
                    type="button"
                    onClick={saveAndContinue}
                    disabled={saving || uploadingPhoto}
                    className="inline-flex justify-center rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {saving || uploadingPhoto
                      ? uploadingPhoto
                        ? tr.photoUploading
                        : tr.saving
                      : tr.next}
                  </button>
                </div>
              </section>

              <aside className="rounded-3xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{tr.hintTitle}</h3>

                <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <div>• {tr.hint1}</div>
                  <div>• {tr.hint2}</div>
                  <div>• {tr.hint3}</div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
