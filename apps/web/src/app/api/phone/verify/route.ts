import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

type VerifyReq = { phone?: string; code: string };

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const incomingUrl = new URL(req.url);
  const body = (await req.json()) as VerifyReq;

  const phone = body.phone || incomingUrl.searchParams.get("phone") || "";
  if (!phone) {
    return NextResponse.json(
      { message: "Phone verify failed", details: "phone is required" },
      { status: 400 }
    );
  }

  const path = `/api/phone/verify?phone=${encodeURIComponent(phone)}`;

  const r = await bffFetch({
    baseUrl: base,
    path,
    method: "POST",
    body: { code: body.code }
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Phone verify failed", details: text },
      { status: r.status }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ivixhub_phone_verified", "1", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/"
  });
  return res;
}
