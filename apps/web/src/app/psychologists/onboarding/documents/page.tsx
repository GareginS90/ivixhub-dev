"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type DocType = "DIPLOMA" | "ID_CARD" | "PROFILE_PHOTO";

type UploadedDoc = {
  id: number;
  psychologistId: number;
  docType: DocType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

type OnboardingStartResponse = {
  psychologistId: number;
  status: string;
  experienceYears: number;
  bio: string | null;
  languages: string[];
  methods: string[];
  specializations: string[];
};

const TXT = {
  ru: {
    title: "Документы и фото психолога",
    subtitle:
      "Загрузите обязательные документы специалиста и фотографию профиля. После этого профиль можно отправить на модерацию.",
    diploma: "Диплом",
    idCard: "Удостоверение личности",
    photo: "Фотография профиля",
    diplomaHint: "PDF, JPG, PNG или WEBP, до 10MB.",
    idHint: "PDF, JPG, PNG или WEBP, до 10MB.",
    photoHint:
      "JPG, PNG или WEBP, до 5MB. Фото должно быть корректным портретом специалиста.",
    choose: "Выбрать файл",
    replace: "Заменить файл",
    uploading: "Загрузка...",
    uploaded: "Загружено",
    submit: "Отправить на проверку",
    submitting: "Отправка...",
    back: "Назад к профилю",
    deleteAccount: "Удалить аккаунт",
    success: "Профиль отправлен на модерацию. Сейчас перенаправим вас на страницу статуса.",
    loadError: "Не удалось загрузить список документов.",
    uploadError: "Не удалось загрузить файл.",
    submitError: "Не удалось отправить профиль на проверку. Попробуйте ещё раз.",
    requiredMissing:
      "Загрузите диплом, удостоверение личности и фото профиля, чтобы отправить профиль на проверку.",
    open: "Открыть",
    format: "Формат",
    uploadOk: "Файл успешно загружен.",
    error: "Ошибка",
    unknownFormat: "Неизвестный формат",
    photoDbError:
      "Фото профиля пока не удалось сохранить. Мы уже исправили схему, попробуйте загрузить фото ещё раз.",
    authError: "Нужно снова войти в аккаунт.",
    genericUploadError:
      "Не удалось загрузить файл. Проверьте формат и размер файла и попробуйте ещё раз.",
    loading: "Загрузка...",
    pendingTitle: "Профиль уже находится на модерации",
    pendingText:
      "Документы и профиль уже отправлены на проверку. Пока модерация не завершена, повторная отправка и редактирование недоступны.",
    pendingHint:
      "Вы можете перейти к статусу анкеты или вернуться в личный кабинет.",
    profileStatus: "Статус анкеты",
    dashboard: "Личный кабинет",
    authRequired:
      "Чтобы продолжить onboarding, нужно снова войти в аккаунт психолога.",
    login: "Войти",
    register: "Создать аккаунт психолога",
    home: "На главную"
  },
  en: {
    title: "Psychologist documents and profile photo",
    subtitle:
      "Upload the required specialist documents and profile photo. After that, the profile can be submitted for moderation.",
    diploma: "Diploma",
    idCard: "Identity document",
    photo: "Profile photo",
    diplomaHint: "PDF, JPG, PNG or WEBP, up to 10MB.",
    idHint: "PDF, JPG, PNG or WEBP, up to 10MB.",
    photoHint:
      "JPG, PNG or WEBP, up to 5MB. The photo must be a valid portrait of the specialist.",
    choose: "Choose file",
    replace: "Replace file",
    uploading: "Uploading...",
    uploaded: "Uploaded",
    submit: "Submit for review",
    submitting: "Submitting...",
    back: "Back to profile",
    deleteAccount: "Delete account",
    success:
      "The profile has been submitted for moderation. Redirecting you to the status page.",
    loadError: "Failed to load documents list.",
    uploadError: "Failed to upload file.",
    submitError: "Failed to submit the profile for review. Please try again.",
    requiredMissing:
      "Upload the diploma, identity document, and profile photo before submitting the profile for review.",
    open: "Open",
    format: "Format",
    uploadOk: "File uploaded successfully.",
    error: "Error",
    unknownFormat: "Unknown format",
    photoDbError:
      "The profile photo could not be saved yet. The schema fix is ready, please try uploading the photo again.",
    authError: "Please sign in again.",
    genericUploadError:
      "Failed to upload file. Check the file format and size, then try again.",
    loading: "Loading...",
    pendingTitle: "Your profile is already under moderation",
    pendingText:
      "Your documents and profile have already been submitted for review. Re-submission and editing are temporarily unavailable while moderation is in progress.",
    pendingHint:
      "You can open your profile status or return to the dashboard.",
    profileStatus: "Profile status",
    dashboard: "Dashboard",
    authRequired:
      "To continue onboarding, please sign in to your psychologist account again.",
    login: "Login",
    register: "Create psychologist account",
    home: "Home"
  },
  hy: {
    title: "Հոգեբանի փաստաթղթեր և պրոֆիլի լուսանկար",
    subtitle:
      "Բեռնեք մասնագետի պարտադիր փաստաթղթերը և պրոֆիլի լուսանկարը։ Դրանից հետո պրոֆիլը կարելի է ուղարկել մոդերացիայի։",
    diploma: "Դիպլոմ",
    idCard: "Անձը հաստատող փաստաթուղթ",
    photo: "Պրոֆիլի լուսանկար",
    diplomaHint: "PDF, JPG, PNG կամ WEBP, մինչև 10MB։",
    idHint: "PDF, JPG, PNG կամ WEBP, մինչև 10MB։",
    photoHint:
      "JPG, PNG կամ WEBP, մինչև 5MB։ Լուսանկարը պետք է լինի մասնագետի ճիշտ դիմանկար։",
    choose: "Ընտրել ֆայլ",
    replace: "Փոխարինել ֆայլը",
    uploading: "Բեռնվում է...",
    uploaded: "Բեռնված է",
    submit: "Ուղարկել ստուգման",
    submitting: "Ուղարկվում է...",
    back: "Վերադառնալ պրոֆիլ",
    deleteAccount: "Հեռացնել հաշիվը",
    success:
      "Պրոֆիլն ուղարկվել է մոդերացիայի։ Հիմա ձեզ կտեղափոխենք կարգավիճակի էջ։",
    loadError: "Չհաջողվեց բեռնել փաստաթղթերի ցանկը։",
    uploadError: "Չհաջողվեց բեռնել ֆայլը։",
    submitError: "Չհաջողվեց ուղարկել պրոֆիլը ստուգման։ Փորձեք կրկին։",
    requiredMissing:
      "Բեռնեք դիպլոմը, անձը հաստատող փաստաթուղթը և պրոֆիլի լուսանկարը, որպեսզի կարողանաք ուղարկել պրոֆիլը ստուգման։",
    open: "Բացել",
    format: "Ֆորմատ",
    uploadOk: "Ֆայլը հաջողությամբ բեռնվել է։",
    error: "Սխալ",
    unknownFormat: "Անհայտ ֆորմատ",
    photoDbError:
      "Պրոֆիլի լուսանկարը դեռ չհաջողվեց պահպանել։ Սխեման արդեն ուղղված է, փորձեք նորից բեռնել լուսանկարը։",
    authError: "Պետք է նորից մուտք գործել հաշիվ։",
    genericUploadError:
      "Չհաջողվեց բեռնել ֆայլը։ Ստուգեք ֆորմատն ու չափը և փորձեք կրկին։",
    loading: "Բեռնվում է...",
    pendingTitle: "Պրոֆիլն արդեն մոդերացիայի փուլում է",
    pendingText:
      "Ձեր փաստաթղթերն ու պրոֆիլն արդեն ուղարկվել են ստուգման։ Քանի դեռ մոդերացիան չի ավարտվել, կրկնակի ուղարկումը և խմբագրումը ժամանակավորապես հասանելի չեն։",
    pendingHint:
      "Կարող եք բացել պրոֆիլի կարգավիճակը կամ վերադառնալ անձնական էջ։",
    profileStatus: "Պրոֆիլի կարգավիճակ",
    dashboard: "Անձնական էջ",
    authRequired:
      "Onboarding-ը շարունակելու համար պետք է նորից մուտք գործեք հոգեբանի հաշիվ։",
    login: "Մուտք",
    register: "Ստեղծել հոգեբանի հաշիվ",
    home: "Գլխավոր էջ"
  }
} as const;

function fileExtension(name: string) {
  const idx = name.lastIndexOf(".");
  if (idx === -1) return "";
  return name.slice(idx + 1).toUpperCase();
}

function getFriendlyUploadError(payload: any, tr: (typeof TXT)[Lang]) {
  const message = payload?.message || "";
  const details = payload?.details || "";
  const all = `${message} ${details}`;

  if (all.includes("Authentication required")) return tr.authError;
  if (all.includes("psychologist_documents_doc_type_check")) return tr.photoDbError;
  if (all.includes("PROFILE_PHOTO")) return tr.photoDbError;
  if (all.includes("Profile photo must be")) return message || tr.genericUploadError;
  if (all.includes("Document must be")) return message || tr.genericUploadError;
  if (all.includes("must be <=")) return message || tr.genericUploadError;

  if (message) return message;
  return tr.genericUploadError;
}

function getFriendlySubmitError(payload: any, tr: (typeof TXT)[Lang]) {
  const message = payload?.message || "";
  const details = payload?.details || "";
  const all = `${message} ${details}`;

  if (all.includes("Authentication required")) return tr.authError;
  if (all.includes("PENDING_VERIFICATION")) return tr.pendingText;
  if (all.includes("already submitted")) return tr.pendingText;
  if (all.includes("not editable")) return tr.pendingText;
  if (message && message !== "Psychologist onboarding submit failed") return message;

  return tr.submitError;
}

export default function PsychologistOnboardingDocumentsPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<DocType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

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

  async function loadStatus() {
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

      throw new Error(j?.message || tr.loadError);
    }

    const data = j as OnboardingStartResponse;
    setStatus(data.status || null);
  }

  async function loadDocs() {
    const r = await fetch("/api/psychologists/documents", { cache: "no-store" as any });
    const j = await r.json().catch(() => null);

    if (!r.ok) {
      throw new Error(j?.message || tr.loadError);
    }

    setDocs(Array.isArray(j) ? j : []);
  }

  async function loadPage() {
    try {
      setLoading(true);
      setError(null);
      setAuthRequired(false);

      await loadStatus();
      if (!authRequired) {
        await loadDocs();
      }
    } catch (e: any) {
      setError(e?.message || tr.loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const diplomaDoc = useMemo(
    () => docs.find((d) => d.docType === "DIPLOMA") || null,
    [docs]
  );
  const idDoc = useMemo(
    () => docs.find((d) => d.docType === "ID_CARD") || null,
    [docs]
  );
  const photoDoc = useMemo(
    () => docs.find((d) => d.docType === "PROFILE_PHOTO") || null,
    [docs]
  );

  const isPendingVerification = status === "PENDING_VERIFICATION";

  async function handleUpload(docType: DocType, file: File | null) {
    if (!file || isPendingVerification) return;

    setError(null);
    setSuccess(null);
    setUploadingType(docType);

    try {
      const formData = new FormData();
      formData.append("docType", docType);
      formData.append("file", file);

      const r = await fetch("/api/psychologists/documents/upload", {
        method: "POST",
        body: formData
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(getFriendlyUploadError(j, tr));
        return;
      }

      await loadDocs();
      setSuccess(tr.uploadOk);
    } catch (e: any) {
      setError(e?.message || tr.uploadError);
    } finally {
      setUploadingType(null);
    }
  }

  async function submitOnboarding() {
    if (isPendingVerification) {
      setError(tr.pendingText);
      return;
    }

    setError(null);
    setSuccess(null);

    if (!diplomaDoc || !idDoc || !photoDoc) {
      setError(tr.requiredMissing);
      return;
    }

    setSubmitting(true);

    try {
      const r = await fetch("/api/psychologists/onboarding/submit", {
        method: "POST"
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const friendly = getFriendlySubmitError(j, tr);
        setError(friendly);

        if (friendly === tr.pendingText) {
          setStatus("PENDING_VERIFICATION");
        }
        return;
      }

      setStatus("PENDING_VERIFICATION");
      setSuccess(tr.success);

      window.setTimeout(() => {
        window.location.href = "/psychologists/onboarding/profile";
      }, 1200);
    } catch (e: any) {
      setError(e?.message || tr.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  function UploadCard({
    docType,
    title,
    hint,
    uploadedDoc
  }: {
    docType: DocType;
    title: string;
    hint: string;
    uploadedDoc: UploadedDoc | null;
  }) {
    const uploaded = !!uploadedDoc;
    const ext = uploadedDoc ? fileExtension(uploadedDoc.fileName) || tr.unknownFormat : "";

    return (
      <div className="rounded-3xl border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{hint}</p>
          </div>

          {uploaded && (
            <div className="rounded-full border bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {tr.uploaded}
            </div>
          )}
        </div>

        {uploaded && uploadedDoc && (
          <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm">
            <div className="font-medium text-gray-900">{uploadedDoc.fileName}</div>
            <div className="mt-1 text-gray-600">
              {tr.format}: {ext}
            </div>
            <a
              href={uploadedDoc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-xl border px-3 py-2 hover:bg-white"
            >
              {tr.open}
            </a>
          </div>
        )}

        {!isPendingVerification && (
          <div className="mt-5">
            <label className="inline-flex cursor-pointer items-center rounded-2xl border px-4 py-3 hover:bg-gray-50">
              <span>{uploadingType === docType ? tr.uploading : uploaded ? tr.replace : tr.choose}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleUpload(docType, e.target.files?.[0] || null)}
                disabled={uploadingType !== null}
              />
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">IvixHUB</div>
        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{tr.subtitle}</p>

        {loading ? (
          <div className="mt-8 rounded-2xl border bg-gray-50 p-4 text-sm text-gray-700">
            {tr.loading}
          </div>
        ) : authRequired ? (
          <div className="mt-8 rounded-2xl border bg-amber-50 p-5 text-sm text-amber-900">
            <div>{tr.authRequired}</div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/login?role=psychologist"
                className="inline-flex justify-center rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90"
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
        ) : isPendingVerification ? (
          <div className="mt-8 rounded-3xl border bg-blue-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">{tr.pendingTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{tr.pendingText}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tr.pendingHint}</p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/psychologists/onboarding/profile"
                className="inline-flex justify-center rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90"
              >
                {tr.profileStatus}
              </Link>
              <Link
                href="/pro"
                className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
              >
                {tr.dashboard}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {success && (
              <div className="mt-8 rounded-2xl border bg-green-50 p-4 text-sm text-green-800">
                {success}
              </div>
            )}

            {error && (
              <div className="mt-8 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
                <b>{tr.error}:</b> {error}
              </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <UploadCard
                docType="DIPLOMA"
                title={tr.diploma}
                hint={tr.diplomaHint}
                uploadedDoc={diplomaDoc}
              />
              <UploadCard
                docType="ID_CARD"
                title={tr.idCard}
                hint={tr.idHint}
                uploadedDoc={idDoc}
              />
              <UploadCard
                docType="PROFILE_PHOTO"
                title={tr.photo}
                hint={tr.photoHint}
                uploadedDoc={photoDoc}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={submitOnboarding}
                disabled={submitting}
                className="inline-flex justify-center rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-50"
              >
                {submitting ? tr.submitting : tr.submit}
              </button>

              <Link
                href="/psychologists/onboarding/profile"
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
      </div>
    </main>
  );
}
