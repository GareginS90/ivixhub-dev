import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function POST(_: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const { bookingId } = await ctx.params;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
    method: "POST"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Cancel booking failed", status: r.status, details: text },
      { status: 400 }
    );
  }

  return NextResponse.json(await r.json());
}
