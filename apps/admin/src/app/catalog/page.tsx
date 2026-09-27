import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, type CatalogItem } from "@/lib/admin-api";
import { adminT, normalizeAdminLang } from "@/lib/admin-i18n";

function MethodsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 6h14M5 12h14M5 18h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="8" cy="6" r="1.8" fill="currentColor" />
      <circle cx="16" cy="12" r="1.8" fill="currentColor" />
      <circle cx="10" cy="18" r="1.8" fill="currentColor" />
    </svg>
  );
}

function SpecializationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 3 14.6 8.4 20.5 9.2l-4.3 4.2 1 5.9L12 16.5l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActiveIcon() {
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

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4 12h16M12 4c2.2 2.2 3.3 4.9 3.3 8S14.2 17.8 12 20M12 4c-2.2 2.2-3.3 4.9-3.3 8S9.8 17.8 12 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CatalogTable({
  items,
  emptyText,
  tr
}: {
  items: CatalogItem[];
  emptyText: string;
  tr: ReturnType<typeof adminT>;
}) {
  if (items.length === 0) {
    return (
      <div className="px-5 py-12 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eef8f7] text-[#078b7b]">
          <MethodsIcon />
        </div>
        <div className="mt-4 text-sm font-semibold text-[#073f43]">
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#073f43]/7 bg-[#f8fbfb]">
            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91a3a5] sm:px-6">
              {tr.code}
            </th>
            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91a3a5]">
              EN
            </th>
            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91a3a5]">
              RU
            </th>
            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91a3a5]">
              HY
            </th>
            <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#91a3a5] sm:px-6">
              {tr.status}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#073f43]/6">
          {items.map((item) => (
            <tr
              key={item.code}
              className="group bg-white transition duration-200 hover:bg-[#f9fcfc]"
            >
              <td className="px-5 py-4 sm:px-6">
                <span className="inline-flex rounded-xl border border-[#073f43]/7 bg-[#f5f9f9] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#456b6e]">
                  {item.code}
                </span>
              </td>

              <td className="max-w-[220px] px-4 py-4">
                <div className="font-medium leading-5 text-[#315e61]">
                  {item.nameEn}
                </div>
              </td>

              <td className="max-w-[220px] px-4 py-4">
                <div className="font-medium leading-5 text-[#315e61]">
                  {item.nameRu}
                </div>
              </td>

              <td className="max-w-[220px] px-4 py-4">
                <div className="font-medium leading-5 text-[#315e61]">
                  {item.nameHy}
                </div>
              </td>

              <td className="px-5 py-4 sm:px-6">
                {item.active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#078b7b]/12 bg-[#eaf8f5] px-2.5 py-1.5 text-[11px] font-semibold text-[#078b7b]">
                    <ActiveIcon />
                    {tr.active}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {tr.disabled}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

  const activeMethods = methods.filter((item) => item.active).length;
  const activeSpecializations = specializations.filter(
    (item) => item.active
  ).length;

  return (
    <AdminShell
      lang={lang}
      title={tr.catalogTitle}
      subtitle={tr.catalogSubtitle}
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

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] sm:p-6">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#078b7b] to-[#12b8c4]" />

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
            <MethodsIcon />
          </div>

          <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
            {tr.therapyMethods}
          </div>

          <div className="mt-2 flex items-end gap-2">
            <div className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
              {methods.length}
            </div>
            <div className="pb-0.5 text-xs font-medium text-[#789092]">
              {activeMethods} {tr.active}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] sm:p-6">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#7657df] to-[#3977e8]" />

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1edff] text-[#7657df]">
            <SpecializationIcon />
          </div>

          <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
            {tr.specializations}
          </div>

          <div className="mt-2 flex items-end gap-2">
            <div className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-[#073f43]">
              {specializations.length}
            </div>
            <div className="pb-0.5 text-xs font-medium text-[#789092]">
              {activeSpecializations} {tr.active}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_35px_rgba(7,63,67,.055)] sm:col-span-2 sm:p-6 xl:col-span-1">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#3977e8] to-[#12b8c4]" />

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#3977e8]">
            <GlobeIcon />
          </div>

          <div className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#789092]">
            Languages
          </div>

          <div className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#073f43]">
            HY · RU · EN
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
          <div className="flex flex-col gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
                <MethodsIcon />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                  {tr.therapyMethods}
                </h2>
                <p className="mt-0.5 text-xs text-[#789092]">
                  IviXHub therapy methods catalog
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf9f8] px-3 py-1.5 text-xs font-semibold text-[#078b7b]">
              <span className="h-2 w-2 rounded-full bg-[#12b8c4]" />
              {activeMethods}/{methods.length} {tr.active}
            </div>
          </div>

          <CatalogTable items={methods} emptyText={tr.noMethods} tr={tr} />
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_14px_40px_rgba(7,63,67,.06)]">
          <div className="flex flex-col gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1edff] text-[#7657df]">
                <SpecializationIcon />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#073f43]">
                  {tr.specializations}
                </h2>
                <p className="mt-0.5 text-xs text-[#789092]">
                  IviXHub specialist areas catalog
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f3f0ff] px-3 py-1.5 text-xs font-semibold text-[#7657df]">
              <span className="h-2 w-2 rounded-full bg-[#7657df]" />
              {activeSpecializations}/{specializations.length} {tr.active}
            </div>
          </div>

          <CatalogTable
            items={specializations}
            emptyText={tr.noSpecializations}
            tr={tr}
          />
        </section>
      </div>
    </AdminShell>
  );
}
