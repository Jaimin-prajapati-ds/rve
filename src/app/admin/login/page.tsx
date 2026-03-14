'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push(from);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Access Denied: Invalid Credentials');
      }
    } catch (err) {
      setError('Network Breach: Connection Failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[440px] bg-black border border-white/5 rounded-[48px] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
      
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center font-black text-[18px] mb-8 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]">RVE</div>
        <span className="font-mono text-[9px] tracking-[0.5em] text-gold/60 uppercase font-black mb-3 block">Security Protocol 4.0</span>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Console</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        <div className="space-y-3">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-white/20 font-black ml-4">Access ID</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-gold/30 transition-all text-sm font-medium disabled:opacity-50"
            placeholder="Username"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-white/20 font-black ml-4">Key Phrase</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-gold/30 transition-all text-sm font-medium tracking-widest disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-red-500/80 text-[10px] text-center font-black uppercase tracking-widest bg-red-500/5 py-3 rounded-xl border border-red-500/10"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-black py-5 rounded-2xl transition-all hover:bg-gold hover:text-white uppercase text-[11px] tracking-[0.3em] shadow-2xl relative overflow-hidden group active:scale-95 disabled:opacity-50"
        >
          {loading && (
            <motion.div initial={{ x: -200 }} animate={{ x: 400 }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-black/10 skew-x-12" />
          )}
          <span>{loading ? 'Authenticating...' : 'Authorize Access'}</span>
        </button>
      </form>

      <div className="mt-12 text-center">
        <span className="text-[8px] text-white/10 uppercase tracking-[0.4em] font-black">Authorized Personnel Only</span>
      </div>
    </motion.div>
  );
}

export default function AdminLogin() {
  return (
    <main className="min-h-[100dvh] bg-black flex items-center justify-center p-8 selection:bg-gold selection:text-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />
      </div>
      
      <Suspense fallback={<div className="text-white/20 font-mono text-[9px] uppercase tracking-widest animate-pulse">Initializing Interface...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
