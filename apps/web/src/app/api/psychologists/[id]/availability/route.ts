import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const { id } = await ctx.params;
  const backendUrl = `${base}/api/public/psychologists/${encodeURIComponent(id)}/availability`;

  const r = await fetch(backendUrl, {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Availability fetch failed", status: r.status, backendUrl, details: text },
      { status: 502 }
    );
  }

  return NextResponse.json(await r.json());
}
