import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function GET() {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/psychologists/availability",
    method: "GET"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Fetch psychologist availability failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(await r.json());
}

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const body = await req.json();

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/psychologists/availability",
    method: "POST",
    body
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { message: "Create psychologist availability failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(await r.json());
}
