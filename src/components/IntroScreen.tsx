'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => setContent(data.global.intro));
  }, []);

  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, content.duration || 2200);
    return () => clearTimeout(timer);
  }, [onComplete, content]);

  if (!content) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Central Logo Reveal */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.8 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center text-white font-sans text-3xl sm:text-4xl md:text-5xl tracking-[-0.04em] font-bold"
            >
              <span className="opacity-10">[</span>
              <span className="mx-4 sm:mx-6 lowercase">{content.logo}</span>
              <span className="opacity-10">]</span>
            </motion.div>

            {/* Sub-label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -bottom-10 left-0 w-full text-center font-sans text-[10px] tracking-[0.5em] text-white uppercase font-bold"
            >
              {content.subtitle}
            </motion.div>
          </div>

          {/* Liquid Progress Bar at bottom */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold origin-left opacity-30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
