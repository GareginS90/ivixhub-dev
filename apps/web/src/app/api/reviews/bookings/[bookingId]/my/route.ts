import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function GET(_: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { bookingId } = await ctx.params;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/reviews/bookings/${encodeURIComponent(bookingId)}/my`,
    method: "GET"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { message: "Review fetch failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}
