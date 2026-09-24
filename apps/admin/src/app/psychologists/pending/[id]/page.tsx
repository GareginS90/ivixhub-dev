import Link from "next/link";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import ModerationActions from "@/components/admin/ModerationActions";
import {
  adminFetch,
  type PendingPsychologistResponse,
  type PsychologistDocument,
  fmtDateTime,
  shortText,
  statusTone
} from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

export default async function PendingPsychologistDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const tr = adminT(lang);

  const { id } = await params;
  const psychologistId = Number(id);

  let pendingList: PendingPsychologistResponse[] = [];
  let documents: PsychologistDocument[] = [];
  let error: string | null = null;

  try {
    [pendingList, documents] = await Promise.all([
      adminFetch<PendingPsychologistResponse[]>("/api/admin/psychologists/pending"),
      adminFetch<PsychologistDocument[]>(
        `/api/admin/psychologists/${encodeURIComponent(id)}/documents`
      )
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load psychologist moderation data";
  }

  const item =
    pendingList.find((x) => x.psychologistId === psychologistId) || null;

  return (
    <AdminShell
      lang={lang}
      title={`${tr.moderationTitlePrefix} #${id}`}
      subtitle={tr.moderationSubtitle}
    >
      <Link
        href="/psychologists/pending"
        className="mb-4 inline-flex rounded-2xl border bg-white px-4 py-3 text-sm hover:bg-slate-50"
      >
        {tr.backToPending}
      </Link>

      {error && (
        <div className="rounded-3xl border bg-rose-50 p-5 text-sm text-rose-800">
          <b>{tr.error}:</b> {error}
        </div>
      )}

      {!error && !item && (
        <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm text-slate-600">
          {tr.notFoundInPending}
        </div>
      )}

      {!error && item && (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-900">
                  {tr.applicationOverview}
                </h2>
                <span className={`rounded-full border px-3 py-1 text-xs ${statusTone(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{tr.psychologistId}</div>
                  <div className="mt-1 font-medium text-slate-900">{item.psychologistId}</div>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{tr.userId}</div>
                  <div className="mt-1 font-medium text-slate-900">{item.userId}</div>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{tr.email}</div>
                  <div className="mt-1 font-medium break-all text-slate-900">{item.email}</div>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{tr.phone}</div>
                  <div className="mt-1 font-medium text-slate-900">{item.phone || "—"}</div>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{tr.phoneVerified}</div>
                  <div className="mt-1 font-medium text-slate-900">
                    {item.phoneVerified ? tr.yes : tr.no}
                  </div>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{tr.experience}</div>
                  <div className="mt-1 font-medium text-slate-900">
                    {item.experienceYears} {tr.years}
                  </div>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4 sm:col-span-2">
                  <div className="text-xs text-slate-500">{tr.submitted}</div>
                  <div className="mt-1 font-medium text-slate-900">
                    {fmtDateTime(item.submittedAt)}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{tr.bio}</div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                  {shortText(item.bio, 500)}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{tr.uploadedDocuments}</h2>

              {documents.length === 0 ? (
                <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                  {tr.noDocuments}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="rounded-2xl border bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900">{doc.docType}</div>
                          <div className="mt-1 break-all text-sm text-slate-600">
                            {doc.fileName}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            {tr.uploaded}: {fmtDateTime(doc.uploadedAt)}
                          </div>
                        </div>

                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 rounded-2xl border bg-white px-4 py-2 text-sm hover:bg-slate-50"
                        >
                          {tr.openFile}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div>
            <ModerationActions psychologistId={psychologistId} lang={lang} />
          </div>
        </div>
      )}
    </AdminShell>
  );
}
