import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type Params = {
  params: Promise<{
    notificationId: string;
  }>;
};

function tryParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(_: Request, context: Params) {
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

  const { notificationId } = await context.params;

  const r = await fetch(`${base}/api/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  const text = await r.text();
  const parsed = tryParse(text);

  if (!r.ok) {
    return NextResponse.json(
      parsed || { message: "Notification read failed", details: text },
      { status: r.status }
    );
  }

  return NextResponse.json(parsed || { ok: true }, { status: 200 });
}
