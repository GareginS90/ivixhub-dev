import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

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

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/account-deletion/request",
    method: "POST",
    body
  });

  const text = await r.text();

  if (!r.ok) {
    return NextResponse.json(
      tryParse(text) || { message: "Failed to send account deletion request", details: text },
      { status: r.status }
    );
  }

  if (!text || !text.trim()) {
    return NextResponse.json({ status: "PENDING" });
  }

  return NextResponse.json(tryParse(text));
}
