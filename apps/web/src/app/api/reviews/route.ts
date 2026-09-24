import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const body = await req.text();

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/reviews",
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      { message: "Review submit failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}
