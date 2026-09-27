import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { adminT, type AdminLang } from "@/lib/admin-i18n";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 20c.7-3.8 2.7-6 6-6s5.3 2.2 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 7.2a3.3 3.3 0 0 1 0 6.4M17 15c2.2.7 3.5 2.4 4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ModerationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c.8-3.2 3.3-5 7.5-5s6.7 1.8 7.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m17 11 1.5 1.5L21 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M5 6h14M5 12h14M5 18h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="6" r="1.7" fill="currentColor" />
      <circle cx="16" cy="12" r="1.7" fill="currentColor" />
      <circle cx="10" cy="18" r="1.7" fill="currentColor" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M6 4h12v16H6V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.5-2.7 8-7 10-4.3-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    {
      href: "/",
      label: tr.navDashboard,
      icon: <DashboardIcon />
    },
    {
      href: "/users",
      label: lang === "hy" ? "Օգտատերեր" : lang === "ru" ? "Пользователи" : "Users",
      icon: <UsersIcon />
    },
    {
      href: "/psychologists/pending",
      label: tr.navPendingPsychologists,
      icon: <ModerationIcon />
    },
    {
      href: "/catalog",
      label: tr.navCatalog,
      icon: <CatalogIcon />
    },
    {
      href: "/audit",
      label: tr.navAudit,
      icon: <AuditIcon />
    }
  ];

  return (
    <main className="min-h-screen bg-[#f7fafb] text-[#073f43]">
      <div className="min-h-screen lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="relative hidden min-h-screen overflow-hidden border-r border-[#073f43]/8 bg-[#073f43] lg:flex lg:flex-col">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-80"
            style={{
              background:
                "radial-gradient(circle at 15% 5%, rgba(18,184,196,.26), transparent 46%), radial-gradient(circle at 90% 22%, rgba(118,87,223,.22), transparent 42%)"
            }}
          />

          <div className="relative flex min-h-screen flex-col px-5 py-6">
            <Link href="/" className="group flex items-center gap-3 rounded-2xl px-2 py-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                <div className="h-5 w-5 rounded-[7px] bg-gradient-to-br from-[#12b8c4] via-[#3977e8] to-[#7657df] shadow-[0_0_24px_rgba(18,184,196,.35)]" />
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8ce8e8]">
                  IviXHub
                </div>
                <div className="mt-0.5 text-lg font-semibold tracking-tight text-white">
                  Admin
                </div>
              </div>
            </Link>

            <div className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Navigation
            </div>

            <nav className="mt-3 space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[14px] font-medium text-white/70 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#8ce8e8] ring-1 ring-white/[0.08] transition group-hover:bg-white/10 group-hover:text-white">
                    {item.icon}
                  </span>

                  <span className="leading-5">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#12b8c4]/15 text-[#8ce8e8] ring-1 ring-[#12b8c4]/20">
                    <ShieldIcon />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      IviXHub Internal
                    </div>
                    <div className="mt-0.5 text-xs text-white/45">
                      Secure administration
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-white/50">
                  {tr.internalTools}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 px-2 text-[11px] text-white/35">
                <span className="h-2 w-2 rounded-full bg-[#48d6a4] shadow-[0_0_10px_rgba(72,214,164,.6)]" />
                Admin system online
              </div>
            </div>
          </div>
        </aside>

        <section className="relative min-w-0 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
            style={{
              background:
                "radial-gradient(circle at 18% 0%, rgba(18,184,196,.08), transparent 34%), radial-gradient(circle at 82% 5%, rgba(118,87,223,.07), transparent 30%)"
            }}
          />

          <div className="relative mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 xl:px-8">
            <AdminTopBar
              lang={lang}
              labels={{
                ru: tr.langRu,
                hy: tr.langHy,
                en: tr.langEn
              }}
            />

            <header className="mt-6 overflow-hidden rounded-[30px] border border-[#073f43]/8 bg-white/90 shadow-[0_18px_55px_rgba(7,63,67,.07)] backdrop-blur-xl">
              <div className="relative px-6 py-7 sm:px-8 sm:py-8">
                <div
                  className="pointer-events-none absolute right-0 top-0 h-full w-2/5 opacity-70"
                  style={{
                    background:
                      "radial-gradient(circle at 85% 15%, rgba(18,184,196,.13), transparent 40%), radial-gradient(circle at 75% 85%, rgba(118,87,223,.09), transparent 45%)"
                  }}
                />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#078b7b]">
                      <span className="h-px w-6 bg-[#12b8c4]" />
                      {tr.brand}
                    </div>

                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#073f43] sm:text-4xl">
                      {title}
                    </h1>

                    {subtitle && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#456b6e] sm:text-[15px]">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#073f43]/8 bg-[#f7fbfb] px-4 py-2.5 text-xs font-medium text-[#456b6e] shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#12b8c4]" />
                    {tr.localhost}
                  </div>
                </div>
              </div>
            </header>

            <div className="mt-6 pb-10">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
