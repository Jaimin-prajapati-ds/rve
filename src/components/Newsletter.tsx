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

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1, 
        staggerChildren: 0.2,
        ease: [0.16, 1, 0.3, 1] as any // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  };

  return (
    <section className="relative py-48 px-8 md:px-16 bg-black overflow-hidden border-t border-white/5">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[100%] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[80%] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-[900px] mx-auto text-center relative z-10"
      >
        <motion.span variants={itemVariants} className="font-sans text-[11px] tracking-[0.5em] opacity-30 uppercase font-bold text-[#86868B] mb-12 block">
          [ STAY TUNED ]
        </motion.span>
        
        <motion.h2 variants={itemVariants} className="font-sans text-[48px] md:text-[80px] text-white mb-10 font-bold tracking-[-0.04em] leading-[1.1]">
          One step. <br /> <span className="text-white italic">Endless insight.</span>
        </motion.h2>
        
        <motion.p variants={itemVariants} className="font-sans text-[18px] md:text-[22px] text-[#86868B] mb-20 opacity-70 leading-relaxed max-w-[600px] mx-auto font-medium">
          We filter 100+ hours of world-class expert content into 3 minutes of actionable wisdom every week.
        </motion.p>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              key="form"
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="relative max-w-[500px] mx-auto"
            >
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  placeholder="ENTER YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 group-hover:border-white/20 focus:border-white/40 py-6 px-8 rounded-full text-xl font-sans font-medium tracking-tight text-white outline-none transition-all placeholder:text-white/10 backdrop-blur-xl pr-[160px]"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-white/90 px-8 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all"
                >
                  Send Email
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6"
            >
              <div className="text-white font-sans text-3xl font-bold tracking-tight">
                ✓ You&apos;re in.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Copyright */}
        <motion.div variants={itemVariants} className="mt-32 pt-16 border-t border-white/[0.03]">
           <p className="font-sans text-[11px] tracking-[0.2em] text-[#86868B] font-bold uppercase opacity-20">
             © 2025 RVE Studios. All rights reserved.
           </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
