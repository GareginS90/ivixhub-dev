"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageMenu } from "@/components/LanguageMenu";

type HeaderActionsProps = {
  isAuthed: boolean;
  homeHref: string;
};

export function HeaderActions({
  isAuthed,
  homeHref
}: HeaderActionsProps) {
  const pathname = usePathname();

  const isLogin = pathname === "/auth/login";
  const isRegister = pathname === "/auth/register";
  const isAuthPage = pathname.startsWith("/auth/");

  if (isAuthed) {
    return (
      <div className="flex items-center gap-2.5">
        <Link
          href={homeHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#078b7b]/18 bg-[#edf8f6] px-5 text-sm font-bold text-[#06756d] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/32 hover:bg-[#e3f7f3]"
        >
          Անձնական էջ
        </Link>

        <LanguageMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      {!isLogin && (
        <Link
          href="/auth/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#073f43]/12 bg-white px-5 text-sm font-bold text-[#31595b] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/32 hover:bg-gradient-to-r hover:from-[#effaf8] hover:to-[#f3f1ff] hover:text-[#087f78] hover:shadow-[0_10px_28px_rgba(57,119,232,0.10)]"
        >
          Մուտք
        </Link>
      )}

      {!isAuthPage && (
        <Link
          href="/auth/register"
          className="hidden min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#075f62] via-[#078b7b] to-[#12aeba] px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(7,139,123,0.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(18,184,196,0.28)] sm:inline-flex"
        >
          Գրանցվել
        </Link>
      )}

      {isRegister && null}

      <LanguageMenu />
    </div>
  );
}
