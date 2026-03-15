import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LanguageMenu } from "@/components/LanguageMenu";

export const metadata: Metadata = {
  title: "IvixHUB",
  description: "IvixHUB psychology platform"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isAuthed = (await cookies()).get("ivixhub_session")?.value === "1";
  const homeHref = isAuthed ? "/app" : "/";

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="fixed top-4 left-4 z-50">
          <Link href={homeHref} className="rounded-xl border bg-white px-4 py-2 shadow-sm hover:bg-gray-50 font-semibold">
            IvixHUB
          </Link>
        </div>

        <div className="fixed top-4 right-4 z-50">
          <LanguageMenu />
        </div>

        {children}
      </body>
    </html>
  );
}
