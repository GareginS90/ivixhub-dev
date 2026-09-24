import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo href="/" size="md" />

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/quiz"
            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Quiz
          </Link>
          <Link
            href="/psychologists"
            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Psychologists
          </Link>
          <Link
            href="/support"
            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
