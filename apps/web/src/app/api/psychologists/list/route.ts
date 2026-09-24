import { NextResponse } from "next/server";

type PsychologistResponse = {
  psychologistId: number;
  avatarUrl?: string | null;
  [key: string]: unknown;
};

export async function GET(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const path =
    process.env.IVIXHUB_PSY_PUBLIC_LIST_PATH ||
    "/api/public/psychologists";

  const url = new URL(req.url);

  const lang = url.searchParams.get("lang");
  const gender = url.searchParams.get("gender");
  const method = url.searchParams.get("method");
  const tag = url.searchParams.get("tag");
  const specialization =
    url.searchParams.get("specialization") || tag;
  const ageFrom = url.searchParams.get("ageFrom");
  const ageTo = url.searchParams.get("ageTo");

  const backendUrl = new URL(
    `${base.replace(/\/+$/, "")}${path}`
  );

  if (lang) {
    backendUrl.searchParams.set("language", lang);
  }

  if (gender) {
    backendUrl.searchParams.set("gender", gender);
  }

  if (method) {
    backendUrl.searchParams.set("method", method);
  }

  if (specialization) {
    backendUrl.searchParams.set(
      "specialization",
      specialization
    );
  }

  if (ageFrom) {
    backendUrl.searchParams.set("ageFrom", ageFrom);
  }

  if (ageTo) {
    backendUrl.searchParams.set("ageTo", ageTo);
  }

  try {
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();

      return NextResponse.json(
        {
          message: "Psychologists list fetch failed",
          status: response.status,
          details,
        },
        { status: 502 }
      );
    }

    const psychologists =
      (await response.json()) as PsychologistResponse[];

    const result = psychologists.map((psychologist) => ({
      ...psychologist,
      avatarUrl: psychologist.avatarUrl
        ? `/api/psychologists/${psychologist.psychologistId}/avatar`
        : null,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Psychologists service unavailable" },
      { status: 502 }
    );
  }
}
