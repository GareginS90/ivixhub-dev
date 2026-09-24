import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

type Params = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function GET(req: Request, ctx: Params) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { bookingId } = await ctx.params;
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit");
  const beforeId = url.searchParams.get("beforeId");

  const qs = new URLSearchParams();
  if (limit) qs.set("limit", limit);
  if (beforeId) qs.set("beforeId", beforeId);

  const path =
    `/api/chat/${encodeURIComponent(bookingId)}` +
    (qs.toString() ? `?${qs.toString()}` : "");

  const r = await bffFetch({
    baseUrl: base,
    path,
    method: "GET"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Fetch chat failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(await r.json());
}

export async function POST(req: Request, ctx: Params) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const { bookingId } = await ctx.params;
  const body = await req.json();

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/chat/${encodeURIComponent(bookingId)}`,
    method: "POST",
    body
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Send chat message failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(await r.json());
}
