'use client';

import { motion } from 'framer-motion';

const services = [
  {
    title: "Content Team",
    desc: "We act as your head of content. Strategy, creative, production — all handled by our team.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    tag: "[valuable]",
    id: "01"
  },
  {
    title: "YouTube Growth",
    desc: "End-to-end YouTube support. Strategy, scripting, editing, thumbnails, and optimization.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200",
    tag: "[strategic]",
    id: "02"
  }
];

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="services" className="py-24 px-6 md:px-16 bg-black">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-[1200px] mx-auto flex flex-col gap-12"
      >
        {/* Section Header (Synced 1:1) */}
        <motion.div variants={cardVariants} className="mb-20">
           <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-8 block">
            [ OUR SERVICES ]
          </span>
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-[-0.04em] leading-[1]">
            Visual Solutions. <br /> <span className="text-white">For the next era.</span>
          </h2>
        </motion.div>

        {/* Staggered Horizontal Cards (Screenshot Reconstruction) */}
        <div className="flex flex-col gap-16 md:gap-24">
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ scale: 0.99 }}
              className={`relative bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl rounded-[40px] border border-white/5 overflow-hidden flex flex-col md:flex-row group transition-all duration-700 min-h-[500px] shadow-2xl`}
            >
              {/* Content Side */}
              <div className="flex-[1.2] p-10 md:p-16 flex flex-col justify-end relative z-10">
                <div className="mb-auto">
                   <span className="font-sans text-[12px] tracking-[0.2em] text-[#86868B] font-bold opacity-40">
                     // {service.id} //
                   </span>
                </div>
                
                <div>
                  <h3 className="font-sans text-5xl md:text-7xl lg:text-8xl text-white mb-8 font-bold tracking-[-0.04em]">
                    {service.title}
                  </h3>
                  
                  <p className="font-sans text-[#86868B] text-xl md:text-[20px] max-w-[450px] leading-[1.3] font-medium opacity-80">
                    {service.desc}
                  </p>
                </div>
              </div>

              {/* Media Side (Right) */}
              <div className="flex-1 relative overflow-hidden min-h-[300px] md:min-h-full">
                 <img 
                   src={service.img} 
                   alt={service.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 grayscale hover:grayscale-0" 
                 />
                 
                 {/* Visual Tag Overlay (Synced to SS) */}
                 <div className="absolute inset-x-0 bottom-12 flex justify-center z-20 pointer-events-none">
                    <span className="font-sans text-2xl md:text-4xl text-white font-bold tracking-[-0.02em] opacity-90 drop-shadow-2xl">
                       {service.tag}
                    </span>
                 </div>

                 {/* Subtle Light Effect */}
                 <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent z-10" />
              </div>

              {/* Decorative Number Outline */}
              <div className="absolute top-10 right-10 text-white opacity-[0.02] font-sans font-bold text-[18rem] leading-none select-none pointer-events-none">
                 {service.id}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
