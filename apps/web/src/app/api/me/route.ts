import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

function tryParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function GET() {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/me",
    method: "GET"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      tryParse(text) || { message: "Failed to load profile", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(tryParse(text) || null);
}
