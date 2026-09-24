import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function POST(req: Request, ctx: { params: Promise<{ reviewId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { reviewId } = await ctx.params;
  const body = await req.text();

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/reviews/${encodeURIComponent(reviewId)}/reply`,
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { message: "Review reply submit failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}
