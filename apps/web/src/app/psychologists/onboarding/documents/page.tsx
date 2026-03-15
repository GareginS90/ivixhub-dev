"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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
    photoHint: "JPG, PNG или WEBP, до 5MB. Фото должно быть корректным портретом специалиста.",
    choose: "Выбрать файл",
    replace: "Заменить файл",
    uploading: "Загрузка...",
    uploaded: "Загружено",
    submit: "Отправить на проверку",
    submitting: "Отправка...",
    back: "Назад к профилю",
    deleteAccount: "Удалить аккаунт",
    deleteAccount: "Удалить аккаунт",
    success: "Onboarding отправлен на модерацию.",
    loadError: "Не удалось загрузить список документов.",
    uploadError: "Не удалось загрузить файл.",
    submitError: "Не удалось отправить onboarding.",
    requiredMissing: "Загрузите диплом, удостоверение личности и фото профиля.",
    open: "Открыть",
    format: "Формат",
    uploadOk: "Файл успешно загружен.",
    error: "Ошибка",
    unknownFormat: "Неизвестный формат",
    photoDbError: "Фото профиля пока не удалось сохранить. Мы уже исправили схему, попробуйте загрузить фото ещё раз.",
    authError: "Нужно снова войти в аккаунт.",
    genericUploadError: "Не удалось загрузить файл. Проверьте формат и размер файла и попробуйте ещё раз."
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
    photoHint: "JPG, PNG or WEBP, up to 5MB. The photo must be a valid portrait of the specialist.",
    choose: "Choose file",
    replace: "Replace file",
    uploading: "Uploading...",
    uploaded: "Uploaded",
    submit: "Submit for review",
    submitting: "Submitting...",
    back: "Back to profile",
    deleteAccount: "Delete account",
    deleteAccount: "Delete account",
    success: "Onboarding has been submitted for moderation.",
    loadError: "Failed to load documents list.",
    uploadError: "Failed to upload file.",
    submitError: "Failed to submit onboarding.",
    requiredMissing: "Upload diploma, identity document, and profile photo.",
    open: "Open",
    format: "Format",
    uploadOk: "File uploaded successfully.",
    error: "Error",
    unknownFormat: "Unknown format",
    photoDbError: "The profile photo could not be saved yet. The schema fix is ready, please try uploading the photo again.",
    authError: "Please sign in again.",
    genericUploadError: "Failed to upload file. Check the file format and size, then try again."
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
    photoHint: "JPG, PNG կամ WEBP, մինչև 5MB։ Լուսանկարը պետք է լինի մասնագետի ճիշտ դիմանկար։",
    choose: "Ընտրել ֆայլ",
    replace: "Փոխարինել ֆայլը",
    uploading: "Բեռնվում է...",
    uploaded: "Բեռնված է",
    submit: "Ուղարկել ստուգման",
    submitting: "Ուղարկվում է...",
    back: "Վերադառնալ պրոֆիլ",
    deleteAccount: "Հեռացնել հաշիվը",
    deleteAccount: "Հեռացնել հաշիվը",
    success: "Onboarding-ը ուղարկվել է մոդերացիայի։",
    loadError: "Չհաջողվեց բեռնել փաստաթղթերի ցանկը։",
    uploadError: "Չհաջողվեց բեռնել ֆայլը։",
    submitError: "Չհաջողվեց ուղարկել onboarding-ը։",
    requiredMissing: "Բեռնեք դիպլոմը, անձը հաստատող փաստաթուղթը և պրոֆիլի լուսանկարը։",
    open: "Բացել",
    format: "Ֆորմատ",
    uploadOk: "Ֆայլը հաջողությամբ բեռնվել է։",
    error: "Սխալ",
    unknownFormat: "Անհայտ ֆորմատ",
    photoDbError: "Պրոֆիլի լուսանկարը դեռ չհաջողվեց պահպանել։ Սխեման արդեն ուղղված է, փորձեք նորից բեռնել լուսանկարը։",
    authError: "Պետք է նորից մուտք գործել հաշիվ։",
    genericUploadError: "Չհաջողվեց բեռնել ֆայլը։ Ստուգեք ֆորմատն ու չափը և փորձեք կրկին։"
  }
} as const;

function fileExtension(name: string) {
  const idx = name.lastIndexOf(".");
  if (idx === -1) return "";
  return name.slice(idx + 1).toUpperCase();
}

function docLabel(tr: typeof TXT[Lang], type: DocType) {
  if (type === "DIPLOMA") return tr.diploma;
  if (type === "ID_CARD") return tr.idCard;
  return tr.photo;
}

function getFriendlyError(payload: any, tr: typeof TXT[Lang]) {
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

export default function PsychologistOnboardingDocumentsPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<DocType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const syncLang = () => setLang(getUiLangFromCookie());
    syncLang();
    const timer = window.setInterval(syncLang, 700);
    return () => window.clearInterval(timer);
  }, []);

  const tr = TXT[lang];

  async function loadDocs() {
    try {
      setLoading(true);
      setError(null);

      const r = await fetch("/api/psychologists/documents", { cache: "no-store" as any });
      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.loadError);
        return;
      }

      setDocs(Array.isArray(j) ? j : []);
    } catch (e: any) {
      setError(e?.message || tr.loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  const diplomaDoc = useMemo(() => docs.find((d) => d.docType === "DIPLOMA") || null, [docs]);
  const idDoc = useMemo(() => docs.find((d) => d.docType === "ID_CARD") || null, [docs]);
  const photoDoc = useMemo(() => docs.find((d) => d.docType === "PROFILE_PHOTO") || null, [docs]);

  async function handleUpload(docType: DocType, file: File | null) {
    if (!file) return;

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
        setError(getFriendlyError(j, tr));
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
        setError(j?.message || tr.submitError);
        return;
      }

      setSuccess(tr.success);
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
      <div className="rounded-2xl border bg-slate-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">{title}</div>
            <div className="mt-1 text-sm text-gray-600">{hint}</div>
          </div>

          {uploaded && (
            <div className="rounded-xl bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              {tr.uploaded}
            </div>
          )}
        </div>

        {uploaded && uploadedDoc && (
          <div className="mt-4 rounded-2xl border bg-white p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="text-lg leading-none">📎</div>
              <div className="min-w-0 flex-1">
                <div className="font-medium break-all">{uploadedDoc.fileName}</div>
                <div className="mt-1 text-gray-600">
                  {tr.format}: {ext}
                </div>
              </div>
              <a
                href={uploadedDoc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
              >
                {tr.open}
              </a>
            </div>
          </div>
        )}

        <label className="mt-4 inline-flex cursor-pointer justify-center rounded-2xl border px-4 py-3 hover:bg-white">
          {uploadingType === docType
            ? tr.uploading
            : uploaded
              ? tr.replace
              : tr.choose}
          <input
            type="file"
            className="hidden"
            accept={
              docType === "PROFILE_PHOTO"
                ? ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                : ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleUpload(docType, e.target.files?.[0] || null)
            }
            disabled={uploadingType !== null}
          />
        </label>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-sm text-gray-500">IvixHUB</div>
        <h1 className="mt-3 text-3xl font-semibold">{tr.title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{tr.subtitle}</p>

        {loading ? (
          <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-sm text-gray-700">
            Loading...
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4">
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

            {success && (
              <div className="mt-6 rounded-2xl border bg-green-50 p-4 text-sm text-green-800">
                {success}
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
                onClick={submitOnboarding}
                disabled={submitting || uploadingType !== null}
                className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90 disabled:opacity-50"
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
