import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ivixhub_access")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const r = await fetch(`${base}/api/notifications/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  const text = await r.text();
  const parsed = tryParse(text);

  if (!r.ok) {
    return NextResponse.json(
      parsed || { message: "Notifications fetch failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(
    parsed || { unreadCount: 0, items: [] },
    { status: 200 }
  );
}
