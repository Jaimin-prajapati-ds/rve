'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function IndustrySection() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => setContent(data.industry));
  }, []);

  if (!content) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1] as any 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as any 
      }
    }
  };

  return (
    <section className="py-24 sm:py-32 px-6 md:px-16 bg-black overflow-hidden border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-16 sm:mb-20">
            <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-6 sm:mb-8 block">
              {content.subtitle}
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-6xl text-white font-bold tracking-[-0.04em] leading-[1.2] sm:leading-tight px-2 sm:px-0">
              {content.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
            {content.items.map((industry: any, i: number) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-8 transition-all hover:bg-white/[0.04] hover:border-white/10"
              >
                 <div className="flex justify-between items-start mb-10 sm:mb-12">
                    <h3 className="font-sans text-xl sm:text-2xl text-white font-bold tracking-tight">
                       {industry.title}
                    </h3>
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white text-white group-hover:text-black transition-all">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                 </div>

                 <p className="font-sans text-[#86868B] text-[14px] sm:text-base leading-relaxed mb-10 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {industry.desc}
                 </p>

                 <div className="mt-auto relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={industry.image} alt={industry.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                 </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
