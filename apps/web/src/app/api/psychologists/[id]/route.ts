import { NextResponse } from "next/server";

type BackendProfile = {
  psychologistId: number;
  avatarUrl?: string | null;
  [key: string]: unknown;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { message: "Invalid psychologist id" },
      { status: 400 }
    );
  }

  const backendUrl =
    `${base.replace(/\/+$/, "")}/api/public/psychologists/${encodeURIComponent(id)}`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const details = await response.text();

      return NextResponse.json(
        {
          message: "Psychologist profile fetch failed",
          status: response.status,
          details
        },
        { status: response.status === 404 ? 404 : 502 }
      );
    }

    const profile = (await response.json()) as BackendProfile;

    return NextResponse.json({
      ...profile,
      avatarUrl: profile.avatarUrl
        ? `/api/psychologists/${profile.psychologistId}/avatar`
        : null
    });
  } catch {
    return NextResponse.json(
      { message: "Psychologist profile service unavailable" },
      { status: 502 }
    );
  }
}
