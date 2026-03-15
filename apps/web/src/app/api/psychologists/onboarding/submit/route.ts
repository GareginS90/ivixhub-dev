import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

export async function POST() {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });
  }

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/psychologists/onboarding/submit",
    method: "POST"
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ message: "Psychologist onboarding submit failed", details: text }, { status: r.status });
  }

  return NextResponse.json(await r.json());
}
