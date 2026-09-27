import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RefreshResponse = {
  accessToken: string;
};

function getBaseUrl() {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    throw new Error("IVIXHUB_API_BASE_URL is not set");
  }

  return base.replace(/\/+$/, "");
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/"
  };
}

function clearAdminCookies(response: NextResponse) {
  response.cookies.set("ivixhub_admin_access", "", {
    ...cookieOptions(),
    maxAge: 0
  });

  response.cookies.set("ivixhub_admin_refresh", "", {
    ...cookieOptions(),
    maxAge: 0
  });

}

async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("ivixhub_admin_refresh")?.value;

  if (!refreshToken) {
    return null;
  }

  const backendResponse = await fetch(
    `${getBaseUrl()}/api/admin/auth/refresh`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store"
    }
  );

  if (!backendResponse.ok) {
    return null;
  }

  const data = (await backendResponse.json()) as RefreshResponse;

  return data.accessToken || null;
}

export async function POST() {
  try {
    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      const response = NextResponse.json(
        { message: "Administrator session expired" },
        { status: 401 }
      );

      clearAdminCookies(response);
      return response;
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("ivixhub_admin_access", accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to refresh administrator session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const rawNext = request.nextUrl.searchParams.get("next");
  const nextPath =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/";

  try {
    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);

      clearAdminCookies(response);
      return response;
    }

    const destination = new URL(nextPath, request.url);
    const response = NextResponse.redirect(destination);

    response.cookies.set("ivixhub_admin_access", accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60
    });

    return response;
  } catch {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);

    clearAdminCookies(response);
    return response;
  }
}
