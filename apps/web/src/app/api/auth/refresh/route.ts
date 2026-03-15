import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type RefreshResponse = { accessToken: string };

export async function POST() {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const jar = await cookies();
  const refresh = jar.get("ivixhub_refresh")?.value;

  if (!refresh) return NextResponse.json({ message: "No refresh token" }, { status: 401 });

  const r = await fetch(`${base}/api/public/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh })
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ message: "Refresh failed", details: text }, { status: r.status });
  }

  const data = (await r.json()) as RefreshResponse;

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ivixhub_access", data.accessToken, {
    httpOnly: true,
    secure: false, // PROD: true
    sameSite: "lax",
    path: "/"
  });

  return res;
}
