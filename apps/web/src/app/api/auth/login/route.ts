import { NextResponse } from "next/server";

type LoginRequest = { email: string; password: string };

type AuthResponse = {
  id: string;
  email: string;
  role: "CLIENT" | "PSYCHOLOGIST" | "ADMIN";
  accessToken: string;
  refreshToken: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as LoginRequest;

  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const r = await fetch(`${base}/api/public/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ message: "Login failed", details: text }, { status: r.status });
  }

  const data = (await r.json()) as AuthResponse;

  const res = NextResponse.json({ ok: true, role: data.role });

  // Tokens in httpOnly cookies (web best practice)
  res.cookies.set("ivixhub_access", data.accessToken, {
    httpOnly: true,
    secure: false, // PROD: true (https)
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("ivixhub_refresh", data.refreshToken, {
    httpOnly: true,
    secure: false, // PROD: true (https)
    sameSite: "lax",
    path: "/",
  });

  // Non-sensitive routing cookies
  res.cookies.set("ivixhub_role", data.role, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("ivixhub_session", "1", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
