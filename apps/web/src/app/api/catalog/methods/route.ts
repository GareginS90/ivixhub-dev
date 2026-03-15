import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function GET(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang") || "en";

  const r = await bffFetch({
    baseUrl: base,
    path: `/api/catalog/methods?lang=${encodeURIComponent(lang)}`,
    method: "GET"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Catalog methods fetch failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(await r.json());
}
