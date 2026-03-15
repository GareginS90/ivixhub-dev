import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const type = url.searchParams.get("type");

  const backendUrl = new URL(`${base}/api/public/psychologists/${encodeURIComponent(id)}/slots`);
  if (from) backendUrl.searchParams.set("from", from);
  if (to) backendUrl.searchParams.set("to", to);
  if (type) backendUrl.searchParams.set("type", type);

  const r = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      {
        message: "Slots fetch failed",
        status: r.status,
        backendUrl: backendUrl.toString(),
        details: text
      },
      { status: 502 }
    );
  }

  const data = await r.json();
  return NextResponse.json(data);
}
