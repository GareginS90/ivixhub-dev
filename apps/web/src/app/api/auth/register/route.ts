import { NextResponse } from "next/server";

function tryParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const body = await req.json();

  const r = await fetch(`${base}/api/public/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const text = await r.text();
  const parsed = tryParse(text);

  if (!r.ok) {
    return NextResponse.json(
      parsed || { message: text || "Register failed" },
      { status: r.status }
    );
  }

  const j = parsed;
  const res = NextResponse.json(j);

  res.cookies.set("ivixhub_access", j.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.cookies.set("ivixhub_refresh", j.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.cookies.set("ivixhub_role", j.role, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.cookies.set("ivixhub_session", "1", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  return res;
}
