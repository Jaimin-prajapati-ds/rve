'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SHARED COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-4 mb-16">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="text-6xl font-black tracking-tighter uppercase leading-[0.9]"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.1 }}
        className="text-gold text-[10px] uppercase font-black tracking-[0.5em] border-l-2 border-gold/30 pl-6"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder = "", type = "text", mono = false }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">{label}</label>
      <input 
        type={type} 
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-black border border-white/5 rounded-2xl px-8 py-6 text-sm text-white focus:border-gold/30 transition-all outline-none shadow-2xl ${mono ? 'font-mono text-gold' : 'font-medium'}`}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder = "" }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">{label}</label>
      <textarea 
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-white/5 rounded-3xl px-8 py-8 min-h-[140px] text-base font-medium text-white/50 focus:border-gold/30 transition-all outline-none leading-relaxed shadow-2xl resize-none"
      />
    </div>
  );
}

function ImageUpload({ currentUrl, onUpload, label = "Media Asset" }: { currentUrl: string; onUpload: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/cms/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const result = await res.json();
        onUpload(result.url);
      }
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{label}</label>
        <label className={`cursor-pointer text-[9px] font-black uppercase tracking-widest transition-all ${uploading ? 'text-gold animate-pulse' : 'text-white/40 hover:text-white'}`}>
          {uploading ? 'Processing...' : 'Change Asset'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>
      <div className="aspect-video rounded-[32px] overflow-hidden border border-white/5 bg-white/[0.01] relative group">
        {currentUrl ? (
          <img src={currentUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Preview" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[9px] uppercase font-black tracking-widest italic group-hover:text-white/10 transition-colors">No Asset Bound</div>
        )}
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD ---

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('global');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storageStatus, setStorageStatus] = useState({ postgres: true, blob: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && originalData) {
      setHasUnsavedChanges(JSON.stringify(data) !== JSON.stringify(originalData));
    }
  }, [data, originalData]);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(d => {
        if (d.error || d._system?.storageMissing) setStorageStatus(p => ({ ...p, postgres: false }));
        setData(JSON.parse(JSON.stringify(d)));
        setOriginalData(JSON.parse(JSON.stringify(d)));
        setLoading(false);
      })
      .catch(() => setMessage('CONNECTION ERROR'));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('SYNCING ENGINE...');
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setMessage('PROTOCOL SYNCED');
      } else {
        setMessage('SYNC FAILED');
      }
    } catch (err) { setMessage('CONNECTION ERROR'); } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const update = (path: string, val: any) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = val;
    setData(newData);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-12 h-12 border-t border-gold rounded-full animate-spin" />
      <span className="text-white/20 font-mono text-[9px] tracking-[0.5em] uppercase">Booting Management Console</span>
    </div>
  );

  const sidebarTabs = [
    { id: 'global', label: 'Global Setup', icon: '❂' },
    { id: 'hero', label: 'Identity', icon: '✦' },
    { id: 'industry', label: 'Markets', icon: '◈' },
    { id: 'services', label: 'Solutions', icon: '▣' },
    { id: 'community', label: 'Reach', icon: '♒' },
    { id: 'vision', label: 'Manifesto', icon: '❂' },
    { id: 'newsletter', label: 'Nexus', icon: '✉' }
  ];

  return (
    <main className="fixed inset-0 bg-black flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-gold selection:text-black">
      
      {/* SIDEBAR */}
      <aside className="w-full lg:w-[360px] bg-[#050505] border-r border-white/5 flex flex-col z-[100] shrink-0">
        <div className="p-12 border-b border-white/5">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.open('/', '_blank')}>
            <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-lg transition-transform duration-500 group-hover:rotate-12">R</div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight uppercase">V4 Admin</span>
              <span className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em] mt-1.5">Edge Operations</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 py-12 custom-scrollbar">
          {sidebarTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center justify-between px-8 py-5 rounded-[24px] transition-all duration-500 group relative ${activeTab === tab.id ? 'bg-white/[0.04] text-white' : 'text-white/20 hover:text-white/50 hover:bg-white/[0.01]'}`}
            >
              <div className="flex items-center gap-6">
                <span className={`text-xl transition-colors duration-500 ${activeTab === tab.id ? 'text-gold' : 'text-white/5'}`}>{tab.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              </div>
              {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_15px_rgba(201,168,76,0.5)]" />}
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-white/5 space-y-6">
          <button 
             onClick={() => window.location.href = "/admin/login"}
             className="w-full text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/5 hover:text-red-500/50 transition-all py-6 border border-white/5 rounded-2xl hover:border-red-500/10"
           >
             Lock Console
           </button>
        </div>
      </aside>

      {/* VIEWPORT */}
      <section className="flex-1 flex flex-col h-full bg-[#080808] relative min-w-0">
        <header className="h-[100px] border-b border-white/5 flex items-center justify-between px-12 bg-black/40 backdrop-blur-3xl z-50 shrink-0">
           <div className="flex items-center gap-12">
              <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                 <div className={`w-2 h-2 rounded-full ${storageStatus.postgres ? 'bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-gold/80 shadow-[0_0_15px_rgba(201,168,76,0.3)]'}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    {storageStatus.postgres ? 'Sync Protocol: edge' : 'Sync Protocol: local'}
                 </span>
              </div>
           </div>

           <button 
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className={`flex items-center gap-6 px-12 h-[56px] rounded-2xl transition-all duration-700 font-black text-[11px] uppercase tracking-[0.3em] relative overflow-hidden shadow-2xl ${saving ? 'bg-white/5 text-white/20' : hasUnsavedChanges ? 'bg-white text-black hover:bg-gold hover:text-white' : 'bg-white/5 text-white/10 opacity-30 cursor-not-allowed'}`}
            >
              <span>{saving ? 'Syncing...' : 'Deploy Changes'}</span>
              {hasUnsavedChanges && !saving && <div className="w-2 h-2 rounded-full bg-black/20 group-hover:bg-white/20 animate-pulse" />}
           </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 lg:p-24 custom-scrollbar scroll-smooth">
          <div className="max-w-[900px] w-full pb-48">
            <AnimatePresence mode="wait">
              {activeTab === 'global' && (
                <motion.div key="global" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Global Setup" subtitle="Core Branding & Authority" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-12">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 border-b border-white/5 pb-6">Intro Engine</h3>
                       <InputField label="Intro Logo Text" value={data.global.intro.logo} onChange={(v:any) => update('global.intro.logo', v)} mono />
                       <InputField label="Intro Sub-headline" value={data.global.intro.subtitle} onChange={(v:any) => update('global.intro.subtitle', v)} />
                       <InputField label="Duration (ms)" type="number" value={data.global.intro.duration} onChange={(v:any) => update('global.intro.duration', parseInt(v))} mono />
                    </div>
                    <div className="space-y-12">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 border-b border-white/5 pb-6">Core Navigation</h3>
                       <InputField label="Global Logo Tag" value={data.global.nav.logo} onChange={(v:any) => update('global.nav.logo', v)} mono />
                       <div className="space-y-10 pt-4">
                         {data.global.nav.links.map((link:any, i:number) => (
                           <div key={i} className="flex gap-4 p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative group">
                              <InputField label="Label" value={link.label} onChange={(v:any) => {
                                 const n = [...data.global.nav.links]; n[i].label = v; update('global.nav.links', n);
                              }} />
                              <InputField label="Href" value={link.href} onChange={(v:any) => {
                                 const n = [...data.global.nav.links]; n[i].href = v; update('global.nav.links', n);
                              }} mono />
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-12 pt-12 border-t border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">SEO & Metadata</h3>
                    <div className="grid grid-cols-1 gap-12">
                      <InputField label="Meta Title" value={data.global.seo.title} onChange={(v:any) => update('global.seo.title', v)} />
                      <TextAreaField label="Meta Description" value={data.global.seo.description} onChange={(v:any) => update('global.seo.description', v)} />
                      <ImageUpload label="Social Share Image" currentUrl={data.global.seo.ogImage} onUpload={(url) => update('global.seo.ogImage', url)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hero' && (
                <motion.div key="hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Identity" subtitle="Primary Headlines & Authority" />
                  <div className="space-y-16">
                    <InputField label="Main Headline" value={data.hero.title} onChange={(v:any) => update('hero.title', v)} />
                    <TextAreaField label="Sub-Headline Manifesto" value={data.hero.subtitle} onChange={(v:any) => update('hero.subtitle', v)} />
                    
                    <div className="pt-12 space-y-12">
                       <div className="flex items-center justify-between mb-8">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Featured Profiles</h3>
                         <button onClick={() => {
                           const n = [...data.hero.icons, { name: "", handle: "", description: "", image: "" }];
                           update('hero.icons', n);
                         }} className="px-6 py-2.5 rounded-xl border border-white/10 text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">+ ADD ENTRY</button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         {data.hero.icons.map((icon:any, i:number) => (
                           <div key={i} className="bg-white/[0.01] border border-white/5 p-12 rounded-[48px] relative group hover:bg-white/[0.02] transition-all">
                              <button onClick={() => {
                                const n = data.hero.icons.filter((_:any, idx:number) => idx !== i);
                                update('hero.icons', n);
                              }} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 text-[10px] font-black z-20">X</button>
                              <div className="space-y-12">
                                <ImageUpload onUpload={(url) => {
                                  const n = [...data.hero.icons]; n[i].image = url; update('hero.icons', n);
                                }} currentUrl={icon.image} />
                                <div className="space-y-8">
                                  <InputField label="Full Name" value={icon.name} onChange={(v:any) => {
                                    const n = [...data.hero.icons]; n[i].name = v; update('hero.icons', n);
                                  }} />
                                  <InputField label="Protocol Handle" value={icon.handle} mono onChange={(v:any) => {
                                    const n = [...data.hero.icons]; n[i].handle = v; update('hero.icons', n);
                                  }} />
                                  <TextAreaField label="Authority Statement" value={icon.description} onChange={(v:any) => {
                                    const n = [...data.hero.icons]; n[i].description = v; update('hero.icons', n);
                                  }} />
                                </div>
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add other existing tabs Industry, Services, etc. with similar refined card logic */}
              {activeTab === 'industry' && (
                <motion.div key="industry" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Markets" subtitle="Global Specialization Layers" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <InputField label="Section Headline" value={data.industry.title} onChange={(v:any) => update('industry.title', v)} />
                    <InputField label="Protocol Tag" value={data.industry.subtitle} mono onChange={(v:any) => update('industry.subtitle', v)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {data.industry.items.map((item:any, i:number) => (
                       <div key={i} className="bg-white/[0.01] border border-white/5 p-10 rounded-[48px] relative group shadow-2xl">
                          <button onClick={() => {
                             const n = data.industry.items.filter((_:any, idx:number) => idx !== i);
                             update('industry.items', n);
                          }} className="absolute top-8 right-8 text-red-500/20 hover:text-red-500 text-[10px] font-black">X</button>
                          <div className="space-y-10">
                            <ImageUpload onUpload={(url) => {
                              const n = [...data.industry.items]; n[i].image = url; update('industry.items', n);
                            }} currentUrl={item.image} />
                            <InputField label="Sector Name" value={item.title} onChange={(v:any) => {
                              const n = [...data.industry.items]; n[i].title = v; update('industry.items', n);
                            }} />
                            <TextAreaField label="Layer Description" value={item.desc} onChange={(v:any) => {
                              const n = [...data.industry.items]; n[i].desc = v; update('industry.items', n);
                            }} />
                          </div>
                       </div>
                    ))}
                    <button onClick={() => {
                        const n = [...data.industry.items, { title: "Nexus", desc: "", image: "" }];
                        update('industry.items', n);
                    }} className="border border-dashed border-white/10 p-16 rounded-[48px] text-[10px] font-black uppercase tracking-[0.5em] text-white/10 hover:border-gold/30 hover:text-gold transition-all min-h-[400px] shadow-inner">EXTEND MARKET LAYER +</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div key="services" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Solutions" subtitle="Core Operational Modules" />
                  <div className="grid grid-cols-2 gap-10">
                     <InputField label="Master Head" value={data.services.title1} onChange={(v:any) => update('services.title1', v)} />
                     <InputField label="Sub-Protocol Head" value={data.services.title2} onChange={(v:any) => update('services.title2', v)} />
                  </div>
                  <div className="space-y-16">
                     {data.services.items.map((item:any, i:number) => (
                       <div key={i} className="bg-white/[0.01] border border-white/5 p-16 rounded-[64px] relative group shadow-2xl grid grid-cols-1 xl:grid-cols-2 gap-20">
                          <button onClick={() => {
                             const n = data.services.items.filter((_:any, idx:number) => idx !== i);
                             update('services.items', n);
                          }} className="absolute top-12 right-12 text-red-500/20 hover:text-red-500 text-[10px] font-black uppercase">Destroy Module</button>
                          <div className="space-y-12">
                             <div className="flex gap-6 items-end">
                                <InputField label="ID" value={item.id} mono onChange={(v:any) => {
                                   const n = [...data.services.items]; n[i].id = v; update('services.items', n);
                                }} />
                                <InputField label="Title" value={item.title} onChange={(v:any) => {
                                   const n = [...data.services.items]; n[i].title = v; update('services.items', n);
                                }} />
                             </div>
                             <TextAreaField label="Full Strategy Manifesto" value={item.desc} onChange={(v:any) => {
                                const n = [...data.services.items]; n[i].desc = v; update('services.items', n);
                             }} />
                             <InputField label="Tag" value={item.tag} mono onChange={(v:any) => {
                                const n = [...data.services.items]; n[i].tag = v; update('services.items', n);
                             }} />
                          </div>
                          <div className="pt-10">
                             <ImageUpload label="Hero Asset" currentUrl={item.img} onUpload={(url) => {
                               const n = [...data.services.items]; n[i].img = url; update('services.items', n);
                             }} />
                          </div>
                       </div>
                     ))}
                     <button onClick={() => {
                        const n = [...data.services.items, { id: "04", title: "Global Intel", desc: "", img: "", tag: "[Edge]" }];
                        update('services.items', n);
                     }} className="w-full border border-dashed border-white/10 p-20 rounded-[64px] text-[12px] font-black uppercase tracking-[0.5em] text-white/10 hover:border-gold/30 hover:text-gold transition-all shadow-inner">INTEGRATE NEW MODULE +</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'community' && (
                <motion.div key="community" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                   <SectionHeader title="Reach" subtitle="Network & Authority Metrics" />
                   <div className="grid grid-cols-2 gap-10">
                      <InputField label="Sub-Tag" value={data.community.tagline} mono onChange={(v:any) => update('community.tagline', v)} />
                      <InputField label="CTA Action Text" value={data.community.ctaText} onChange={(v:any) => update('community.ctaText', v)} />
                   </div>
                   <div className="grid grid-cols-2 gap-10">
                      <InputField label="Reach Headline 1" value={data.community.title1} onChange={(v:any) => update('community.title1', v)} />
                      <InputField label="Reach Headline 2" value={data.community.title2} onChange={(v:any) => update('community.title2', v)} />
                   </div>
                   <TextAreaField label="Network Description" value={data.community.description} onChange={(v:any) => update('community.description', v)} />
                   
                   <div className="pt-12 space-y-12">
                      <div className="flex items-center justify-between">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Authorized Metrics</h3>
                         <button onClick={() => {
                           const n = [...data.community.stats, { label: "NEW METRIC", value: 0, suffix: "" }];
                           update('community.stats', n);
                         }} className="px-6 py-2 border border-white/10 rounded-xl text-[9px] font-black uppercase">+ ADD STAT</button>
                      </div>
                      <div className="grid grid-cols-4 gap-6">
                        {data.community.stats.map((stat:any, i:number) => (
                           <div key={i} className="bg-white/[0.01] border border-white/5 p-8 rounded-[32px] relative group hover:bg-white/[0.02] transition-all">
                              <button onClick={() => {
                                 const n = data.community.stats.filter((_:any, idx:number) => idx !== i);
                                 update('community.stats', n);
                              }} className="absolute top-6 right-6 text-red-500/20 hover:text-red-500 text-[10px] font-black">X</button>
                              <div className="space-y-8">
                                 <InputField label="Label" value={stat.label} mono onChange={(v:any) => {
                                    const n = [...data.community.stats]; n[i].label = v; update('community.stats', n);
                                 }} />
                                 <div className="flex gap-2 items-end">
                                    <InputField label="Value" value={stat.value} type="number" mono onChange={(v:any) => {
                                       const n = [...data.community.stats]; n[i].value = parseFloat(v); update('community.stats', n);
                                    }} />
                                    <InputField label="Suffix" value={stat.suffix} mono onChange={(v:any) => {
                                       const n = [...data.community.stats]; n[i].suffix = v; update('community.stats', n);
                                    }} />
                                 </div>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'vision' && (
                <motion.div key="vision" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                   <SectionHeader title="Manifesto" subtitle="Philosophical Direction" />
                   <div className="grid grid-cols-2 gap-10">
                      <InputField label="Manifesto Tag" value={data.vision.tagline} mono onChange={(v:any) => update('vision.tagline', v)} />
                      <InputField label="Series Designation" value={data.vision.episodeTag} onChange={(v:any) => update('vision.episodeTag', v)} />
                   </div>
                   <div className="grid grid-cols-2 gap-10">
                      <InputField label="Headline 1" value={data.vision.title1} onChange={(v:any) => update('vision.title1', v)} />
                      <InputField label="Headline 2" value={data.vision.title2} onChange={(v:any) => update('vision.title2', v)} />
                   </div>
                   <TextAreaField label="Full Narrative Statement" value={data.vision.description} onChange={(v:any) => update('vision.description', v)} />
                   <div className="grid grid-cols-3 gap-8">
                      <InputField label="Launch Status" value={data.vision.launchTag} mono onChange={(v:any) => update('vision.launchTag', v)} />
                      <InputField label="CTA Action" value={data.vision.ctaText} onChange={(v:any) => update('vision.ctaText', v)} />
                      <InputField label="Bridge URL" value={data.vision.ctaLink} mono onChange={(v:any) => update('vision.ctaLink', v)} />
                   </div>
                </motion.div>
              )}

              {activeTab === 'newsletter' && (
                <motion.div key="newsletter" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                   <SectionHeader title="Nexus" subtitle="Subscription Architecture" />
                   <InputField label="Nexus Tag" value={data.newsletter.tagline} mono onChange={(v:any) => update('newsletter.tagline', v)} />
                   <div className="grid grid-cols-2 gap-10">
                      <InputField label="Nexus Title 1" value={data.newsletter.title1} onChange={(v:any) => update('newsletter.title1', v)} />
                      <InputField label="Nexus Title 2" value={data.newsletter.title2} onChange={(v:any) => update('newsletter.title2', v)} />
                   </div>
                   <TextAreaField label="Engagement Value Prop" value={data.newsletter.description} onChange={(v:any) => update('newsletter.description', v)} />
                   <InputField label="Institutional Notice (Copyright)" value={data.newsletter.copyright} onChange={(v:any) => update('newsletter.copyright', v)} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <AnimatePresence>
          {message && (
            <motion.div 
               initial={{ y: 80, x: "-50%", opacity: 0 }} 
               animate={{ y: 0, x: "-50%", opacity: 1 }} 
               exit={{ y: 40, opacity: 0 }} 
               className="fixed bottom-12 left-1/2 bg-[#0a0a0a] text-white z-[2000] px-12 py-7 rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center gap-8 backdrop-blur-3xl min-w-[440px]"
            >
              <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_25px_#C9A84C] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[12px] font-black uppercase tracking-[0.4em] font-mono">{message}</span>
                <span className="text-[8px] text-white/30 uppercase tracking-[0.5em] mt-2 font-black">{saving ? 'Transaction pending' : 'Operational cycle secure'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.02); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.08); }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </main>
  );
}
