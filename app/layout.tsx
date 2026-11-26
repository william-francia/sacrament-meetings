
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sacrament-meetings-two-flax.vercel.app"),
  title: { default: "Sacrament Meeting Planner", template: "%s | Sacrament Meeting Planner" },
  description: "Plan, organize, review, and print sacrament meeting programs in one simple place.",
  openGraph: { type: "website", siteName: "Sacrament Meeting Planner", title: "Sacrament Meeting Planner", description: "Plan, organize, review, and print sacrament meeting programs in one simple place.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sacrament Meeting Planner preview" }] },
  twitter: { card: "summary_large_image", title: "Sacrament Meeting Planner", description: "Plan, organize, review, and print sacrament meeting programs in one simple place.", images: ["/opengraph-image"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen`}>{children}</body>
    </html>
  );
}

