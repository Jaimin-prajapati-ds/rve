import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";

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
        url: "/og-image.png", // User likely has an image or I'll provide a placeholder logic
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="grain">
        <CustomCursor />
        <Navbar />
        {children}
        <footer className="bg-black py-16 border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-8 md:px-16 flex flex-col md:row justify-between items-center gap-8 text-[#86868B] text-[10px] font-bold uppercase tracking-[0.2em]">
            <div>© 2025 RVE Studios. All rights reserved.</div>
            <div className="flex gap-12">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
