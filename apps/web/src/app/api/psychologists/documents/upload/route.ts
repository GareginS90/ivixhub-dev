import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function tryParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function refreshAccess(base: string, refreshToken: string): Promise<string | null> {
  const r = await fetch(`${base}/api/public/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (!r.ok) return null;

  const j = (await r.json()) as { accessToken: string };
  return j.accessToken;
}

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const jar = await cookies();
    const access = jar.get("ivixhub_access")?.value;
    const refresh = jar.get("ivixhub_refresh")?.value;

    const incoming = await req.formData();

    const docType = incoming.get("docType");
    const file = incoming.get("file");

    if (!docType || typeof docType !== "string") {
      return NextResponse.json(
        { message: "Document type is required" },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 }
      );
    }

    const buildFormData = () => {
      const outgoing = new FormData();
      outgoing.append("docType", docType);
      outgoing.append("file", file, file.name);
      return outgoing;
    };

    const doRequest = async (token?: string) => {
      return fetch(`${base}/api/psychologists/documents/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: buildFormData(),
        cache: "no-store"
      });
    };

    let backendRes = await doRequest(access);
    let activeAccess = access;

    if (backendRes.status === 401 && refresh) {
      const newAccess = await refreshAccess(base, refresh);

      if (newAccess) {
        jar.set("ivixhub_access", newAccess, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/"
        });

        activeAccess = newAccess;
        backendRes = await doRequest(activeAccess);
      }
    }

    const text = await backendRes.text();
    const parsed = tryParseJson(text);

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          message:
            parsed?.detail ||
            parsed?.message ||
            "Failed to upload file",
          details: text
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(parsed ?? { ok: true });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Failed to upload file",
        details: e?.message || "Unexpected error"
      },
      { status: 500 }
    );
  }
}
