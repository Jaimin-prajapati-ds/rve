'use client';

import { motion } from 'framer-motion';

const clients = [
  { handle: "@raviverma", name: "Ravi Verma", desc: "Entrepreneur & keynote speaker", initials: "RV" },
  { handle: "@rvecreates", name: "RVE Creates", desc: "India's top creator collective", initials: "RC" },
  { handle: "@arjunshah", name: "Arjun Shah", desc: "NYT-featured startup founder", initials: "AS" },
  { handle: "@designbyneha", name: "Neha Kapoor", desc: "Award-winning brand designer", initials: "NK" },
  { handle: "@growthwala", name: "Growthwala", desc: "Leading D2C growth community", initials: "GW" },
  { handle: "@thevisionlab", name: "The Vision Lab", desc: "Premium productivity brand", initials: "VL" },
];

export default function ClientMarquee() {
  const marqueeItems = [...clients, ...clients, ...clients];

  return (
    <section className="py-24 bg-black border-y border-white/5 overflow-hidden">
      <div className="flex">
        <motion.div 
          className="flex gap-8 px-4"
          animate={{ x: [0, -100 * clients.length + "%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {marqueeItems.map((client, idx) => (
            <div 
              key={idx} 
              className="group relative w-[220px] h-[300px] flex-shrink-0 bg-[#111] rounded-2xl overflow-hidden cursor-pointer border border-white/5 transition-all duration-500 hover:border-white/20"
            >
              <div className="absolute inset-0 flex items-center justify-center font-sans text-8xl text-white/5 select-none font-bold">
                {client.initials}
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="font-sans text-[#86868B] text-xs tracking-wider mb-1 block font-bold uppercase">{client.handle}</span>
                <h4 className="font-sans text-white text-lg mb-1 font-bold">{client.name}</h4>
                <p className="font-sans text-[#86868B] text-[10px] leading-relaxed opacity-80 font-medium">{client.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
