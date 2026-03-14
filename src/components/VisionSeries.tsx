'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function VisionSeries() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => setContent(data.vision));
  }, []);

  if (!content) return null;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <section id="vision" className="py-32 px-8 md:px-16 bg-black relative overflow-hidden">
      <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Text */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={itemVariants}
        >
          <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-8 block">
            {content.tagline}
          </span>
          
          <h2 className="font-sans text-3xl sm:text-4xl md:text-6xl text-white mb-8 font-bold tracking-[-0.04em] leading-[1.1]">
            {content.title1} <br />
            <span className="text-white italic">{content.title2}</span>
          </h2>
          
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#86868B] mb-10 opacity-70 leading-relaxed max-w-[500px] font-medium">
            {content.description}
          </p>

          <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="px-6 py-2 border border-white/10 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-white/40">
                {content.launchTag}
             </div>
             <a 
               href={content.ctaLink} 
               className="font-sans text-sm text-white border-b border-white/20 hover:border-gold hover:text-gold transition-all pb-1 tracking-tight font-bold"
             >
               {content.ctaText}
             </a>
          </div>
        </motion.div>

        {/* Right Side: Video Container */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
           className="relative"
        >
          <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full translate-x-12 translate-y-12" />
          
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-[#111] border border-white/5 shadow-2xl group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center z-20">
               <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700">
                  <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.5 3.5v13L15.5 10 4.5 3.5z" />
                  </svg>
               </div>
            </div>

            <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10" />
            
            <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
               <div className="w-1.5 h-1.5 bg-white opacity-40 rounded-full animate-pulse" />
               <span className="font-sans text-[10px] tracking-[0.3em] text-white/40 uppercase font-bold">{content.episodeTag}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
