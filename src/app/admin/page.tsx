'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ImageUpload({ currentUrl, onUpload, onError }: { currentUrl: string; onUpload: (url: string) => void; onError?: (err: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        onUpload(result.url);
      } else {
        const err = await res.json().catch(() => ({}));
        onError?.(err.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      onError?.('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input 
          type="text" 
          value={currentUrl || ''}
          readOnly
          className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] font-mono opacity-50 outline-none"
        />
        <label className={`cursor-pointer px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${uploading ? 'bg-white/10 text-white/40' : 'bg-white text-black hover:bg-gold'}`}>
          {uploading ? 'Uploading...' : 'Upload PNG'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>
      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] relative group">
        {currentUrl ? (
          <img src={currentUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] uppercase font-bold tracking-widest">No Image</div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storageStatus, setStorageStatus] = useState<{postgres: boolean; blob: boolean}>({postgres: true, blob: true});

  useEffect(() => {
    if (data && originalData) {
      setHasUnsavedChanges(JSON.stringify(data) !== JSON.stringify(originalData));
    }
  }, [data, originalData]);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const res = await fetch('/api/cms');
        const d = await res.json();
        if (d.error?.includes('PRODUCTION_STORAGE_MISSING') || (d._system?.storageMissing)) {
           setStorageStatus({ postgres: false, blob: true });
        }
        setData(JSON.parse(JSON.stringify(d)));
        setOriginalData(JSON.parse(JSON.stringify(d)));
      } catch (err) {
        setMessage('ERROR FETCHING DATA');
      } finally {
        setLoading(false);
      }
    };
    checkStorage();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setMessage('PUBLISHED TO CLOUD');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage(`ERROR: ${errorData.error || 'SAVE FAILED'}`);
      }
    } catch (err) {
      setMessage('SYSTEM CONNECTION ERROR');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateNested = (path: string, val: any) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = val;
    setData(newData);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-b-2 border-gold rounded-full animate-spin" />
      <div className="text-white/20 font-mono text-[10px] tracking-[0.5em] uppercase animate-pulse">Initializing Luxury Suite</div>
    </div>
  );

  const tabs = [
    { id: 'hero', label: 'Identity', icon: '✦' },
    { id: 'industry', label: 'Markets', icon: '◈' },
    { id: 'services', label: 'Solutions', icon: '▣' },
    { id: 'community', label: 'Metrix', icon: '♒' },
    { id: 'vision', label: 'Chronicle', icon: '❂' },
    { id: 'newsletter', label: 'Nexus', icon: '✉' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row h-screen overflow-hidden selection:bg-gold selection:text-black">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-[320px] bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[100]">
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center font-black text-[12px] shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform font-mono">RVE</div>
            <div className="flex flex-col">
              <span className="font-black text-[16px] tracking-tighter uppercase leading-none">Studio</span>
              <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Directorial Suite</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 py-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[20px] transition-all duration-500 group ${activeTab === tab.id ? 'bg-white/5 border border-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-[12px] transition-colors ${activeTab === tab.id ? 'text-gold' : 'text-white/10 group-hover:text-white/30'}`}>{tab.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div layoutId="active-indicator" className="w-1 h-1 rounded-full bg-gold shadow-[0_0_10px_#c9a84c]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
           {hasUnsavedChanges && (
              <div className="bg-gold/10 border border-gold/20 px-4 py-3 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                <div className="w-1 h-1 rounded-full bg-gold" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gold/80">Unsaved Session</span>
              </div>
           )}
           <button 
             onClick={() => {
               document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
               window.location.href = "/admin/login";
             }}
             className="w-full text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-red-500 transition-colors py-4 border border-white/5 rounded-2xl hover:border-red-500/20"
           >
             Terminate
           </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <section className="flex-1 flex flex-col h-full bg-[#080808] relative overflow-hidden">
        {/* TOP STATUS BAR */}
        <header className="h-[100px] border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-xl z-50">
           <div className="flex items-center gap-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">System Status</h2>
              <div className="flex items-center gap-4 px-5 py-2 rounded-full border border-white/5 bg-white/5">
                 <div className={`w-1.5 h-1.5 rounded-full ${storageStatus.postgres ? 'bg-green-500' : 'bg-gold animate-pulse'}`} />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                    {storageStatus.postgres ? 'Cloud Storage: Active' : 'Cloud Storage: Limited'}
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className={`flex items-center gap-4 px-10 h-[50px] rounded-[18px] transition-all duration-700 font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden group relative ${saving ? 'bg-white/5 text-white/20 cursor-wait' : hasUnsavedChanges ? 'bg-gold text-black hover:scale-[1.03] active:scale-95 shadow-[0_10px_40px_rgba(201,168,76,0.2)]' : 'bg-white/5 text-white/30 cursor-not-allowed opacity-50'}`}
              >
                {saving && (
                  <motion.div initial={{ x: -100 }} animate={{ x: 300 }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-white/20 skew-x-12" />
                )}
                <span>{saving ? 'Syncing...' : 'Publish Evolution'}</span>
                <span className="text-[14px]">✦</span>
              </button>
           </div>
        </header>

        {/* SCROLLABLE CANVAS */}
        <div className="flex-1 overflow-y-auto p-10 lg:p-20 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {!storageStatus.postgres && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-8 rounded-[32px] bg-gold/5 border border-gold/10 flex items-center justify-between">
                <p className="text-[11px] text-[#86868B] leading-relaxed max-w-2xl font-medium">
                  <span className="text-gold font-bold uppercase tracking-widest mr-3">System Alert:</span>
                  Persistence layer is disconnected. Changes are temporary. Please link **Vercel Postgres** in your dashboard settings to enable permanent evolution.
                </p>
                <a href="https://vercel.com/dashboard" target="_blank" className="text-gold border border-gold/30 px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all">Link Now</a>
              </motion.div>
            )}

            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1000px] space-y-20">
                <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Visual Identity</h1>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em] font-bold">Headline & Featured Directors</p>
                </div>

                <div className="grid gap-8 p-10 rounded-[44px] bg-white/[0.02] border border-white/5 shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 ml-6">Primary Manifesto</label>
                    <input 
                      type="text" 
                      value={data.hero?.title || ''}
                      onChange={(e) => updateNested('hero.title', e.target.value)}
                      className="w-full bg-black border border-white/5 rounded-[24px] px-10 py-10 text-4xl font-black text-white focus:border-gold/50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 ml-6">Contextual Narrative</label>
                    <textarea 
                      value={data.hero?.subtitle || ''}
                      onChange={(e) => updateNested('hero.subtitle', e.target.value)}
                      className="w-full bg-black border border-white/5 rounded-[24px] px-10 py-10 min-h-[160px] text-lg font-medium text-white/60 focus:border-gold/50 transition-all outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="flex items-center justify-between px-6">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.4em]">Director Profiles</h3>
                      <button onClick={() => {
                        const newIcons = [...(data.hero?.icons || []), { name: "NEW DIRECTOR", handle: "@rve", description: "CRAFTING CINEMATIC REALITIES", image: "" }];
                        updateNested('hero.icons', newIcons);
                      }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white text-black transition-all font-bold">+ </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {data.hero?.icons?.map((icon: any, idx: number) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] relative group hover:border-white/20 transition-all">
                           <button onClick={() => {
                             const n = data.hero.icons.filter((_: any, i: number) => i !== idx);
                             updateNested('hero.icons', n);
                           }} className="absolute top-6 right-6 text-red-500/20 hover:text-red-500 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">Detach</button>
                           
                           <div className="space-y-8">
                             <div className="aspect-square rounded-[32px] overflow-hidden bg-black border border-white/5 relative mb-6">
                               <ImageUpload 
                                currentUrl={icon.image} 
                                onUpload={url => {
                                  const n = [...data.hero.icons];
                                  n[idx].image = url;
                                  updateNested('hero.icons', n);
                                }} 
                               />
                             </div>
                             <div className="space-y-6">
                                <input className="bg-transparent text-2xl font-black w-full border-b border-white/5 pb-2 focus:border-gold outline-none" value={icon.name} onChange={e => {
                                   const n = [...data.hero.icons];
                                   n[idx].name = e.target.value;
                                   updateNested('hero.icons', n);
                                }} />
                                <input className="bg-transparent text-[10px] font-mono text-gold/60 w-full border-b border-white/5 pb-2 focus:border-gold outline-none" value={icon.handle} onChange={e => {
                                   const n = [...data.hero.icons];
                                   n[idx].handle = e.target.value;
                                   updateNested('hero.icons', n);
                                }} />
                                <textarea className="bg-transparent text-[11px] font-medium text-white/40 w-full min-h-[80px] outline-none" value={icon.description} onChange={e => {
                                   const n = [...data.hero.icons];
                                   n[idx].description = e.target.value;
                                   updateNested('hero.icons', n);
                                }} />
                             </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'industry' && (
              <motion.div key="industry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1000px] space-y-20">
                <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Market Reach</h1>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em] font-bold">Industrial Specialization</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {data.industry?.items?.map((item: string, idx: number) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] group flex items-center gap-6">
                         <input 
                           className="flex-1 bg-transparent text-2xl font-black outline-none focus:text-gold transition-colors"
                           value={item}
                           onChange={e => {
                             const n = [...data.industry.items];
                             n[idx] = e.target.value;
                             updateNested('industry.items', n);
                           }}
                         />
                         <button onClick={() => {
                           const n = data.industry.items.filter((_: any, i: number) => i !== idx);
                           updateNested('industry.items', n);
                         }} className="text-red-500/20 hover:text-red-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Remove</button>
                      </div>
                   ))}
                   <button onClick={() => {
                     const n = [...(data.industry?.items || []), "NEW SECTOR"];
                     updateNested('industry.items', n);
                   }} className="border-2 border-dashed border-white/5 p-8 rounded-[32px] text-white/10 hover:border-gold/20 hover:text-gold transition-all text-[11px] font-black uppercase tracking-[0.4em]">Expand Reach +</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1000px] space-y-20">
                <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Solutions</h1>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em] font-bold">Core Competencies & Offerings</p>
                </div>
                
                <div className="space-y-8">
                   {data.services?.items?.map((service: any, idx: number) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 p-10 rounded-[44px] group relative">
                         <button onClick={() => {
                           const n = data.services.items.filter((_: any, i: number) => i !== idx);
                           updateNested('services.items', n);
                         }} className="absolute top-8 right-8 text-red-500/20 hover:text-red-500 text-[9px] font-black uppercase tracking-widest">Terminate Service</button>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                               <input 
                                 className="bg-transparent text-3xl font-black w-full border-b border-white/5 pb-4 focus:border-gold outline-none" 
                                 value={service.title} 
                                 onChange={e => {
                                   const n = [...data.services.items];
                                   n[idx].title = e.target.value;
                                   updateNested('services.items', n);
                                 }}
                               />
                               <textarea 
                                 className="bg-transparent text-lg font-medium text-white/40 w-full min-h-[120px] outline-none leading-relaxed" 
                                 value={service.description} 
                                 onChange={e => {
                                   const n = [...data.services.items];
                                   n[idx].description = e.target.value;
                                   updateNested('services.items', n);
                                 }}
                               />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10">Project Imagery</label>
                               <ImageUpload 
                                 currentUrl={service.image}
                                 onUpload={url => {
                                   const n = [...data.services.items];
                                   n[idx].image = url;
                                   updateNested('services.items', n);
                                 }}
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                   <button onClick={() => {
                      const n = [...(data.services?.items || []), { title: "NEW SOLUTION", description: "DESCRIBE THE IMPACT...", image: "" }];
                      updateNested('services.items', n);
                   }} className="w-full border-2 border-dashed border-white/5 p-10 rounded-[44px] text-white/10 hover:border-gold/20 hover:text-gold transition-all text-[11px] font-black uppercase tracking-[0.4em]">Add Solution Module +</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div key="community" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1000px] space-y-20">
                <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Metrix</h1>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em] font-bold">Social Proof & Connectivity</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Instagram Stats</label>
                      <input 
                        className="bg-black/40 border border-white/5 rounded-2xl p-6 w-full text-4xl font-black text-gold outline-none focus:border-gold/50"
                        value={data.community?.stats?.instagram || ''}
                        onChange={e => updateNested('community.stats.instagram', e.target.value)}
                      />
                   </div>
                   <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Client Network</label>
                      <input 
                        className="bg-black/40 border border-white/5 rounded-2xl p-6 w-full text-4xl font-black text-gold outline-none focus:border-gold/50"
                        value={data.community?.stats?.clients || ''}
                        onChange={e => updateNested('community.stats.clients', e.target.value)}
                      />
                   </div>
                   <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Project Volume</label>
                      <input 
                        className="bg-black/40 border border-white/5 rounded-2xl p-6 w-full text-4xl font-black text-gold outline-none focus:border-gold/50"
                        value={data.community?.stats?.projects || ''}
                        onChange={e => updateNested('community.stats.projects', e.target.value)}
                      />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vision' && (
              <motion.div key="vision" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1000px] space-y-20">
                 <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Chronicle</h1>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em] font-bold">The RVE Philosophy & Timeline</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[44px] space-y-10">
                   <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 ml-6">Vision Manifesto</label>
                      <textarea 
                        className="w-full bg-black border border-white/5 rounded-[32px] px-10 py-10 min-h-[300px] text-xl font-medium text-white/80 focus:border-gold/50 transition-all outline-none leading-relaxed"
                        value={data.vision?.content || ''}
                        onChange={e => updateNested('vision.content', e.target.value)}
                      />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'newsletter' && (
              <motion.div key="newsletter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1000px] space-y-20">
                 <div className="space-y-4">
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Nexus</h1>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em] font-bold">Audience Engagement & Capture</p>
                </div>

                <div className="grid gap-8 p-10 rounded-[44px] bg-white/[0.02] border border-white/5">
                   <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 ml-6">Nexus Call to Action</label>
                      <input 
                        className="w-full bg-black border border-white/5 rounded-[24px] px-10 py-10 text-2xl font-black text-white focus:border-gold/50 outline-none"
                        value={data.newsletter?.title || ''}
                        onChange={e => updateNested('newsletter.title', e.target.value)}
                      />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* GLOBAL MESSAGE */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ y: 100, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-12 left-1/2 bg-white text-black z-[1000] px-10 py-5 rounded-[22px] shadow-[0_30px_90px_rgba(0,0,0,0.8)] flex items-center gap-6"
            >
              <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </main>
  );
}
