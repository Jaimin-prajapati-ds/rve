'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="relative py-40 px-8 md:px-16 bg-black overflow-hidden border-t border-white/5">
      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
        >
          <span className="font-sans text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-[#86868B] mb-8 block">
            [ STAY TUNED ]
          </span>
          
          <h2 className="font-sans text-4xl md:text-7xl text-white mb-8 font-bold tracking-[-0.04em]">
            One step. <span className="text-white italic">Endless insight.</span>
          </h2>
          
          <p className="font-sans text-xl text-[#86868B] mb-16 opacity-70 leading-relaxed max-w-[500px] mx-auto font-medium">
            We filter 100+ hours of world-class expert content into 3 minutes of actionable wisdom every week.
          </p>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-6 items-end justify-center"
              >
                <div className="w-full md:w-[400px] text-left">
                  <input 
                    type="email" 
                    required
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 focus:border-white py-4 text-xl font-sans font-bold tracking-tight text-white outline-none transition-colors placeholder:text-white/10"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full md:w-auto bg-white hover:bg-gold text-black hover:text-white px-10 py-4 rounded-full font-sans font-bold text-sm tracking-tight transition-all duration-300"
                >
                  Subscribe
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6"
              >
                <div className="text-white font-sans text-2xl font-bold tracking-tight">
                  ✓ You&apos;re in. Welcome.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Subtle White Glow (Sync) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] blur-[150px] rounded-full z-0 pointer-events-none" />
    </section>
  );
}
