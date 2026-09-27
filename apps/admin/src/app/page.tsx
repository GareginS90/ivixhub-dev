import Link from "next/link";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import {
  adminFetch,
  type AuditEvent,
  type PendingPsychologistResponse,
  fmtDateTime,
  shortText
} from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

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

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M9.5 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 8c.7-3.6 2.8-5.5 6-5.5s5.3 1.9 6 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 5.5a3.5 3.5 0 0 1 0 6.8M17 15c2.1.6 3.3 2.2 3.8 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M3 12h4l2.2-6 4.2 12 2.2-6H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 5h14v14H5V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 5v14M9 10h10M9 15h10"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 3 19 6v5c0 4.5-2.7 8-7 10-4.3-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
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
        d="M12 8v4l2.8 1.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const tr = adminT(lang);

  let pending: PendingPsychologistResponse[] = [];
  let audit: AuditEvent[] = [];
  let error: string | null = null;

  try {
    [pending, audit] = await Promise.all([
      adminFetch<PendingPsychologistResponse[]>("/api/admin/psychologists/pending"),
      adminFetch<AuditEvent[]>("/api/admin/audit")
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load admin dashboard";
  }

  const latestAudit = audit.slice(0, 5);

  const stats = [
    {
      label: tr.pendingPsychologists,
      value: String(pending.length),
      helper: tr.openModerationQueue,
      href: "/psychologists/pending",
      icon: <UsersIcon />,
      iconClass: "bg-[#e8f8f6] text-[#078b7b]",
      accentClass: "from-[#078b7b] to-[#12b8c4]"
    },
    {
      label: tr.auditEventsLoaded,
      value: String(audit.length),
      helper: tr.openAuditLog,
      href: "/audit",
      icon: <ActivityIcon />,
      iconClass: "bg-[#edf3ff] text-[#3977e8]",
      accentClass: "from-[#3977e8] to-[#12b8c4]"
    },
    {
      label: tr.catalogManagement,
      value: tr.methodsAndSpecs,
      helper: tr.openCatalog,
      href: "/catalog",
      icon: <CatalogIcon />,
      iconClass: "bg-[#f1edff] text-[#7657df]",
      accentClass: "from-[#7657df] to-[#3977e8]"
    }
  ];

  return (
    <AdminShell
      lang={lang}
      title={tr.dashboardTitle}
      subtitle={tr.dashboardSubtitle}
    >
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-[22px] border border-rose-200/70 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 font-bold">
            !
          </div>
          <div className="pt-1.5">
            <b>{tr.error}:</b> {error}
          </div>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="group relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] transition duration-300 hover:-translate-y-1 hover:border-[#12b8c4]/25 hover:shadow-[0_20px_45px_rgba(7,63,67,.10)] sm:p-6"
          >
            <div
              className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${stat.accentClass} opacity-80`}
            />

            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconClass}`}
              >
                {stat.icon}
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#073f43]/8 text-[#789092] transition duration-200 group-hover:border-[#12b8c4]/25 group-hover:bg-[#eefafa] group-hover:text-[#078b7b]">
                <ArrowIcon />
              </span>
            </div>

            <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.11em] text-[#789092]">
              {stat.label}
            </div>

            <div
              className={`mt-2 font-semibold tracking-[-0.03em] text-[#073f43] ${
                stat.href === "/catalog"
                  ? "min-h-[40px] text-xl leading-6"
                  : "text-[34px] leading-none"
              }`}
            >
              {stat.value}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#078b7b]">
              {stat.helper}
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
        <div className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
          <div className="flex flex-col gap-4 border-b border-[#073f43]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f8f6] text-[#078b7b]">
                  <UsersIcon />
                </div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                  {tr.pendingPsychologists}
                </h2>
              </div>

              <p className="mt-2 text-sm text-[#789092]">
                {pending.length === 0
                  ? tr.noPendingPsychologists
                  : `${pending.length} ${tr.pendingPsychologists.toLowerCase()}`}
              </p>
            </div>

            <Link
              href="/psychologists/pending"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#073f43]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#073f43] transition hover:border-[#12b8c4]/30 hover:bg-[#f3fbfb] hover:text-[#078b7b]"
            >
              {tr.viewAll}
              <ArrowIcon />
            </Link>
          </div>

          {pending.length === 0 ? (
            <div className="px-5 py-12 sm:px-6">
              <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#edf9f8] text-[#078b7b]">
                  <ShieldIcon />
                </div>
                <h3 className="mt-4 font-semibold text-[#073f43]">
                  {tr.noPendingPsychologists}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#789092]">
                  IviXHub moderation queue is currently clear.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#073f43]/6">
              {pending.slice(0, 6).map((item) => (
                <div
                  key={item.psychologistId}
                  className="group px-5 py-5 transition hover:bg-[#f8fcfc] sm:px-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e7f8f6] to-[#edf3ff] text-sm font-bold text-[#078b7b]">
                          {item.psychologistId}
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-[#073f43]">
                            {tr.psychologist} #{item.psychologistId}
                          </div>
                          <div className="mt-0.5 truncate text-sm text-[#789092]">
                            {item.email}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#607d80]">
                        <span>
                          {tr.experienceYears}:{" "}
                          <b className="font-semibold text-[#073f43]">
                            {item.experienceYears} {tr.years}
                          </b>
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <ClockIcon />
                          {fmtDateTime(item.submittedAt)}
                        </span>
                      </div>

                      {item.bio && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607d80]">
                          {shortText(item.bio, 180)}
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/psychologists/pending/${item.psychologistId}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#073f43] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(7,63,67,.16)] transition hover:-translate-y-0.5 hover:bg-[#078b7b]"
                    >
                      {tr.review}
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#073f43]/7 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3977e8]">
                <ActivityIcon />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                  {tr.latestAuditEvents}
                </h2>
                <div className="mt-0.5 text-xs text-[#789092]">
                  IviXHub system activity
                </div>
              </div>
            </div>

            <Link
              href="/audit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#073f43]/9 text-[#607d80] transition hover:border-[#3977e8]/25 hover:bg-[#f3f6ff] hover:text-[#3977e8]"
              aria-label={tr.viewAll}
            >
              <ArrowIcon />
            </Link>
          </div>

          {latestAudit.length === 0 ? (
            <div className="px-5 py-12 sm:px-6">
              <div className="mx-auto max-w-xs text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f0f4ff] text-[#3977e8]">
                  <ActivityIcon />
                </div>
                <h3 className="mt-4 font-semibold text-[#073f43]">
                  {tr.noAuditEvents}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#789092]">
                  New administration activity will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5 py-2 sm:px-6">
              {latestAudit.map((event, index) => (
                <div
                  key={event.id}
                  className={`relative flex gap-4 py-4 ${
                    index !== latestAudit.length - 1
                      ? "border-b border-[#073f43]/6"
                      : ""
                  }`}
                >
                  <div className="relative mt-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1edff] text-[#7657df]">
                      <ShieldIcon />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[#073f43]">
                      {event.action}
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#607d80]">
                      {event.details || tr.noDetails}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#91a3a5]">
                      <span>#{event.id}</span>
                      <span className="h-1 w-1 rounded-full bg-[#b5c3c4]" />
                      <span>{fmtDateTime(event.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/audit"
                className="mb-4 mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#f6f9fa] px-4 py-3 text-sm font-semibold text-[#456b6e] transition hover:bg-[#edf7f7] hover:text-[#078b7b]"
              >
                {tr.viewAll}
                <ArrowIcon />
              </Link>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
