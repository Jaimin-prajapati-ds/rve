import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent";

export const metadata: Metadata = {
  title: "[rve] Premium Content Agency",
  description: "RVE is a premium content agency helping thought leaders and global brands grow through strategy, storytelling.",
  openGraph: {
    title: "[rve] Premium Content Agency",
    description: "RVE is a premium content agency helping thought leaders and global brands grow through strategy, storytelling.",
    url: "https://rvestudios.vercel.app",
    siteName: "RVE Studios",
    images: [
      {
        url: "https://rvestudios.vercel.app/og-image.png", 
        width: 1200,
        height: 630,
        alt: "RVE Studios Hero",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "[rve] Premium Content Agency",
    description: "RVE is a premium content agency helping thought leaders and global brands grow through strategy, storytelling.",
    images: ["https://rvestudios.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LayoutContent>
        {children}
      </LayoutContent>
    </html>
  );
}
