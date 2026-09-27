import type { Metadata } from "next";
import "./globals.css";
import AdminSessionKeeper from "@/components/admin/AdminSessionKeeper";

export const metadata: Metadata = {
  title: "IviXHub Admin",
  description: "IviXHub administration panel"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy">
      <body className="bg-zinc-50">
        <AdminSessionKeeper />
        {children}
      </body>
    </html>
  );
}
