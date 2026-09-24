import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function GET(_: Request, ctx: { params: Promise<{ clientUserId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { clientUserId } = await ctx.params;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/reviews/clients/${encodeURIComponent(clientUserId)}/summary`,
    method: "GET"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { message: "Client review summary fetch failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}
