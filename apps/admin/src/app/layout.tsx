import "./globals.css";
import TopBar from "@/components/admin/TopBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50">
        <TopBar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
