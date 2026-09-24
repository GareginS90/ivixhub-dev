import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, type AuditEvent, fmtDateTime } from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

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

  return (
    <AdminShell
      lang={lang}
      title={tr.auditTitle}
      subtitle={tr.auditSubtitle}
    >
      {error && (
        <div className="rounded-3xl border bg-rose-50 p-5 text-sm text-rose-800">
          <b>{tr.error}:</b> {error}
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm text-slate-600">
          {tr.noAuditFound}
        </div>
      )}

      {!error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-lg font-semibold text-slate-900">{item.action}</div>
                <div className="text-sm text-slate-500">{fmtDateTime(item.createdAt)}</div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                <div>{tr.eventId}: <b>{item.id}</b></div>
                <div>{tr.actorUserId}: <b>{item.actorUserId ?? "—"}</b></div>
                <div>{tr.entityType}: <b>{item.entityType || "—"}</b></div>
                <div>{tr.entityId}: <b>{item.entityId ?? "—"}</b></div>
              </div>

              <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
                {item.details || tr.noDetails}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
