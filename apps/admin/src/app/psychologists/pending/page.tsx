import Link from "next/link";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import {
  adminFetch,
  type PendingPsychologistResponse,
  fmtDateTime,
  shortText,
  statusTone
} from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

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

function QueueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 7h13M7 12h13M7 17h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="4" cy="7" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="17" r="1" fill="currentColor" />
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
        d="M9 7V5h6v2M4 12h16M10 12v2h4v-2"
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function PendingPsychologistsPage() {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const tr = adminT(lang);

  let items: PendingPsychologistResponse[] = [];
  let error: string | null = null;

  try {
    items = await adminFetch<PendingPsychologistResponse[]>(
      "/api/admin/psychologists/pending"
    );
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Failed to load pending psychologists";
  }

  return (
    <AdminShell
      lang={lang}
      title={tr.pendingPageTitle}
      subtitle={tr.pendingPageSubtitle}
    >
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-[22px] border border-rose-200/70 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 font-bold">
            !
          </div>
          <div className="pt-1.5">
            <b>{tr.error}:</b> {error}
          </div>
        </div>
      )}

      {!error && (
        <>
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] sm:p-6">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#078b7b] to-[#12b8c4]" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
                  <QueueIcon />
                </div>

                <div className="rounded-full bg-[#edf9f8] px-3 py-1 text-xs font-semibold text-[#078b7b]">
                  Moderation
                </div>
              </div>

              <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
                {tr.pendingPsychologists}
              </div>

              <div className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
                {items.length}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] sm:p-6">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#3977e8] to-[#12b8c4]" />

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#3977e8]">
                <CheckIcon />
              </div>

              <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
                {tr.phoneVerified}
              </div>

              <div className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
                {items.filter((item) => item.phoneVerified).length}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] sm:col-span-2 sm:p-6 xl:col-span-1">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#7657df] to-[#3977e8]" />

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1edff] text-[#7657df]">
                <ExperienceIcon />
              </div>

              <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
                {tr.experience}
              </div>

              <div className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                {tr.pendingPageSubtitle}
              </div>
            </div>
          </section>

          {items.length === 0 ? (
            <section className="rounded-[28px] border border-[#073f43]/8 bg-white px-6 py-16 text-center shadow-[0_14px_40px_rgba(7,63,67,.06)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#e8f8f6] text-[#078b7b]">
                <CheckIcon />
              </div>

              <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#073f43]">
                {tr.noPendingPage}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#789092]">
                IviXHub moderation queue is currently clear.
              </p>
            </section>
          ) : (
            <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
              <div className="flex flex-col gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
                    <QueueIcon />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                      {tr.pendingPsychologists}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#789092]">
                      {items.length} · IviXHub moderation queue
                    </p>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf9f8] px-3 py-1.5 text-xs font-semibold text-[#078b7b]">
                  <span className="h-2 w-2 rounded-full bg-[#12b8c4]" />
                  {items.length} pending
                </div>
              </div>

              <div className="divide-y divide-[#073f43]/6">
                {items.map((item) => (
                  <article
                    key={item.psychologistId}
                    className="group relative px-5 py-6 transition duration-200 hover:bg-[#f9fcfc] sm:px-6"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#e7f8f6] to-[#edf3ff] text-[#078b7b]">
                            <UserIcon />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                                {tr.psychologist} #{item.psychologistId}
                              </h3>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusTone(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </div>

                            <div className="mt-1 text-xs font-medium text-[#91a3a5]">
                              {tr.userId} #{item.userId}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-[#f7fafb] px-3.5 py-3">
                            <span className="text-[#078b7b]">
                              <MailIcon />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#91a3a5]">
                                {tr.email}
                              </div>
                              <div className="mt-0.5 truncate text-sm font-medium text-[#315e61]">
                                {item.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-[#f7fafb] px-3.5 py-3">
                            <span className="text-[#3977e8]">
                              <PhoneIcon />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#91a3a5]">
                                {tr.phone}
                              </div>
                              <div className="mt-0.5 truncate text-sm font-medium text-[#315e61]">
                                {item.phone || "—"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 rounded-2xl bg-[#f7fafb] px-3.5 py-3">
                            <span className="text-[#7657df]">
                              <CheckIcon />
                            </span>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#91a3a5]">
                                {tr.phoneVerified}
                              </div>
                              <div className="mt-0.5 text-sm font-medium text-[#315e61]">
                                {item.phoneVerified ? tr.yes : tr.no}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 rounded-2xl bg-[#f7fafb] px-3.5 py-3">
                            <span className="text-[#078b7b]">
                              <ExperienceIcon />
                            </span>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#91a3a5]">
                                {tr.experience}
                              </div>
                              <div className="mt-0.5 text-sm font-medium text-[#315e61]">
                                {item.experienceYears} {tr.years}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 rounded-2xl bg-[#f7fafb] px-3.5 py-3 sm:col-span-2">
                            <span className="text-[#3977e8]">
                              <ClockIcon />
                            </span>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#91a3a5]">
                                {tr.submitted}
                              </div>
                              <div className="mt-0.5 text-sm font-medium text-[#315e61]">
                                {fmtDateTime(item.submittedAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {item.bio && (
                          <div className="mt-4 rounded-2xl border border-[#073f43]/6 bg-[#fbfdfd] px-4 py-3.5">
                            <p className="text-sm leading-6 text-[#607d80]">
                              {shortText(item.bio, 240)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="xl:pt-1">
                        <Link
                          href={`/psychologists/pending/${item.psychologistId}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#073f43] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,63,67,.17)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#078b7b] xl:w-auto"
                        >
                          {tr.openModeration}
                          <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AdminShell>
  );
}
