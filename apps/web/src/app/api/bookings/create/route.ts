import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bffFetch";

type CreateReq = {
  psychologistId: number;
  startAtUtc: string;
  type: "VIDEO" | "CHAT";
};

export async function POST(req: Request) {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) return NextResponse.json({ message: "IVIXHUB_API_BASE_URL is not set" }, { status: 500 });

  const body = (await req.json()) as CreateReq;

  const r = await bffFetch({
    baseUrl: base,
    path: "/api/bookings",
    method: "POST",
    body
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      {
        message: "Booking create failed",
        status: r.status,
        details: text
      },
      { status: 400 }
    );
  }

  return NextResponse.json(await r.json());
}
