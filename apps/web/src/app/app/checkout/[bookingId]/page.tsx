"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function CheckoutPage() {
  const params = useParams<{ bookingId: string }>();
  const bookingId = params?.bookingId;

  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadLatest() {
    if (!bookingId) return;
    const r = await fetch(`/api/payments/latest-intent/${bookingId}`, { cache: "no-store" as any });
    if (!r.ok) return;
    const j = await r.json().catch(() => null);
    if (j?.paymentIntentId) setIntent(j);
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
      const r = await fetch(`/api/payments/intent/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, returnUrl: window.location.href })
      });
      const j = await r.json().catch(() => null);
      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Create intent failed");
        return;
      }
      setIntent(j);
    } finally {
      setLoading(false);
    }
  }

  async function mockPay() {
    if (!bookingId) return;
    setError(null);
    setLoading(true);
    try {
      const r = await fetch(`/api/payments/mock-pay/${bookingId}`, { method: "POST" });
      const j = await r.json().catch(() => null);
      if (!r.ok) {
        setError(j?.message ? `${j.message} | ${j.details || ""}` : "Mock pay failed");
        return;
      }
      await loadLatest();
    } finally {
      setLoading(false);
    }
  }

  const isPaid = intent?.status === "PAID";

  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/app" className="text-sm text-gray-600 hover:text-black">← Back</Link>

        <div className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Booking <b>#{bookingId}</b> will be confirmed only after payment.
          </p>

          {!isPaid && (
            <div className="mt-6 rounded-2xl border bg-slate-50 p-4">
              <div className="text-sm font-semibold">1) Choose payment method</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setMethod("CARD")}
                  className={`rounded-xl border px-4 py-2 text-sm ${method === "CARD" ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  BANK_CARD
                </button>
                <button
                  onClick={() => setMethod("IDRAM")}
                  className={`rounded-xl border px-4 py-2 text-sm ${method === "IDRAM" ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  IDRAM
                </button>
                <button
                  onClick={() => setMethod("TELCELL")}
                  className={`rounded-xl border px-4 py-2 text-sm ${method === "TELCELL" ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  TELCELL
                </button>
              </div>

              <button
                disabled={loading}
                onClick={createIntent}
                className="mt-4 w-full rounded-2xl bg-black text-white py-3 disabled:opacity-50"
              >
                {loading ? "..." : "Create payment intent"}
              </button>
            </div>
          )}

          {intent && (
            <div className="mt-6 rounded-2xl border p-4">
              <div className="text-sm font-semibold">Payment intent</div>
              <div className="mt-2 text-sm text-gray-700">
                <div><b>ID:</b> {intent.paymentIntentId}</div>
                <div><b>Amount:</b> {intent.amountMinor} {intent.currency}</div>
                <div><b>Provider:</b> {intent.provider}</div>
                <div><b>Status:</b> {intent.status}</div>
              </div>

              {!isPaid && intent.checkoutUrl && (
                <a
                  href={intent.checkoutUrl}
                  className="mt-4 inline-flex w-full justify-center rounded-2xl border bg-white py-3 hover:bg-gray-50"
                >
                  Open provider checkout
                </a>
              )}

              {!isPaid && (
                <button
                  disabled={loading}
                  onClick={mockPay}
                  className="mt-3 w-full rounded-2xl bg-emerald-600 text-white py-3 disabled:opacity-50"
                >
                  {loading ? "..." : "Mock pay (DEV)"}
                </button>
              )}

              {isPaid && (
                <div className="mt-4 rounded-2xl border bg-emerald-50 p-4">
                  <div className="text-sm font-semibold text-emerald-900">Payment successful</div>
                  <div className="mt-1 text-sm text-emerald-800">
                    Your payment is completed. You can go to your sessions or open this booking.
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/app"
                      className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90"
                    >
                      Go to my sessions
                    </Link>
                    <Link
                      href={`/app/bookings/${bookingId}`}
                      className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
                    >
                      Open booking
                    </Link>
                  </div>
                </div>
              )}

              {!isPaid && (
                <div className="mt-3 text-xs text-gray-500">
                  In production, MockPay will be replaced by a real provider + webhook confirm.
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
              <b>Error:</b> {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
