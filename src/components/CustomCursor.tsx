'use client';

import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const pathname = usePathname();
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const springConfig = { damping: 30, stiffness: 200 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    const mouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverData = target.closest('[data-cursor]');
      
      if (hoverData) {
        setIsHovering(true);
        setHoverText(hoverData.getAttribute('data-cursor') || "");
      } else if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
        setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [cursorX, cursorY, pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[10000] hidden md:block mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[10000] hidden md:block border border-white/20"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? (hoverText ? 120 : 60) : 40,
          height: isHovering ? (hoverText ? 120 : 60) : 40,
        }}
        animate={{
          scale: isHovering ? 1 : 0.8,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0)",
          backdropFilter: isHovering ? "blur(10px)" : "blur(0px)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {hoverText && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] uppercase font-bold tracking-widest text-white text-center px-4"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
