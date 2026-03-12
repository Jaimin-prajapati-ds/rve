'use client';

import { motion } from 'framer-motion';

const modernIcons = [
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
    description: "Serial entrepreneur, co-owner of Atlanta Hawks, NYT bestselling author",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2, 
        ease: [0.16, 1, 0.3, 1] as any // eslint-disable-line @typescript-eslint/no-explicit-any
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
        ease: [0.16, 1, 0.3, 1] as any // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    }
  };

  return (
    <section className="relative min-h-screen pt-48 pb-12 px-6 bg-black">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1200px] mx-auto text-center"
      >
        {/* Label (Small centered text as per screenshot) */}
        <motion.div variants={itemVariants} className="mb-14">
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#86868B] font-bold uppercase opacity-40">
            [rve]
          </span>
        </motion.div>

        {/* Main Title (96px md, 56px sm) */}
        <motion.h1 
          variants={itemVariants}
          className="font-sans text-[64px] md:text-[96px] text-white font-bold tracking-[-0.04em] leading-[1] mb-12"
        >
          A premium <br /> content agency.
        </motion.h1>

        {/* Subtitle (Small and clean) */}
        <motion.p 
          variants={itemVariants} 
          className="font-sans text-[#86868B] text-base md:text-[18px] font-medium opacity-60 mb-20"
        >
          Trusted by top thought leaders and global brands.
        </motion.p>

        {/* Modern Icons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modernIcons.map((icon, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="flex flex-col text-left group"
            >
              {/* Card */}
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-8 border border-white/5 bg-[#111]">
                <img 
                  src={icon.image} 
                  alt={icon.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                />
                
                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <h3 className="font-sans text-white text-3xl font-bold mb-1 tracking-tight">
                    {icon.name}
                  </h3>
                  <span className="font-sans text-[#86868B] text-sm font-medium tracking-wide opacity-60">
                    {icon.handle}
                  </span>
                </div>
              </div>

              {/* Description below card */}
              <p className="font-sans text-[#86868B] text-[15px] leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                {icon.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
