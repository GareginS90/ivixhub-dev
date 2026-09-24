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

  const r = await fetch(`${base}/api/public/auth/recovery/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const text = await r.text();
  const parsed = tryParse(text);

  if (!r.ok) {
    return NextResponse.json(
      parsed || { message: "Recovery verify failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(parsed);
}
