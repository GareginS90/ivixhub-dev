"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ConsentsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [medical, setMedical] = useState(false);

  const can = terms && privacy && medical;

  function finish() {
    // позже заменим на POST /api/auth/register/complete
    router.replace("/auth/login");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Согласия</h1>
          <p className="mt-1 text-sm text-gray-600">
            Оферта / Данные / Мед. предупреждение
          </p>

          <label className="mt-4 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span>Принимаю условия оферты (Terms)</span>
          </label>

          <label className="mt-3 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
            />
            <span>Согласен с политикой данных (Privacy)</span>
          </label>

          <label className="mt-3 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={medical}
              onChange={(e) => setMedical(e.target.checked)}
            />
            <span>Понимаю медицинское предупреждение (не экстренная помощь)</span>
          </label>

          <button
            disabled={!can}
            onClick={finish}
            className="mt-5 w-full rounded-xl bg-black py-2 text-white disabled:opacity-50"
          >
            Завершить
          </button>

          <div className="mt-3 text-xs text-gray-500">
            UI соответствует UX. Далее подключим сохранение consent + завершение регистрации на backend.
          </div>
        </div>
      </div>
    </div>
  );
}
