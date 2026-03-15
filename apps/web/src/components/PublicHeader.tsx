import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center text-sm font-semibold">
            IX
          </div>
          <div className="leading-tight">
            <div className="font-semibold">IvixHUB</div>
            <div className="text-xs text-gray-500">Psychology platform</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
          <Link href="/quiz" className="hover:text-black">Quiz</Link>
          <Link href="/psychologists" className="hover:text-black">Psychologists</Link>
          <Link href="/trust-safety" className="hover:text-black">Trust</Link>
          <Link href="/support" className="hover:text-black">Support</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block h-6 w-px bg-gray-200" />
          <Link href="/auth/login" className="text-sm rounded-xl border px-3 py-2 hover:bg-gray-50">
            Login
          </Link>
          <Link href="/auth/register" className="text-sm rounded-xl bg-black text-white px-3 py-2 hover:opacity-90">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
