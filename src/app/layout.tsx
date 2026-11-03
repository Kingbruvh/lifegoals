import type { Metadata } from "next";
import { Provider } from "@/lib/store";
import "./globals.css";
export const metadata: Metadata = {
  title: "Life Goals Hub — Samen vooruit",
  description:
    "Een verbonden Life Goals ecosysteem. Conceptdemo — alle gegevens zijn fictief.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
