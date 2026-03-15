import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  for (const name of ["ivixhub_access","ivixhub_refresh","ivixhub_role","ivixhub_session","ivixhub_psy_status"]) {
    res.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return res;
}
