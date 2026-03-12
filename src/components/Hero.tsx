'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const leaders = [
    { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
    { img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
    { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600' }
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-start pt-[240px] bg-black px-6 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-[920px] z-10"
      >
        {/* Top Tag (Synced Branding) */}
        <motion.div variants={itemVariants} className="mb-12">
          <span className="font-sans text-lg tracking-tight text-white font-bold opacity-30">
            [ rve ]
          </span>
        </motion.div>

        {/* 1:1 Precise Heading Sync (96px, -3.8px spacing) */}
        <motion.h1 
          variants={itemVariants} 
          className="font-sans text-[64px] md:text-[96px] text-white mb-8 leading-[1] font-bold tracking-[-0.04em]"
        >
          A premium <br /> <span className="text-white">content agency.</span>
        </motion.h1>

        {/* Subtitle (20px, Apple-Gray Sync) */}
        <motion.p 
          variants={itemVariants} 
          className="font-sans text-[#86868B] text-xl md:text-[20px] mb-20 max-w-[680px] font-medium leading-[1.2]"
        >
          Trusted by top thought leaders and global brands.
        </motion.p>

        {/* Headshot Grid (Tighter scale) */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[800px]"
        >
          {leaders.map((leader, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square rounded-[32px] overflow-hidden bg-[#2a2a2a] relative group"
            >
              <img 
                src={leader.img} 
                alt="" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Subtle Grain (Tighter opacity) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 grain mix-blend-overlay" />
    </section>
  );
}
