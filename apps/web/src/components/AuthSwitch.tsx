"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthSwitch() {
  const path = usePathname();
  const isLogin = path === "/auth/login";
  const isRegister = path === "/auth/register";

  return (
    <div className="mt-4 flex w-full gap-2">
      <Link
        href="/auth/login"
        className={`flex-1 text-center rounded-xl border px-3 py-2 text-sm ${
          isLogin ? "bg-black text-white" : "hover:bg-gray-50"
        }`}
      >
        Вход
      </Link>
      <Link
        href="/auth/register"
        className={`flex-1 text-center rounded-xl border px-3 py-2 text-sm ${
          isRegister ? "bg-black text-white" : "hover:bg-gray-50"
        }`}
      >
        Регистрация
      </Link>
    </div>
  );
}
