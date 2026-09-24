import "./globals.css";

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { BrandLogo } from "@/components/BrandLogo";
import { HeaderActions } from "@/components/HeaderActions";

export const metadata: Metadata = {
  title: {
    default: "IviXHub",
    template: "%s | IviXHub"
  },
  description:
    "IviXHub — հոգեբանական աջակցության ժամանակակից առցանց հարթակ։"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const isAuthed =
    cookieStore.get("ivixhub_session")?.value === "1";

  const role =
    cookieStore.get("ivixhub_role")?.value || "CLIENT";

  const homeHref =
    isAuthed && role === "PSYCHOLOGIST"
      ? "/pro"
      : isAuthed
        ? "/app"
        : "/";

  return (
    <html lang="hy">
      <body>
        <div className="site-shell">
          <header className="sticky top-0 z-50 border-b border-[#073f43]/8 bg-white/92 backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
              <div className="flex min-w-0 items-center">
                <BrandLogo
                  href={homeHref}
                  size="sm"
                />
              </div>

              <HeaderActions
                isAuthed={isAuthed}
                homeHref={homeHref}
              />
            </div>
          </header>

          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
