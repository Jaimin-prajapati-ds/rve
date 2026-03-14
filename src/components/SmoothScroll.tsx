'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ 
      duration: 1.5, 
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Quartic Out for luxury feel
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    }}>
      {children}
    </ReactLenis>
  );
}
