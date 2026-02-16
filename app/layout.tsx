import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HoopScout — College Basketball Player Comparison",
  description:
    "Find players with similar profiles using percentile-based bucket matching across D1 college basketball.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
