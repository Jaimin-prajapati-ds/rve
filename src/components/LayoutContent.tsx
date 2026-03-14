'use client';

import { usePathname } from 'next/navigation';
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <body className="bg-black text-white">
        {children}
      </body>
    );
  }

  return (
    <body className="grain">
      <CustomCursor />
      <Navbar />
      <SmoothScroll>
        {children}
      </SmoothScroll>
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
  );
}
