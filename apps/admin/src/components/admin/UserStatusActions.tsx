"use client";

import { useState, useTransition } from "react";
import {
  activateUser,
  deactivateUser
} from "@/app/users/[id]/actions";

type Props = {
  userId: number;
  active: boolean;
  lang: "hy" | "ru" | "en";
};

export default function UserStatusActions({
  userId,
  active,
  lang
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const labels =
    lang === "hy"
      ? {
          activate: "Ակտիվացնել հաշիվը",
          deactivate: "Անջատել հաշիվը",
          activateTitle: "Ակտիվացնե՞լ այս հաշիվը",
          deactivateTitle: "Անջատե՞լ այս հաշիվը",
          activateText:
            "Օգտատերը կրկին կկարողանա օգտվել իր IviXHub հաշվից։",
          deactivateText:
            "Հաշիվը կդառնա ոչ ակտիվ։ Տվյալները չեն ջնջվի, և հաշիվը հնարավոր կլինի հետագայում կրկին ակտիվացնել։",
          confirm: "Հաստատել",
          cancel: "Չեղարկել",
          processing: "Կատարվում է…",
          error: "Գործողությունը չհաջողվեց։"
        }
      : lang === "ru"
        ? {
            activate: "Активировать аккаунт",
            deactivate: "Отключить аккаунт",
            activateTitle: "Активировать этот аккаунт?",
            deactivateTitle: "Отключить этот аккаунт?",
            activateText:
              "Пользователь снова сможет пользоваться своим аккаунтом IviXHub.",
            deactivateText:
              "Аккаунт станет неактивным. Данные не будут удалены, и аккаунт можно будет активировать снова.",
            confirm: "Подтвердить",
            cancel: "Отмена",
            processing: "Выполняется…",
            error: "Не удалось выполнить действие."
          }
        : {
            activate: "Activate account",
            deactivate: "Deactivate account",
            activateTitle: "Activate this account?",
            deactivateTitle: "Deactivate this account?",
            activateText:
              "The user will be able to use their IviXHub account again.",
            deactivateText:
              "The account will become inactive. No data will be deleted, and the account can be activated again later.",
            confirm: "Confirm",
            cancel: "Cancel",
            processing: "Processing…",
            error: "The action could not be completed."
          };

  function handleAction() {
    if (isPending) return;

    setError("");

    startTransition(async () => {
      try {
        if (active) {
          await deactivateUser(userId);
        } else {
          await activateUser(userId);
        }

        setConfirming(false);
      } catch (caught: unknown) {
        const message =
          caught instanceof Error && caught.message
            ? caught.message
            : labels.error;

        setError(message);
      }
    });
  }

  return (
    <div className="space-y-3">
      {!confirming ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError("");
            setConfirming(true);
          }}
          className={
            active
              ? "inline-flex h-11 w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              : "inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#073f43] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0a555a] disabled:cursor-not-allowed disabled:opacity-60"
          }
        >
          {active ? labels.deactivate : labels.activate}
        </button>
      ) : (
        <div
          className={
            active
              ? "rounded-[22px] border border-rose-200 bg-rose-50/70 p-4"
              : "rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4"
          }
        >
          <div
            className={
              active
                ? "text-sm font-semibold text-rose-800"
                : "text-sm font-semibold text-emerald-800"
            }
          >
            {active ? labels.deactivateTitle : labels.activateTitle}
          </div>

          <p
            className={
              active
                ? "mt-2 text-xs leading-5 text-rose-700/80"
                : "mt-2 text-xs leading-5 text-emerald-700/80"
            }
          >
            {active ? labels.deactivateText : labels.activateText}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={isPending}
              onClick={handleAction}
              className={
                active
                  ? "inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-rose-600 px-4 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  : "inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              }
            >
              {isPending ? labels.processing : labels.confirm}
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setConfirming(false);
                setError("");
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#073f43]/10 bg-white px-4 text-xs font-semibold text-[#607d80] transition hover:bg-[#f7fbfb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {labels.cancel}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}
