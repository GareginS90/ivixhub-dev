import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

type Req = { method: "BANK_CARD" | "IDRAM" | "TELCELL"; returnUrl?: string | null };

export async function POST(req: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const { bookingId } = await ctx.params;
  const body = (await req.json()) as Req;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/payments/intent/${encodeURIComponent(bookingId)}`,
    method: "POST",
    body: { method: body.method, returnUrl: body.returnUrl ?? null }
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ message: "Create payment intent failed", status: r.status, details: text }, { status: 400 });
  }

  return NextResponse.json(await r.json());
}
