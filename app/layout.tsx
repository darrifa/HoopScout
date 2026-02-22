import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const fontSans = Roboto({ subsets: ['latin'], variable: '--font-sans' });

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
    <html lang="en" className={fontSans.variable}>
      <body>{children}</body>
    </html>
  );
}
