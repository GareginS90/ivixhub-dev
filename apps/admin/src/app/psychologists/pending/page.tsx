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

export default async function PendingPsychologistsPage() {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const tr = adminT(lang);

  let items: PendingPsychologistResponse[] = [];
  let error: string | null = null;

  try {
    items = await adminFetch<PendingPsychologistResponse[]>("/api/admin/psychologists/pending");
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load pending psychologists";
  }

  return (
    <AdminShell
      lang={lang}
      title={tr.pendingPageTitle}
      subtitle={tr.pendingPageSubtitle}
    >
      {error && (
        <div className="rounded-3xl border bg-rose-50 p-5 text-sm text-rose-800">
          <b>{tr.error}:</b> {error}
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm text-slate-600">
          {tr.noPendingPage}
        </div>
      )}

      {!error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.psychologistId} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xl font-semibold text-slate-900">
                      {tr.psychologist} #{item.psychologistId}
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs ${statusTone(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <div>{tr.email}: <b>{item.email}</b></div>
                    <div>{tr.phone}: <b>{item.phone || "—"}</b></div>
                    <div>{tr.userId}: <b>{item.userId}</b></div>
                    <div>{tr.phoneVerified}: <b>{item.phoneVerified ? tr.yes : tr.no}</b></div>
                    <div>{tr.experience}: <b>{item.experienceYears}</b> {tr.years}</div>
                    <div>{tr.submitted}: <b>{fmtDateTime(item.submittedAt)}</b></div>
                  </div>

                  <div className="mt-4 text-sm leading-6 text-slate-600">
                    {shortText(item.bio, 240)}
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href={`/psychologists/pending/${item.psychologistId}`}
                    className="inline-flex rounded-2xl bg-black px-5 py-3 text-sm text-white hover:opacity-90"
                  >
                    {tr.openModeration}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
