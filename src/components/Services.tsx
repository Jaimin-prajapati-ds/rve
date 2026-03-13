'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';

interface Service {
  title: string;
  desc: string;
  img: string;
  tag: string;
  id: string;
}

const services: Service[] = [
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
  },
  {
    title: "Brand Strategy",
    desc: "Positioning, messaging, and system-level creative direction for modern icons.",
    img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200",
    tag: "[systemic]",
    id: "03"
  }
];

function StickyCard({ service, index }: { service: Service; index: number }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9 + (index * 0.05)]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  return (
    <div 
      ref={container}
      className="sticky top-24 sm:top-28 md:top-32 py-4 sm:py-6 h-[70vh] flex items-center justify-center mb-[10vh]"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="relative w-full h-full bg-gradient-to-br from-[#111] to-black backdrop-blur-3xl rounded-[32px] sm:rounded-[40px] border border-white/10 overflow-hidden flex flex-col md:flex-row group transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        data-cursor="Read More"
      >
        {/* Content Side */}
        <div className="flex-[1.2] p-8 sm:p-10 md:p-16 flex flex-col justify-end relative z-10">
          <div className="mb-auto">
             <span className="font-sans text-[11px] sm:text-[12px] tracking-[0.2em] text-[#86868B] font-bold opacity-40">
               // {service.id} //
             </span>
          </div>
          
          <div className="mt-8 sm:mt-0">
            <h3 className="font-sans text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white mb-6 sm:mb-8 font-bold tracking-[-0.04em] leading-[0.9] overflow-hidden">
               <motion.span
                 initial={{ y: "100%" }}
                 whileInView={{ y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                 className="inline-block"
               >
                 {service.title}
               </motion.span>
            </h3>
            
            <p className="font-sans text-[#86868B] text-[15px] sm:text-lg md:text-[20px] max-w-[450px] leading-[1.4] font-medium opacity-80">
              {service.desc}
            </p>
          </div>
        </div>

        {/* Media Side */}
        <div className="flex-1 relative overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-full">
           <img 
             src={service.img} 
             alt={service.title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-2000 opacity-60 grayscale group-hover:grayscale-0" 
           />
           
           <div className="absolute inset-x-0 bottom-8 sm:bottom-12 flex justify-center z-20 pointer-events-none px-4 text-center">
              <span className="font-sans text-xl sm:text-2xl md:text-4xl text-white font-bold tracking-[-0.02em] opacity-90 drop-shadow-2xl">
                 {service.tag}
              </span>
           </div>

           <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent z-10 hidden md:block" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 md:hidden" />
        </div>

        {/* Decorative Background Number */}
        <div className="absolute top-6 sm:top-10 right-6 sm:right-10 text-white opacity-[0.01] font-sans font-bold text-[12rem] sm:text-[18rem] leading-none select-none pointer-events-none hidden sm:block">
           {service.id}
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.3, 
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  };

  const textRevealVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  };

  return (
    <section id="services" className="py-24 px-6 md:px-16 bg-black">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-16 md:mb-20"
        >
           <motion.span variants={textRevealVariants} className="font-sans text-[10px] sm:text-[11px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-6 sm:mb-8 block">
            [ OUR SERVICES ]
          </motion.span>
          <motion.h2 variants={textRevealVariants} className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white font-bold tracking-[-0.04em] leading-[0.9]">
            Visual Solutions. <br /> <span className="text-white">For the next era.</span>
          </motion.h2>
        </motion.div>

        {/* Sticky Stacking Cards */}
        <div className="relative flex flex-col gap-0 pb-16 md:pb-32">
          {services.map((service, i) => (
            <StickyCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
