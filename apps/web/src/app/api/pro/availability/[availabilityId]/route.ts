import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function DELETE(_: Request, ctx: { params: Promise<{ availabilityId: string }> }) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { availabilityId } = await ctx.params;

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/psychologists/availability/${encodeURIComponent(availabilityId)}`,
    method: "DELETE"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Delete psychologist availability failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json({ ok: true });
}
