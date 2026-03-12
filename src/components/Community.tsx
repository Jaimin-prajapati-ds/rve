'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { label: "CREATORS", value: 120, suffix: "+" },
  { label: "BRANDS", value: 45, suffix: "+" },
  { label: "REACH", value: 1.5, suffix: "B+" },
  { label: "COUNTRIES", value: 12, suffix: "" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function Community() {
  return (
    <section id="community" className="py-32 px-8 md:px-16 bg-black relative overflow-hidden">
      <div className="container-narrow text-center z-10 relative">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }} // eslint-disable-line @typescript-eslint/no-explicit-any
        >
          <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-8 block">
            [ WHO WE ARE ]
          </span>
          
          <h2 className="font-sans text-4xl md:text-5xl lg:text-7xl text-white mb-10 font-bold tracking-[-0.04em] leading-[1]">
             A community of <br />
             <span className="text-white italic">Visionaries.</span>
          </h2>
          
          <p className="font-sans text-xl text-[#86868B] mb-20 opacity-70 leading-relaxed font-medium">
            RVE is more than an agency; it&apos;s a global hub for the elite. We gather the minds that shape the future of culture and commerce.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 pt-12 border-t border-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-sans text-4xl md:text-5xl text-white font-bold mb-3 tracking-tighter">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-sans text-[10px] tracking-[0.2em] text-[#86868B] font-bold uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24"
          >
            <a 
              href="https://instagram.com" 
              target="_blank" 
              className="inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full border border-white/10 transition-all group"
            >
              <span className="font-sans text-sm font-bold tracking-tight text-white">Join the Community on IG</span>
              <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[150px] rounded-full z-0 pointer-events-none" />
    </section>
  );
}
