import { NextResponse } from "next/server";

type AdminLoginRequest = {
  email: string;
  password: string;
};

type AuthResponse = {
  id: number;
  email: string;
  role: "ADMIN";
  accessToken: string;
  refreshToken: string;
};

function getBaseUrl() {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    throw new Error("IVIXHUB_API_BASE_URL is not set");
  }

  return base.replace(/\/+$/, "");
}

function tryParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdminLoginRequest;

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${getBaseUrl()}/api/admin/auth/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        }),
        cache: "no-store"
      }
    );

    const text = await backendResponse.text();
    const parsed = tryParse(text);

    if (!backendResponse.ok) {
      return NextResponse.json(
        parsed || { message: "Login failed" },
        { status: backendResponse.status }
      );
    }

    const data = parsed as AuthResponse;

    if (
      !data ||
      data.role !== "ADMIN" ||
      !data.accessToken ||
      !data.refreshToken
    ) {
      return NextResponse.json(
        { message: "Invalid administrator session" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      email: data.email
    });

    const secure = process.env.NODE_ENV === "production";

    response.cookies.set(
      "ivixhub_admin_access",
      data.accessToken,
      {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
      }
    );

    response.cookies.set(
      "ivixhub_admin_refresh",
      data.refreshToken,
      {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to sign in" },
      { status: 500 }
    );
  }
}
