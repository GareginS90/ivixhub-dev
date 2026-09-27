import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, type AuditEvent, fmtDateTime } from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

function AuditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 3h12v18H6V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8h6M9 12h6M9 16h4"
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
        d="M4 12h4l2-5 4 10 2-5h4"
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
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 20c.7-3.3 3-5 7-5s6.3 1.7 7 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EntityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M10 7h4a3 3 0 0 1 3 3v4M14 17h-4a3 3 0 0 1-3-3v-4"
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

function DetailsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 6h14M5 12h14M5 18h9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetaItem({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#073f43]/6 bg-[#f8fbfb] px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#078b7b] shadow-sm ring-1 ring-[#073f43]/5">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#91a3a5]">
          {label}
        </div>
        <div className="mt-0.5 truncate text-xs font-semibold text-[#315e61]">
          {value}
        </div>
      </div>
    </div>
  );
}

export default async function AuditPage() {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const tr = adminT(lang);

  let items: AuditEvent[] = [];
  let error: string | null = null;

  try {
    items = await adminFetch<AuditEvent[]>("/api/admin/audit");
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load audit";
  }

  const actorCount = new Set(
    items
      .map((item) => item.actorUserId)
      .filter((value) => value !== null && value !== undefined)
  ).size;

  const entityCount = new Set(
    items
      .map((item) => item.entityType)
      .filter((value): value is string => Boolean(value))
  ).size;

  return (
    <AdminShell
      lang={lang}
      title={tr.auditTitle}
      subtitle={tr.auditSubtitle}
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
          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)]">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#078b7b] to-[#12b8c4]" />

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
                <ActivityIcon />
              </div>

              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
                Events
              </div>

              <div className="mt-1.5 text-[32px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
                {items.length}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)]">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#3977e8] to-[#12b8c4]" />

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#3977e8]">
                <UserIcon />
              </div>

              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
                Actors
              </div>

              <div className="mt-1.5 text-[32px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
                {actorCount}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)]">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#7657df] to-[#3977e8]" />

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1edff] text-[#7657df]">
                <EntityIcon />
              </div>

              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
                Entity types
              </div>

              <div className="mt-1.5 text-[32px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
                {entityCount}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
            <div className="flex flex-col gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
                  <AuditIcon />
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                    {tr.auditTitle}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#789092]">
                    IviXHub administration activity
                  </p>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf9f8] px-3 py-1.5 text-xs font-semibold text-[#078b7b]">
                <span className="h-2 w-2 rounded-full bg-[#12b8c4]" />
                {items.length} events
              </div>
            </div>

            {items.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eef8f7] text-[#078b7b]">
                  <AuditIcon />
                </div>
                <div className="mt-4 text-sm font-semibold text-[#073f43]">
                  {tr.noAuditFound}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#073f43]/6">
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    className="group relative px-5 py-5 transition duration-200 hover:bg-[#fbfdfd] sm:px-6 sm:py-6"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="relative hidden shrink-0 sm:block">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f8f6] to-[#edf3ff] text-[#078b7b] ring-1 ring-[#073f43]/5">
                          <ActivityIcon />
                        </div>

                        {index < items.length - 1 && (
                          <div className="absolute left-1/2 top-12 h-[calc(100%+12px)] w-px -translate-x-1/2 bg-gradient-to-b from-[#12b8c4]/25 to-transparent" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words text-base font-semibold tracking-[-0.015em] text-[#073f43] sm:text-lg">
                                {item.action}
                              </h3>

                              <span className="rounded-full border border-[#073f43]/7 bg-[#f5f9f9] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#607d80]">
                                #{item.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#789092]">
                            <ClockIcon />
                            {fmtDateTime(item.createdAt)}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                          <MetaItem
                            icon={<AuditIcon />}
                            label={tr.eventId}
                            value={`#${item.id}`}
                          />

                          <MetaItem
                            icon={<UserIcon />}
                            label={tr.actorUserId}
                            value={
                              item.actorUserId !== null &&
                              item.actorUserId !== undefined
                                ? `#${item.actorUserId}`
                                : "—"
                            }
                          />

                          <MetaItem
                            icon={<EntityIcon />}
                            label={tr.entityType}
                            value={item.entityType || "—"}
                          />

                          <MetaItem
                            icon={<EntityIcon />}
                            label={tr.entityId}
                            value={
                              item.entityId !== null &&
                              item.entityId !== undefined
                                ? `#${item.entityId}`
                                : "—"
                            }
                          />
                        </div>

                        <div className="mt-3 flex items-start gap-3 rounded-[18px] border border-[#073f43]/6 bg-[#f8fbfb] px-4 py-3.5">
                          <div className="mt-0.5 shrink-0 text-[#789092]">
                            <DetailsIcon />
                          </div>

                          <div className="min-w-0 text-sm leading-6 text-[#607d80]">
                            {item.details || tr.noDetails}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
}
