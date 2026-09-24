import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function GET() {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/reviews/me/received",
    method: "GET"
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { message: "Received reviews fetch failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : []);
}
