import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function POST(_: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const { bookingId } = await ctx.params;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/payments/mock/pay/${encodeURIComponent(bookingId)}`,
    method: "POST"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ message: "Mock pay failed", status: r.status, details: text }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
