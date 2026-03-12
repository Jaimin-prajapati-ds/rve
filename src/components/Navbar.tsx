'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 sm:top-8 left-0 w-full z-[100] flex justify-center px-4 sm:px-6">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }} // eslint-disable-line @typescript-eslint/no-explicit-any
        className="flex items-center gap-6 sm:gap-8 md:gap-14 px-6 sm:px-10 py-0 h-[56px] sm:h-[64px] rounded-[80px] border border-white/5 bg-white/[0.01] backdrop-blur-[12px] transition-all duration-500 shadow-2xl"
      >
        {/* Logo Tag */}
        <div className="flex items-center text-white font-sans text-base sm:text-lg tracking-[-0.02em] font-bold">
           <span className="opacity-20">[</span>
           <span className="mx-1 lowercase">rve</span>
           <span className="opacity-20">]</span>
        </div>

        {/* Nav Links (16px, Medium weight synced) */}
        <div className="hidden md:flex items-center gap-10 font-sans text-[16px] font-medium tracking-[-0.01em] text-white/90">
          <a href="#community" className="hover:text-gold transition-colors">Community</a>
          <a href="#services" className="hover:text-gold transition-colors">Work with us</a>
          <a href="#vision" className="hover:text-gold transition-colors">The Genius Series</a>
        </div>

        {/* Mobile Hamburger (More refined) */}
        <div className="md:hidden flex flex-col gap-1.5 w-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
           <div className="h-[1.5px] w-full bg-white" />
           <div className="h-[1.5px] w-full bg-white" />
        </div>
      </motion.nav>
    </div>
  );
}
