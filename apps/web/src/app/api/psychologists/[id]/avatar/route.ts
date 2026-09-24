import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { message: "Invalid psychologist id" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.IVIXHUB_API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "IVIXHUB_API_BASE_URL is not configured" },
      { status: 500 }
    );
  }

  const backendUrl =
    `${baseUrl.replace(/\/+$/, "")}/api/public/psychologists/${id}/avatar`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid avatar content type" },
        { status: 502 }
      );
    }

    const body = await response.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Cache-Control",
      response.headers.get("cache-control") ??
        "public, max-age=3600"
    );

    const contentDisposition =
      response.headers.get("content-disposition");

    if (contentDisposition) {
      headers.set("Content-Disposition", contentDisposition);
    }

    return new NextResponse(body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { message: "Avatar service unavailable" },
      { status: 502 }
    );
  }
}
