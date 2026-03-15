import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const path = process.env.IVIXHUB_PSY_PUBLIC_LIST_PATH || "/api/public/psychologists";

  const url = new URL(req.url);

  // UI params -> backend params
  const lang = url.searchParams.get("lang");                 // HY/RU/EN
  const method = url.searchParams.get("method");             // lowercase code
  const tag = url.searchParams.get("tag");                   // specialization code (lowercase)
  const specialization = url.searchParams.get("specialization") || tag;

  const backendUrl = new URL(`${base}${path}`);
  if (lang) backendUrl.searchParams.set("language", lang);
  if (method) backendUrl.searchParams.set("method", method);
  if (specialization) backendUrl.searchParams.set("specialization", specialization);

  const r = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Psychologists list fetch failed", status: r.status, backendUrl: backendUrl.toString(), details: text },
      { status: 502 }
    );
  }

  return NextResponse.json(await r.json());
}
