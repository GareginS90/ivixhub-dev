import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { adminT, type AdminLang } from "@/lib/admin-i18n";

export default function AdminShell({
  lang,
  title,
  subtitle,
  children
}: {
  lang: AdminLang;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const tr = adminT(lang);

  const navItems = [
    { href: "/", label: tr.navDashboard },
    { href: "/psychologists/pending", label: tr.navPendingPsychologists },
    { href: "/catalog", label: tr.navCatalog },
    { href: "/audit", label: tr.navAudit }
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r bg-white p-6 lg:block">
          <div className="text-sm text-slate-500">{tr.brand}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{tr.panel}</div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl border px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border bg-slate-50 p-4 text-sm text-slate-600">
            {tr.internalTools}
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-6 lg:p-8">
          <AdminTopBar
            lang={lang}
            labels={{
              ru: tr.langRu,
              hy: tr.langHy,
              en: tr.langEn
            }}
          />

          <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm text-slate-500">{tr.brand}</div>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
                {subtitle && (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {tr.localhost}
              </div>
            </div>
          </div>

          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
