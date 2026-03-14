'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

interface IconProfile {
  name: string;
  handle: string;
  description: string;
  image: string;
}

export default function Hero() {
  const [content, setContent] = useState<any>(null);
  const [globalContent, setGlobalContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        setContent(data.hero);
        setGlobalContent(data.global);
      });
  }, []);

  if (!content || !globalContent) return <div className="min-h-screen bg-black" />;

  const title = content.title;
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.4, 
        ease: [0.22, 1, 0.36, 1] as any 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { y: "120%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section className="relative min-h-screen pt-24 sm:pt-32 pb-12 px-6 bg-black overflow-hidden flex items-center">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1200px] mx-auto text-center"
      >
        <motion.div variants={itemVariants} className="mb-8 sx:mb-12">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#86868B] font-bold uppercase opacity-40">
            {globalContent.nav.logo}
          </span>
        </motion.div>

        <h1 className="font-sans text-[44px] sm:text-[64px] md:text-[96px] text-white font-bold tracking-[-0.04em] leading-[0.85] mb-6 sm:mb-8 px-4 flex flex-wrap justify-center overflow-hidden">
          {title.split(" ").map((word: string, i: number) => (
            <span key={i} className="inline-block mr-3 sm:mr-4 overflow-hidden py-2">
              <motion.span
                variants={letterVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div 
          variants={itemVariants}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                "0 0 0px rgba(201, 168, 76, 0)",
                "0 0 20px rgba(201, 168, 76, 0.4)",
                "0 0 0px rgba(201, 168, 76, 0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-gold" 
          />
        </motion.div>

        <motion.p 
          variants={itemVariants} 
          className="font-sans text-[#86868B] text-[15px] sm:text-base md:text-[18px] font-medium opacity-60 mb-16 sm:mb-20 px-6 max-w-[600px] mx-auto leading-relaxed"
        >
          {content.subtitle}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 sm:gap-12 px-2 sm:px-0">
          {content.icons.map((icon: IconProfile, i: number) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="flex flex-col text-left group"
              data-cursor="See Profile"
            >
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-[24px] sm:rounded-[40px] overflow-hidden mb-6 sm:mb-8 border border-white/5 bg-[#111] transition-transform duration-700 group-hover:scale-[0.98] shadow-2xl">
                <img 
                  src={icon.image} 
                  alt={icon.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" 
                />
                
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="font-sans text-white text-2xl sm:text-3xl font-bold mb-1 tracking-tight">
                    {icon.name}
                  </h3>
                  <span className="font-sans text-[#86868B] text-xs sm:text-sm font-medium tracking-wide opacity-60">
                    {icon.handle}
                  </span>
                </div>
              </div>

              <p className="font-sans text-[#86868B] text-[14px] sm:text-[15px] leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                {icon.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
