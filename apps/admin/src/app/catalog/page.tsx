import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, type CatalogItem } from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

export default async function CatalogPage() {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const tr = adminT(lang);

  let methods: CatalogItem[] = [];
  let specializations: CatalogItem[] = [];
  let error: string | null = null;

  try {
    [methods, specializations] = await Promise.all([
      adminFetch<CatalogItem[]>("/api/admin/catalog/methods"),
      adminFetch<CatalogItem[]>("/api/admin/catalog/specializations")
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load catalog data";
  }

  return (
    <AdminShell
      lang={lang}
      title={tr.catalogTitle}
      subtitle={tr.catalogSubtitle}
    >
      {error && (
        <div className="rounded-3xl border bg-rose-50 p-5 text-sm text-rose-800">
          <b>{tr.error}:</b> {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{tr.therapyMethods}</h2>

          {methods.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
              {tr.noMethods}
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3">{tr.code}</th>
                    <th className="px-4 py-3">EN</th>
                    <th className="px-4 py-3">RU</th>
                    <th className="px-4 py-3">HY</th>
                    <th className="px-4 py-3">{tr.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {methods.map((item) => (
                    <tr key={item.code} className="border-t bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.code}</td>
                      <td className="px-4 py-3">{item.nameEn}</td>
                      <td className="px-4 py-3">{item.nameRu}</td>
                      <td className="px-4 py-3">{item.nameHy}</td>
                      <td className="px-4 py-3">{item.active ? tr.active : tr.disabled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{tr.specializations}</h2>

          {specializations.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
              {tr.noSpecializations}
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3">{tr.code}</th>
                    <th className="px-4 py-3">EN</th>
                    <th className="px-4 py-3">RU</th>
                    <th className="px-4 py-3">HY</th>
                    <th className="px-4 py-3">{tr.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {specializations.map((item) => (
                    <tr key={item.code} className="border-t bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.code}</td>
                      <td className="px-4 py-3">{item.nameEn}</td>
                      <td className="px-4 py-3">{item.nameRu}</td>
                      <td className="px-4 py-3">{item.nameHy}</td>
                      <td className="px-4 py-3">{item.active ? tr.active : tr.disabled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
