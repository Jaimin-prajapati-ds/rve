'use client';

import { motion, Variants } from 'framer-motion';

interface IconProfile {
  name: string;
  handle: string;
  description: string;
  image: string;
}

const modernIcons: IconProfile[] = [
  {
    name: "Malcolm Gladwell",
    handle: "@malcolmgladwell",
    description: "Seven-time NYT bestselling author, host of Revisionist History",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Scott Galloway",
    handle: "@profgalloway",
    description: "NYU professor, serial entrepreneur, NYT bestselling author",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Jesse Itzler",
    handle: "@jesseitzler",
    description: "Serial entrepreneur, co-owner of Atlanta hawks, NYT bestselling author",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Hero() {
  const title = "A premium content agency.";
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2, 
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
    <section className="relative min-h-screen pt-32 pb-12 px-6 bg-black overflow-hidden">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1200px] mx-auto text-center"
      >
        {/* Label (Small centered text) */}
        <motion.div variants={itemVariants} className="mb-10 sm:mb-14">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#86868B] font-bold uppercase opacity-40">
            [rve]
          </span>
        </motion.div>

        {/* Main Title (Liquid Reveal) */}
        <h1 className="font-sans text-[40px] sm:text-[64px] md:text-[96px] text-white font-bold tracking-[-0.04em] leading-[0.9] mb-8 px-4 flex flex-wrap justify-center overflow-hidden">
          {title.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-4 overflow-hidden py-2">
              <motion.span
                variants={letterVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants} 
          className="font-sans text-[#86868B] text-[15px] sm:text-base md:text-[18px] font-medium opacity-60 mb-16 sm:mb-20 px-6 max-w-[600px] mx-auto leading-relaxed"
        >
          Trusted by top thought leaders and global brands.
        </motion.p>

        {/* Modern Icons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 sm:gap-12 px-4 sm:px-0">
          {modernIcons.map((icon, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="flex flex-col text-left group"
              data-cursor="See Profile"
            >
              {/* Card */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-[24px] sm:rounded-[40px] overflow-hidden mb-6 sm:mb-8 border border-white/5 bg-[#111] transition-transform duration-700 group-hover:scale-[0.98]">
                <img 
                  src={icon.image} 
                  alt={icon.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" 
                />
                
                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 pt-24 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <h3 className="font-sans text-white text-2xl sm:text-3xl font-bold mb-1 tracking-tight">
                    {icon.name}
                  </h3>
                  <span className="font-sans text-[#86868B] text-xs sm:text-sm font-medium tracking-wide opacity-60">
                    {icon.handle}
                  </span>
                </div>
              </div>

              {/* Description below card */}
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
