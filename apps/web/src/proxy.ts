import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_WEB_ROUTES, type Role } from "@ivixhub/contracts";

function matchRoute(pathname: string) {
  for (const r of PUBLIC_WEB_ROUTES) {
    const pattern = "^" + r.path.replace(/:[^/]+/g, "[^/]+") + "$";
    if (new RegExp(pattern).test(pathname)) return r;
  }
  return null;
}

function getRole(req: NextRequest): Role {
  const role = req.cookies.get("ivixhub_role")?.value as Role | undefined;
  return role ?? "GUEST";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/brand")
  ) {
    return NextResponse.next();
  }

  const route = matchRoute(pathname);
  if (!route) {
    return NextResponse.next();
  }

  const role = getRole(req);
  const needsAuth = route.guards?.includes("AUTH");
  const access = req.cookies.get("ivixhub_access")?.value;

  if (needsAuth && !access) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!route.allowed.includes(role)) {
    const url = req.nextUrl.clone();

    if (role === "CLIENT") {
      url.pathname = "/app";
    } else if (role === "PSYCHOLOGIST") {
      url.pathname = "/pro";
    } else {
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
    }

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"]
};
