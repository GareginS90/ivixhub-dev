import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function POST(_: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { bookingId } = await ctx.params;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/sessions/${encodeURIComponent(bookingId)}/video/join`,
    method: "POST"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { message: "Video join failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}
