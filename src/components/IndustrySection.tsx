'use client';

import { motion } from 'framer-motion';

const industries = [
  {
    title: "Automotive",
    desc: "Dynamic reels, product highlights, and cinematic vehicle showcases.",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Hotels",
    desc: "Present your property as a premium destination.",
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Products",
    desc: "Trending launches, detailed showcases, and visually-rich product photos.",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Fashion shoot",
    desc: "Make bold style statements with every frame.",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Pets",
    desc: "Adorable reels, heartwarming moments, and premium pet product features.",
    img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Hospital",
    desc: "Capture the essence of comfort and experience.",
    img: "https://images.unsplash.com/photo-1512678080530-7760d61f86a0?auto=format&fit=crop&q=80&w=800"
  }
];

export default function IndustrySection() {
  return (
    <section className="py-32 px-6 md:px-16 bg-black text-white">
      <div className="container-wide">
        
        {/* Header Labels (Synced 10px Bold) */}
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
           <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B]">// INDUSTRIES //</span>
           <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B]">// MARKETS //</span>
        </div>

        {/* Section Title (Synced 48px Centered) */}
        <div className="text-center mb-20 container-narrow">
           <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white leading-[1.1]">
             Visual Solutions Across Diverse Industries
           </h2>
        </div>

        {/* Card Grid (Professional 3-column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
              className="bg-[#111] rounded-[24px] overflow-hidden border border-white/5 flex flex-col group hover:border-white/20 transition-all duration-700"
            >
              {/* Image Container */}
              <div className="w-full aspect-[16/10] overflow-hidden relative">
                 <img 
                   src={item.img} 
                   alt={item.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                 />
              </div>
              
              {/* Content Area */}
              <div className="p-8 flex flex-col h-full">
                <div className="mb-6">
                   <h3 className="font-sans text-2xl mb-3 font-bold tracking-tight text-white">{item.title}</h3>
                   <p className="font-sans text-[#86868B] text-[15px] leading-relaxed mb-8 min-h-[48px] font-medium">
                     {item.desc}
                   </p>
                </div>
                
                <button className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold text-xs tracking-tight hover:bg-gold hover:text-white transition-all duration-300 w-fit uppercase">
                  View Case Study
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
