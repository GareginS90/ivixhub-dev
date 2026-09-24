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

  return (
    <AdminShell
      lang={lang}
      title={tr.dashboardTitle}
      subtitle={tr.dashboardSubtitle}
    >
      {error && (
        <div className="rounded-3xl border bg-rose-50 p-5 text-sm text-rose-800">
          <b>{tr.error}:</b> {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">{tr.pendingPsychologists}</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{pending.length}</div>
          <Link
            href="/psychologists/pending"
            className="mt-4 inline-flex rounded-2xl border px-4 py-2 text-sm hover:bg-slate-50"
          >
            {tr.openModerationQueue}
          </Link>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">{tr.auditEventsLoaded}</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{audit.length}</div>
          <Link
            href="/audit"
            className="mt-4 inline-flex rounded-2xl border px-4 py-2 text-sm hover:bg-slate-50"
          >
            {tr.openAuditLog}
          </Link>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">{tr.catalogManagement}</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">
            {tr.methodsAndSpecs}
          </div>
          <Link
            href="/catalog"
            className="mt-4 inline-flex rounded-2xl border px-4 py-2 text-sm hover:bg-slate-50"
          >
            {tr.openCatalog}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">{tr.pendingPsychologists}</h2>
            <Link
              href="/psychologists/pending"
              className="rounded-2xl border px-4 py-2 text-sm hover:bg-slate-50"
            >
              {tr.viewAll}
            </Link>
          </div>

          {pending.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
              {tr.noPendingPsychologists}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {pending.slice(0, 6).map((item) => (
                <div key={item.psychologistId} className="rounded-2xl border bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">
                        {tr.psychologist} #{item.psychologistId}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{item.email}</div>
                    </div>

                    <Link
                      href={`/psychologists/pending/${item.psychologistId}`}
                      className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                    >
                      {tr.review}
                    </Link>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <div>{tr.experienceYears}: <b>{item.experienceYears}</b> {tr.years}</div>
                    <div>{tr.submittedAt}: <b>{fmtDateTime(item.submittedAt)}</b></div>
                  </div>

                  <div className="mt-3 text-sm text-slate-600">
                    {shortText(item.bio, 180)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">{tr.latestAuditEvents}</h2>
            <Link
              href="/audit"
              className="rounded-2xl border px-4 py-2 text-sm hover:bg-slate-50"
            >
              {tr.viewAll}
            </Link>
          </div>

          {latestAudit.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
              {tr.noAuditEvents}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {latestAudit.map((event) => (
                <div key={event.id} className="rounded-2xl border bg-slate-50 p-4">
                  <div className="font-medium text-slate-900">{event.action}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {event.details || tr.noDetails}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    #{event.id} • {fmtDateTime(event.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
