"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "hy" | "ru" | "en";
type PaymentMethod = "CARD" | "IDRAM" | "TELCELL";

type Intent = {
  paymentIntentId: number;
  bookingId: number;
  amountMinor: number;
  currency: string;
  provider: string;
  providerPaymentId: string | null;
  checkoutUrl: string | null;
  status: string;
};

const TXT = {
  hy: {
    back: "Վերադառնալ իմ հանդիպումներին",
    eyebrow: "Անվտանգ վճարում",
    title: "Վճարման հաստատում",
    subtitle:
      "Ավարտեք վճարումը՝ ձեր հանդիպումը վերջնականապես հաստատելու համար։",
    booking: "Ամրագրում",
    protected: "Պաշտպանված վճարում",
    protectedText:
      "Վճարումը պահպանվում է escrow համակարգում և մշակվում է IviXHub-ի վճարման կանոններով։",
    chooseMethod: "Ընտրեք վճարման եղանակը",
    card: "Բանկային քարտ",
    cardHint: "Visa / Mastercard",
    idram: "Idram",
    idramHint: "Էլեկտրոնային դրամապանակ",
    telcell: "Telcell",
    telcellHint: "Telcell Wallet",
    createPayment: "Շարունակել վճարմանը",
    creating: "Պատրաստվում է վճարումը…",
    paymentDetails: "Վճարման տվյալներ",
    amount: "Գումար",
    provider: "Վճարման համակարգ",
    status: "Կարգավիճակ",
    intentId: "Գործարքի ID",
    openProvider: "Անցնել վճարման էջ",
    devPay: "Mock վճարում (DEV)",
    devMode: "DEV ռեժիմ",
    devDescription:
      "Mock վճարումը նախատեսված է միայն development միջավայրի համար։ Production-ում այն կփոխարինվի իրական provider + webhook հաստատմամբ։",
    successTitle: "Վճարումը հաջողությամբ կատարված է",
    successText:
      "Ձեր հանդիպման վճարումը հաստատված է։ Այժմ կարող եք անցնել ձեր հանդիպումներին կամ բացել ամրագրման մանրամասները։",
    sessions: "Իմ հանդիպումները",
    openBooking: "Բացել ամրագրումը",
    policy: "Չեղարկման և վերադարձի պայմաններ",
    policyIntro:
      "Հաստատելուց առաջ կարող եք ծանոթանալ վերադարձի հիմնական պայմաններին։",
    refund100:
      "Հանդիպումից առնվազն 24 ժամ առաջ չեղարկելու դեպքում վերադարձվում է վճարման 100%-ը։",
    refund40:
      "Հանդիպման մեկնարկին 24 ժամից քիչ մնալու դեպքում վերադարձվում է վճարման 40%-ը։",
    escrow:
      "Վճարումները մշակվում են escrow համակարգի միջոցով։",
    error: "Սխալ",
    pending: "Սպասման մեջ",
    paid: "Վճարված",
    failed: "Չհաջողված",
    created: "Ստեղծված",
    stepBooking: "Ամրագրում",
    stepPayment: "Վճարում",
    stepDone: "Հաստատում"
  },

  ru: {
    back: "Вернуться к моим сессиям",
    eyebrow: "Безопасная оплата",
    title: "Подтверждение оплаты",
    subtitle:
      "Завершите оплату, чтобы окончательно подтвердить вашу сессию.",
    booking: "Бронирование",
    protected: "Защищённая оплата",
    protectedText:
      "Платёж защищён системой escrow и обрабатывается согласно платёжным правилам IviXHub.",
    chooseMethod: "Выберите способ оплаты",
    card: "Банковская карта",
    cardHint: "Visa / Mastercard",
    idram: "Idram",
    idramHint: "Электронный кошелёк",
    telcell: "Telcell",
    telcellHint: "Telcell Wallet",
    createPayment: "Перейти к оплате",
    creating: "Подготавливаем оплату…",
    paymentDetails: "Данные платежа",
    amount: "Сумма",
    provider: "Платёжная система",
    status: "Статус",
    intentId: "ID операции",
    openProvider: "Открыть страницу оплаты",
    devPay: "Mock оплата (DEV)",
    devMode: "DEV режим",
    devDescription:
      "Mock-оплата предназначена только для development-среды. В production она будет заменена реальным provider + webhook подтверждением.",
    successTitle: "Оплата успешно завершена",
    successText:
      "Оплата вашей сессии подтверждена. Теперь вы можете перейти к своим сессиям или открыть детали бронирования.",
    sessions: "Мои сессии",
    openBooking: "Открыть бронирование",
    policy: "Условия отмены и возврата",
    policyIntro:
      "Перед подтверждением вы можете ознакомиться с основными условиями возврата.",
    refund100:
      "При отмене минимум за 24 часа до начала сессии возвращается 100% оплаты.",
    refund40:
      "Если до начала сессии осталось менее 24 часов, возвращается 40% оплаты.",
    escrow:
      "Все платежи обрабатываются через escrow.",
    error: "Ошибка",
    pending: "Ожидает оплаты",
    paid: "Оплачено",
    failed: "Ошибка оплаты",
    created: "Создано",
    stepBooking: "Бронирование",
    stepPayment: "Оплата",
    stepDone: "Подтверждение"
  },

  en: {
    back: "Back to my sessions",
    eyebrow: "Secure payment",
    title: "Payment confirmation",
    subtitle:
      "Complete the payment to fully confirm your session.",
    booking: "Booking",
    protected: "Protected payment",
    protectedText:
      "Your payment is protected through escrow and processed according to IviXHub payment rules.",
    chooseMethod: "Choose payment method",
    card: "Bank card",
    cardHint: "Visa / Mastercard",
    idram: "Idram",
    idramHint: "Digital wallet",
    telcell: "Telcell",
    telcellHint: "Telcell Wallet",
    createPayment: "Continue to payment",
    creating: "Preparing payment…",
    paymentDetails: "Payment details",
    amount: "Amount",
    provider: "Payment provider",
    status: "Status",
    intentId: "Transaction ID",
    openProvider: "Open payment page",
    devPay: "Mock payment (DEV)",
    devMode: "DEV mode",
    devDescription:
      "Mock payment is intended only for the development environment. In production it will be replaced by a real provider + webhook confirmation.",
    successTitle: "Payment successful",
    successText:
      "Your session payment has been confirmed. You can now go to your sessions or open the booking details.",
    sessions: "My sessions",
    openBooking: "Open booking",
    policy: "Cancellation and refund policy",
    policyIntro:
      "Before confirming, you can review the main refund conditions.",
    refund100:
      "If you cancel at least 24 hours before the session, 100% of the payment is refunded.",
    refund40:
      "If less than 24 hours remain before the session, 40% of the payment is refunded.",
    escrow:
      "All payments are processed through escrow.",
    error: "Error",
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    created: "Created",
    stepBooking: "Booking",
    stepPayment: "Payment",
    stepDone: "Confirmation"
  }
} as const;

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.8 2.8 8.3 7 10 4.2-1.7 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="M4 8h14" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function formatAmount(
  amountMinor: number,
  currency: string,
  lang: Lang
) {
  const locale =
    lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";

  const currencyCode =
    currency && currency.length === 3
      ? currency.toUpperCase()
      : "AMD";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: currencyCode === "AMD" ? 0 : 2
    }).format(amountMinor / 100);
  } catch {
    return `${amountMinor / 100} ${currency}`;
  }
}

