import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

type StartReq = { phone: string };

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const body = (await req.json()) as StartReq;

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/phone/start",
    method: "POST",
    body: { phone: body.phone }
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ message: "Phone start failed", details: text }, { status: r.status });
  }

  return NextResponse.json({ ok: true });
}
