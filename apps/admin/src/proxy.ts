import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/login";
const REFRESH_PATH = "/api/auth/refresh";

const ACCESS_COOKIE = "ivixhub_admin_access";
const REFRESH_COOKIE = "ivixhub_admin_refresh";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasAccessToken = Boolean(
    request.cookies.get(ACCESS_COOKIE)?.value
  );

  const hasRefreshToken = Boolean(
    request.cookies.get(REFRESH_COOKIE)?.value
  );

  if (pathname === LOGIN_PATH) {
    if (hasAccessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";

      return NextResponse.redirect(url);
    }

    if (hasRefreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = REFRESH_PATH;
      url.search = "";
      url.searchParams.set("next", "/");

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (hasAccessToken) {
    return NextResponse.next();
  }

  if (hasRefreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = REFRESH_PATH;
    url.search = "";

    const nextPath = `${pathname}${search}`;

    url.searchParams.set(
      "next",
      nextPath.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/"
    );

    return NextResponse.redirect(url);
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.search = "";

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"
  ]
};