function statusLabel(
  status: string | undefined,
  lang: Lang
) {
  const tr = TXT[lang];

  switch (status?.toUpperCase()) {
    case "PAID":
      return tr.paid;
    case "FAILED":
    case "CANCELLED":
      return tr.failed;
    case "CREATED":
      return tr.created;
    default:
      return tr.pending;
  }
}

function PaymentOption({
  active,
  title,
  subtitle,
  icon,
  onClick
}: {
  active: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-[118px] rounded-[24px] border p-4 text-left transition-all duration-300 ${
        active
          ? "border-[#12b8c4]/35 bg-gradient-to-br from-[#e9f9f6] via-[#eef9fb] to-[#f1f0ff] shadow-[0_14px_35px_rgba(18,184,196,0.11)]"
          : "border-[#073f43]/8 bg-[#fbfdfd] hover:-translate-y-1 hover:border-[#12b8c4]/25 hover:bg-white hover:shadow-[0_14px_35px_rgba(7,63,67,0.07)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-10 items-center justify-center rounded-[14px] ${
            active
              ? "bg-[#078b7b] text-white"
              : "bg-[#edf7f6] text-[#078b7b]"
          }`}
        >
          {icon}
        </div>

        <div
          className={`flex size-6 items-center justify-center rounded-full border ${
            active
              ? "border-[#078b7b] bg-[#078b7b] text-white"
              : "border-[#b8c8c8] bg-white text-transparent"
          }`}
        >
          <CheckIcon />
        </div>
      </div>

      <div className="mt-3 text-sm font-black text-[#234d50]">
        {title}
      </div>

      <div className="mt-1 text-xs font-medium text-[#819293]">
        {subtitle}
      </div>
    </button>
  );
}

export default function CheckoutPage() {
  const params = useParams<{ bookingId: string }>();
  const bookingId = params?.bookingId;

  const lang = getUiLangFromCookie() as Lang;
  const tr = TXT[lang];

  const [method, setMethod] =
    useState<PaymentMethod>("CARD");
  const [intent, setIntent] =
    useState<Intent | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  async function loadLatest() {
    if (!bookingId) {
      setInitialLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/payments/latest-intent/${bookingId}`,
        {
          cache: "no-store" as RequestCache
        }
      );

      if (!response.ok) return;

      const payload = await response
        .json()
        .catch(() => null);

      if (payload?.paymentIntentId) {
        setIntent(payload);
      }
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  async function createIntent() {
    if (!bookingId) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/payments/intent/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            method,
            returnUrl: window.location.href
          })
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message
            ? `${payload.message}${
                payload.details
                  ? ` | ${payload.details}`
                  : ""
              }`
            : "Create intent failed"
        );
        return;
      }

      setIntent(payload);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Create intent failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function mockPay() {
    if (!bookingId) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/payments/mock-pay/${bookingId}`,
        {
          method: "POST"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message
            ? `${payload.message}${
                payload.details
                  ? ` | ${payload.details}`
                  : ""
              }`
            : "Mock pay failed"
        );
        return;
      }

      await loadLatest();
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Mock pay failed"
      );
    } finally {
      setLoading(false);
    }
  }

  const isPaid =
    intent?.status?.toUpperCase() === "PAID";

  const formattedAmount = useMemo(() => {
    if (!intent) return "—";

    return formatAmount(
      intent.amountMinor,
      intent.currency,
      lang
    );
  }, [intent, lang]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_2%_8%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_12%,rgba(118,87,223,0.10),transparent_31%),radial-gradient(circle_at_55%_40%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.back}
        </Link>

        <section className="mt-7 overflow-hidden rounded-[34px] border border-white/80 bg-white/88 shadow-[0_24px_75px_rgba(7,63,67,0.08)] backdrop-blur-xl">
          <div className="relative overflow-hidden px-6 py-8 sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/8 to-[#7657df]/10 blur-3xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
                  <ShieldIcon />
                  {tr.eyebrow}
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-[#073f43] sm:text-[44px] sm:leading-[1.08]">
                  {tr.title}
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#687f81]">
                  {tr.subtitle}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#073f43]/7 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                  {tr.booking}
                </div>

                <div className="mt-1 text-lg font-black text-[#31595b]">
                  #{bookingId}
                </div>
              </div>
            </div>

            <div className="relative mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-[18px] bg-[#e8f8f5] px-3 py-3 text-center">
                <div className="mx-auto flex size-7 items-center justify-center rounded-full bg-[#078b7b] text-white">
                  <CheckIcon />
                </div>
                <div className="mt-2 text-[11px] font-extrabold text-[#397071] sm:text-xs">
                  {tr.stepBooking}
                </div>
              </div>

              <div
                className={`rounded-[18px] px-3 py-3 text-center ${
                  isPaid
                    ? "bg-[#e8f8f5]"
                    : "bg-[#eaf4ff]"
                }`}
              >
                <div
                  className={`mx-auto flex size-7 items-center justify-center rounded-full text-xs font-black text-white ${
                    isPaid
                      ? "bg-[#078b7b]"
                      : "bg-[#3977e8]"
                  }`}
                >
                  {isPaid ? <CheckIcon /> : "2"}
                </div>

                <div className="mt-2 text-[11px] font-extrabold text-[#60797b] sm:text-xs">
                  {tr.stepPayment}
                </div>
              </div>

              <div
                className={`rounded-[18px] px-3 py-3 text-center ${
                  isPaid
                    ? "bg-[#f0edff]"
                    : "bg-[#f6f9f9]"
                }`}
              >
                <div
                  className={`mx-auto flex size-7 items-center justify-center rounded-full text-xs font-black ${
                    isPaid
                      ? "bg-[#7657df] text-white"
                      : "bg-[#e4eded] text-[#6f8384]"
                  }`}
                >
                  {isPaid ? <CheckIcon /> : "3"}
                </div>

                <div className="mt-2 text-[11px] font-extrabold text-[#60797b] sm:text-xs">
                  {tr.stepDone}
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-[24px] border border-red-200 bg-red-50/90 p-5 text-sm font-medium leading-6 text-red-800 shadow-sm">
            <span className="font-black">
              {tr.error}:
            </span>{" "}
            {error}
          </div>
        )}

        {initialLoading ? (
          <div className="mt-6 rounded-[30px] border border-white/80 bg-white/90 p-8 shadow-[0_18px_55px_rgba(7,63,67,0.06)]">
            <div className="flex items-center gap-3">
              <span className="size-5 animate-spin rounded-full border-2 border-[#12b8c4]/20 border-t-[#078b7b]" />
              <div className="h-3 w-40 animate-pulse rounded-full bg-[#e8eeee]" />
            </div>
          </div>
        ) : isPaid ? (
          <section className="mt-6 overflow-hidden rounded-[32px] border border-[#078b7b]/12 bg-white shadow-[0_22px_65px_rgba(7,139,123,0.10)]">
            <div className="bg-[radial-gradient(circle_at_100%_0%,rgba(57,119,232,0.10),transparent_40%),radial-gradient(circle_at_0%_0%,rgba(18,184,196,0.13),transparent_45%)] p-7 sm:p-10">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#078b7b] text-white shadow-[0_12px_28px_rgba(7,139,123,0.22)]">
                <CheckIcon />
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#073f43] sm:text-3xl">
                {tr.successTitle}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#687f81]">
                {tr.successText}
              </p>

              {intent && (
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-white bg-white/80 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                      {tr.amount}
                    </div>
                    <div className="mt-1.5 text-base font-black text-[#31595b]">
                      {formattedAmount}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-white bg-white/80 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                      {tr.provider}
                    </div>
                    <div className="mt-1.5 text-base font-black text-[#31595b]">
                      {intent.provider}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-white bg-white/80 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                      {tr.status}
                    </div>
                    <div className="mt-1.5 text-base font-black text-[#078b7b]">
                      {statusLabel(intent.status, lang)}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-7 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(21,159,175,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_17px_38px_rgba(57,119,232,0.28)]"
                >
                  {tr.sessions}
                  <ArrowRightIcon />
                </Link>

                <Link
                  href={`/app/bookings/${bookingId}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#073f43]/10 bg-white px-7 text-sm font-extrabold text-[#557173] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b]"
                >
                  {tr.openBooking}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.065)] sm:p-8">
                <span className="text-xs font-black uppercase tracking-[0.09em] text-[#12a2a4]">
                  01
                </span>

                <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-[#173f42]">
                  {tr.chooseMethod}
                </h2>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <PaymentOption
                    active={method === "CARD"}
                    title={tr.card}
                    subtitle={tr.cardHint}
                    icon={<CardIcon />}
                    onClick={() => setMethod("CARD")}
                  />

                  <PaymentOption
                    active={method === "IDRAM"}
                    title={tr.idram}
                    subtitle={tr.idramHint}
                    icon={<WalletIcon />}
                    onClick={() => setMethod("IDRAM")}
                  />

                  <PaymentOption
                    active={method === "TELCELL"}
                    title={tr.telcell}
                    subtitle={tr.telcellHint}
                    icon={<WalletIcon />}
                    onClick={() => setMethod("TELCELL")}
                  />
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={createIntent}
                  className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(21,159,175,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_17px_38px_rgba(57,119,232,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {tr.creating}
                    </>
                  ) : (
                    <>
                      {tr.createPayment}
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </section>

              {intent && (
                <section className="rounded-[30px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(7,63,67,0.065)] sm:p-8">
                  <span className="text-xs font-black uppercase tracking-[0.09em] text-[#3977e8]">
                    02
                  </span>

                  <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-[#173f42]">
                    {tr.paymentDetails}
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-[#073f43]/7 bg-[#f8fbfb] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                        {tr.amount}
                      </div>
                      <div className="mt-1.5 text-base font-black text-[#31595b]">
                        {formattedAmount}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-[#073f43]/7 bg-[#f8fbfb] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                        {tr.provider}
                      </div>
                      <div className="mt-1.5 text-base font-black text-[#31595b]">
                        {intent.provider}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-[#073f43]/7 bg-[#f8fbfb] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                        {tr.status}
                      </div>
                      <div className="mt-1.5 text-base font-black text-[#3977e8]">
                        {statusLabel(intent.status, lang)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-[#073f43]/7 bg-[#f8fbfb] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                        {tr.intentId}
                      </div>
                      <div className="mt-1.5 text-base font-black text-[#31595b]">
                        #{intent.paymentIntentId}
                      </div>
                    </div>
                  </div>

                  {intent.checkoutUrl && (
                    <a
                      href={intent.checkoutUrl}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#12b8c4]/20 bg-[#f2fbfa] px-6 text-sm font-extrabold text-[#078b7b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e8f8f5]"
                    >
                      {tr.openProvider}
                      <ArrowRightIcon />
                    </a>
                  )}

                  <div className="mt-5 rounded-[22px] border border-[#7657df]/10 bg-[#f7f5ff] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#7657df] shadow-sm">
                        DEV
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-black text-[#57458d]">
                          {tr.devMode}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-[#80759d]">
                          {tr.devDescription}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={mockPay}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#7657df] px-5 text-sm font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(118,87,223,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "…" : tr.devPay}
                    </button>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <section className="rounded-[30px] border border-[#078b7b]/10 bg-[#f1faf8] p-6 shadow-[0_16px_45px_rgba(7,63,67,0.05)]">
                <div className="flex gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#078b7b] shadow-sm">
                    <ShieldIcon />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#31595b]">
                      {tr.protected}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-[#718687]">
                      {tr.protectedText}
                    </p>
                  </div>
                </div>
              </section>

              <details className="group rounded-[28px] border border-[#073f43]/7 bg-white/92 p-5 shadow-[0_12px_35px_rgba(7,63,67,0.045)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-[#31595b]">
                  {tr.policy}

                  <span className="flex size-7 items-center justify-center rounded-full bg-[#f1f6f6] text-lg font-medium text-[#6e8384] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-2 text-xs leading-5 text-[#819293]">
                  {tr.policyIntro}
                </p>

                <div className="mt-4 space-y-3 text-xs leading-5 text-[#627b7d]">
                  <div className="rounded-[16px] bg-[#f8fbfb] p-3">
                    {tr.refund100}
                  </div>

                  <div className="rounded-[16px] bg-[#f8fbfb] p-3">
                    {tr.refund40}
                  </div>

                  <div className="rounded-[16px] bg-[#f8fbfb] p-3">
                    {tr.escrow}
                  </div>
                </div>
              </details>

              {intent && (
                <section className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_12px_35px_rgba(7,63,67,0.045)]">
                  <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8a9a9b]">
                    {tr.amount}
                  </div>

                  <div className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#073f43]">
                    {formattedAmount}
                  </div>

                  <div className="mt-3 inline-flex rounded-full bg-[#eef8fb] px-3 py-1.5 text-[11px] font-extrabold text-[#3977e8]">
                    {statusLabel(intent.status, lang)}
                  </div>
                </section>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
