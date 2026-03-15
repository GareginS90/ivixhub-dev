import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROUTES, type Role } from "@ivixhub/contracts";

function matchRoute(pathname: string) {
  for (const r of ADMIN_ROUTES) {
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

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const route = matchRoute(pathname);
  if (!route) return NextResponse.next();

  const role = getRole(req);

  if (!route.allowed.includes(role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const needsAuth = route.guards?.includes("AUTH");
  if (needsAuth) {
    const session = req.cookies.get("ivixhub_session")?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
