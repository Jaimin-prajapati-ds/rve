'use client';

import { motion } from 'framer-motion';

const industries = [
  {
    title: "Automotive",
    desc: "Dynamic reels, product highlights, and cinematic vehicle showcases.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Hotels",
    desc: "Present your property as a premium destination.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Products",
    desc: "Trending launches, detailed showcases, and visually-rich product photos.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Fashion",
    desc: "Make bold style statements with every frame.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Pets",
    desc: "Adorable reels, heartwarming moments, and premium pet product features.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Hospital",
    desc: "Capture the essence of comfort and experience.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
  }
];

export default function IndustrySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1] as any // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  };

  return (
    <section className="py-32 px-6 md:px-16 bg-black overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-20">
            <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-8 block">
              [ INDUSTRIES // MARKETS ]
            </span>
            <h2 className="font-sans text-4xl md:text-6xl text-white font-bold tracking-[-0.04em] leading-tight">
              Visual Solutions <br /> Across Diverse Industries
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden p-8 transition-all hover:bg-white/[0.04] hover:border-white/10"
              >
                 <div className="flex justify-between items-start mb-12">
                    <h3 className="font-sans text-2xl text-white font-bold tracking-tight">
                       {industry.title}
                    </h3>
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white text-white group-hover:text-black transition-all">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                 </div>

                 <p className="font-sans text-[#86868B] text-base leading-relaxed mb-10 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {industry.desc}
                 </p>

                 <div className="mt-auto relative aspect-video rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
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
