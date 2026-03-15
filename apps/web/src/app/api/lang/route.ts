import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lang } = (await req.json()) as { lang: "hy" | "ru" | "en" };
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ivixhub_lang", lang, {
    httpOnly: false,
    secure: false, // PROD: true
    sameSite: "lax",
    path: "/"
  });
  return res;
}
