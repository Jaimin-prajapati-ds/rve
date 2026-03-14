'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-[40px] p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <span className="font-sans text-[10px] tracking-[0.5em] text-gold uppercase font-bold mb-4 block">
            Security Gateway
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight text-center uppercase">RVE Studios</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[12px] uppercase tracking-widest text-[#86868B] font-bold mb-2 ml-4">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-[12px] uppercase tracking-widest text-[#86868B] font-bold mb-2 ml-4">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-gold text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform active:scale-95"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </main>
  );
}
