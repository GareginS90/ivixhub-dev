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

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M19 12H5m5 5-5-5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 20c.8-3.6 3.3-5.5 7.5-5.5s6.7 1.9 7.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m5 7 7 6 7-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M8 4 5.5 5.5c-.8.8-.6 2.8.5 5.1 1.4 3 3.8 5.4 6.8 6.8 2.3 1.1 4.3 1.3 5.1.5L20 15.8l-4-2-1.6 1.6c-.4.4-1.5 0-2.8-.8a13.8 13.8 0 0 1-3.2-3.2c-.8-1.3-1.2-2.4-.8-2.8L9.2 7 8 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect
        x="4"
        y="7"
        width="16"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 7V5h6v2M4 12h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 3h7l4 4v14H7V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h4M10 13h5M10 17h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M14 5h5v5M19 5l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DataCard({
  icon,
  label,
  value,
  wide = false
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-start gap-3 rounded-[20px] border border-[#073f43]/6 bg-[#f8fbfb] p-4 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#078b7b] shadow-sm ring-1 ring-[#073f43]/6">
        {icon}
      </div>

      <div className="min-w-0 pt-0.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#91a3a5]">
          {label}
        </div>
        <div className="mt-1 break-words text-sm font-semibold leading-5 text-[#315e61]">
          {value}
        </div>
      </div>
    </div>
  );
}

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
      adminFetch<PendingPsychologistResponse[]>(
        "/api/admin/psychologists/pending"
      ),
      adminFetch<PsychologistDocument[]>(
        `/api/admin/psychologists/${encodeURIComponent(id)}/documents`
      )
    ]);
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "Failed to load psychologist moderation data";
  }

  const item =
    pendingList.find((x) => x.psychologistId === psychologistId) || null;

  return (
    <AdminShell
      lang={lang}
      title={`${tr.moderationTitlePrefix} #${id}`}
      subtitle={tr.moderationSubtitle}
    >
      <div className="mb-5">
        <Link
          href="/psychologists/pending"
          className="inline-flex items-center gap-2 rounded-xl border border-[#073f43]/9 bg-white px-4 py-2.5 text-sm font-semibold text-[#456b6e] shadow-sm transition hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:bg-[#f4fbfb] hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.backToPending}
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-[22px] border border-rose-200/70 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 font-bold">
            !
          </div>
          <div className="pt-1.5">
            <b>{tr.error}:</b> {error}
          </div>
        </div>
      )}

      {!error && !item && (
        <div className="rounded-[28px] border border-[#073f43]/8 bg-white px-6 py-14 text-center shadow-[0_14px_40px_rgba(7,63,67,.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f1edff] text-[#7657df]">
            <UserIcon />
          </div>
          <div className="mt-4 font-semibold text-[#073f43]">
            {tr.notFoundInPending}
          </div>
        </div>
      )}

      {!error && item && (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
          <div className="min-w-0 space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
              <div className="relative overflow-hidden border-b border-[#073f43]/7 px-5 py-5 sm:px-6">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 90% 10%, rgba(18,184,196,.10), transparent 36%), radial-gradient(circle at 100% 100%, rgba(57,119,232,.07), transparent 38%)"
                  }}
                />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#e7f8f6] to-[#edf3ff] text-[#078b7b]">
                      <UserIcon />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                        {tr.applicationOverview}
                      </h2>
                      <div className="mt-0.5 text-xs font-medium text-[#789092]">
                        {tr.psychologist} #{item.psychologistId}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${statusTone(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <DataCard
                    icon={<UserIcon />}
                    label={tr.psychologistId}
                    value={`#${item.psychologistId}`}
                  />

                  <DataCard
                    icon={<UserIcon />}
                    label={tr.userId}
                    value={`#${item.userId}`}
                  />

                  <DataCard
                    icon={<MailIcon />}
                    label={tr.email}
                    value={item.email}
                  />

                  <DataCard
                    icon={<PhoneIcon />}
                    label={tr.phone}
                    value={item.phone || "—"}
                  />

                  <DataCard
                    icon={<CheckIcon />}
                    label={tr.phoneVerified}
                    value={
                      <span
                        className={
                          item.phoneVerified
                            ? "text-[#078b7b]"
                            : "text-amber-600"
                        }
                      >
                        {item.phoneVerified ? tr.yes : tr.no}
                      </span>
                    }
                  />

                  <DataCard
                    icon={<ExperienceIcon />}
                    label={tr.experience}
                    value={`${item.experienceYears} ${tr.years}`}
                  />

                  <DataCard
                    icon={<ClockIcon />}
                    label={tr.submitted}
                    value={fmtDateTime(item.submittedAt)}
                    wide
                  />
                </div>

                <div className="mt-5 rounded-[22px] border border-[#073f43]/7 bg-[#fbfdfd] p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#078b7b]">
                      <UserIcon />
                    </span>
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#789092]">
                      {tr.bio}
                    </div>
                  </div>

                  <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#456b6e]">
                    {shortText(item.bio, 500)}
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
              <div className="flex flex-col gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1edff] text-[#7657df]">
                    <FileIcon />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                      {tr.uploadedDocuments}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#789092]">
                      IviXHub verification documents
                    </p>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center rounded-full bg-[#f3f0ff] px-3 py-1.5 text-xs font-semibold text-[#7657df]">
                  {documents.length}
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="px-5 py-12 text-center sm:px-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f3f0ff] text-[#7657df]">
                    <FileIcon />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-[#073f43]">
                    {tr.noDocuments}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#073f43]/6">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-[#fafcfc] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3f0ff] text-[#7657df]">
                          <FileIcon />
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-[#073f43]">
                            {doc.docType}
                          </div>
                          <div className="mt-1 break-all text-sm text-[#607d80]">
                            {doc.fileName}
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#91a3a5]">
                            <ClockIcon />
                            {tr.uploaded}: {fmtDateTime(doc.uploadedAt)}
                          </div>
                        </div>
                      </div>

                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#073f43]/9 bg-white px-4 py-2.5 text-sm font-semibold text-[#456b6e] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7657df]/25 hover:bg-[#f7f4ff] hover:text-[#7657df]"
                      >
                        {tr.openFile}
                        <ExternalIcon />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <ModerationActions psychologistId={psychologistId} lang={lang} />
        </div>
      )}
    </AdminShell>
  );
}
