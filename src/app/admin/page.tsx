'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- PREMIUM UI COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center gap-4 mb-4"
      >
        <div className="w-8 h-[2px] bg-gold/50" />
        <span className="text-gold text-[10px] uppercase font-black tracking-[0.4em]">{subtitle}</span>
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-7xl font-black tracking-tight text-white uppercase leading-none"
      >
        {title}
      </motion.h1>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder = "", type = "text", mono = false }: any) {
  return (
    <div className="group space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-gold transition-colors ml-2">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-8 py-6 text-sm text-white focus:border-gold/30 focus:bg-black transition-all outline-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${mono ? 'font-mono text-gold/80' : 'font-medium'}`}
        />
        <div className="absolute inset-0 rounded-2xl border border-gold/0 group-focus-within:border-gold/10 pointer-events-none transition-all" />
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder = "" }: any) {
  return (
    <div className="group space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-gold transition-colors ml-2">{label}</label>
      <div className="relative">
        <textarea 
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl px-8 py-8 min-h-[160px] text-base font-medium text-white/60 focus:border-gold/30 focus:bg-black transition-all outline-none leading-relaxed shadow-[0_10px_30px_rgba(0,0,0,0.5)] resize-none"
        />
        <div className="absolute inset-0 rounded-3xl border border-gold/0 group-focus-within:border-gold/10 pointer-events-none transition-all" />
      </div>
    </div>
  );
}

function ImageUpload({ currentUrl, onUpload, label = "Visual Asset" }: { currentUrl: string; onUpload: (url: string) => void; label?: string }) {
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
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{label}</label>
        <label className={`cursor-pointer px-4 py-2 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-widest transition-all ${uploading ? 'text-gold animate-pulse bg-gold/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          {uploading ? 'UPLOADING...' : 'REPLACE ASSET'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>
      <div className="aspect-video rounded-[40px] overflow-hidden border border-white/5 bg-[#0a0a0a] relative group shadow-2xl">
        {currentUrl ? (
          <img src={currentUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" alt="Preview" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[9px] uppercase font-black tracking-widest italic">Empty Slot</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

// --- MAIN MANAGEMENT INTERFACE ---

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('global');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storageStatus, setStorageStatus] = useState({ postgres: true, blob: true });
  
  const viewportRef = useRef<HTMLDivElement>(null);

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
    setMessage('INITIATING CLOUD SYNC...');
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setMessage('DATA PERSISTED SUCCESSFULLY');
      } else {
        setMessage('SYNC INTERRUPTED');
      }
    } catch (err) { setMessage('SERVER UNREACHABLE'); } finally {
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
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-6">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="text-white font-black text-4xl"
      >
        RVE
      </motion.div>
      <span className="text-white/10 font-mono text-[9px] tracking-[0.8em] uppercase">Security Clearance Level 4</span>
    </div>
  );

  const tabs = [
    { id: 'global', label: 'Core Config', icon: '❂' },
    { id: 'hero', label: 'Identity', icon: '✦' },
    { id: 'industry', label: 'Markets', icon: '◈' },
    { id: 'services', label: 'Solutions', icon: '▣' },
    { id: 'community', label: 'Network', icon: '♒' },
    { id: 'vision', label: 'Manifesto', icon: '❂' },
    { id: 'newsletter', label: 'Nexus', icon: '✉' }
  ];

  return (
    <main className="fixed inset-0 bg-black text-white selection:bg-gold selection:text-black flex overflow-hidden">
      
      {/* PROFESSIONAL SIDEBAR - Pinned */}
      <aside className="w-[320px] bg-[#050505] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-10 mb-10">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.open('/', '_blank')}>
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-xl">R</div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest leading-none">Management</div>
              <div className="text-[9px] text-white/20 uppercase tracking-[0.4em] mt-1 font-black">v4.2.0 Stable</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-300 relative group ${activeTab === tab.id ? 'bg-white/[0.04] text-white shadow-lg' : 'text-white/20 hover:text-white/40 hover:bg-white/[0.01]'}`}
            >
              <span className={`text-lg transition-colors ${activeTab === tab.id ? 'text-gold' : 'text-white/10 group-hover:text-white/30'}`}>{tab.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="tab-active" className="absolute left-0 w-1 h-6 bg-gold rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="p-10 space-y-4">
           <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                 <div className={`w-2 h-2 rounded-full ${storageStatus.postgres ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]'}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Persistence Layer</span>
              </div>
              <div className="text-[9px] font-medium text-white/20 tracking-wide uppercase">
                 {storageStatus.postgres ? 'Cloud Sync Online' : 'Local Fallback Active'}
              </div>
           </div>
           <button 
             onClick={() => window.location.href = "/admin/login"}
             className="w-full text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-colors py-6 border border-white/5 rounded-2xl hover:border-white/20"
           >
             Exit Console
           </button>
        </div>
      </aside>

      {/* DASHBOARD VIEWPORT - Scrolling Area */}
      <section className="flex-1 flex flex-col min-w-0 bg-[#080808]">
        
        {/* Persistent Header */}
        <header className="h-[90px] border-b border-white/5 flex items-center justify-between px-12 bg-black/40 backdrop-blur-3xl z-[100] shrink-0">
           <div className="flex flex-col">
              <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.5em] mb-1">Navigation</span>
              <div className="text-sm font-black text-white/40">{tabs.find(t => t.id === activeTab)?.label}</div>
           </div>

           <div className="flex items-center gap-8">
              <AnimatePresence>
                 {hasUnsavedChanges && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
                       <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-gold/80">Unsaved Session Data</span>
                    </motion.div>
                 )}
              </AnimatePresence>

              <button 
                 onClick={handleSave}
                 disabled={saving || !hasUnsavedChanges}
                 className={`h-[48px] px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl ${saving ? 'bg-white/5 text-white/20' : hasUnsavedChanges ? 'bg-white text-black hover:bg-gold hover:text-white' : 'bg-white/5 text-white/10 opacity-20 cursor-not-allowed'}`}
              >
                 {saving ? 'Processing...' : 'Sync Changes'}
              </button>
           </div>
        </header>

        {/* Content Canvas - SCROLLING AREA */}
        <div 
          ref={viewportRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-12 lg:p-24 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent)]"
        >
          <div className="max-w-[1000px] mx-auto pb-48">
            <AnimatePresence mode="wait">
              {activeTab === 'global' && (
                <motion.div key="global" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Global Core" subtitle="System Identity & Authority" />
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
                    <div className="space-y-16">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 border-b border-white/5 pb-6 flex items-center gap-4">
                          <span className="w-4 h-[1px] bg-white/10" /> Intro Engine
                       </h3>
                       <InputField label="Micro Logo Text" value={data.global.intro.logo} onChange={(v:any) => update('global.intro.logo', v)} mono />
                       <InputField label="Micro Sub-headline" value={data.global.intro.subtitle} onChange={(v:any) => update('global.intro.subtitle', v)} />
                       <InputField label="Animation Lead (ms)" type="number" value={data.global.intro.duration} onChange={(v:any) => update('global.intro.duration', parseInt(v))} mono />
                    </div>
                    
                    <div className="space-y-16">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 border-b border-white/5 pb-6 flex items-center gap-4">
                          <span className="w-4 h-[1px] bg-white/10" /> Architecture
                       </h3>
                       <InputField label="Primary Brand Tag" value={data.global.nav.logo} onChange={(v:any) => update('global.nav.logo', v)} mono />
                       <div className="space-y-8 pt-4">
                         {data.global.nav.links.map((link:any, i:number) => (
                           <div key={i} className="flex gap-4 p-8 bg-black border border-white/5 rounded-[32px] shadow-2xl">
                              <InputField label="Label" value={link.label} onChange={(v:any) => {
                                 const n = [...data.global.nav.links]; n[i].label = v; update('global.nav.links', n);
                              }} />
                              <InputField label="Link" value={link.href} onChange={(v:any) => {
                                 const n = [...data.global.nav.links]; n[i].href = v; update('global.nav.links', n);
                              }} mono />
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-16 pt-24 border-t border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center gap-4">
                       <span className="w-4 h-[1px] bg-white/10" /> Search Intelligence (SEO)
                    </h3>
                    <div className="grid grid-cols-1 gap-12 max-w-[800px]">
                      <InputField label="Protocol Title" value={data.global.seo.title} onChange={(v:any) => update('global.seo.title', v)} />
                      <TextAreaField label="Description Meta" value={data.global.seo.description} onChange={(v:any) => update('global.seo.description', v)} />
                      <ImageUpload label="Social Authority Image" currentUrl={data.global.seo.ogImage} onUpload={(url) => update('global.seo.ogImage', url)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hero' && (
                <motion.div key="hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Identity" subtitle="Primary Core Messaging" />
                  <div className="space-y-16 max-w-[800px]">
                    <InputField label="Master Directive" value={data.hero.title} onChange={(v:any) => update('hero.title', v)} />
                    <TextAreaField label="Manifesto Statement" value={data.hero.subtitle} onChange={(v:any) => update('hero.subtitle', v)} />
                    
                    <div className="pt-24 space-y-12">
                       <div className="flex items-center justify-between pb-8 border-b border-white/5">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Authorized Profiles</h3>
                         <button onClick={() => {
                           const n = [...data.hero.icons, { name: "", handle: "", description: "", image: "" }];
                           update('hero.icons', n);
                         }} className="px-6 py-3 rounded-xl border border-white/10 text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">+ NEW ENTRY</button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {data.hero.icons.map((icon:any, i:number) => (
                           <div key={i} className="bg-black border border-white/5 p-12 rounded-[56px] relative group shadow-2xl hover:border-white/10 transition-all">
                              <button onClick={() => {
                                const n = data.hero.icons.filter((_:any, idx:number) => idx !== i);
                                update('hero.icons', n);
                              }} className="absolute top-10 right-10 text-white/10 hover:text-red-500 text-[9px] font-black transition-colors">DESTROY</button>
                              <div className="space-y-12">
                                <ImageUpload onUpload={(url) => {
                                  const n = [...data.hero.icons]; n[i].image = url; update('hero.icons', n);
                                }} currentUrl={icon.image} label="Profile Portrait" />
                                <div className="space-y-8">
                                  <InputField label="Identity Name" value={icon.name} onChange={(v:any) => {
                                    const n = [...data.hero.icons]; n[i].name = v; update('hero.icons', n);
                                  }} />
                                  <InputField label="Protocol Key" value={icon.handle} mono onChange={(v:any) => {
                                    const n = [...data.hero.icons]; n[i].handle = v; update('hero.icons', n);
                                  }} />
                                  <TextAreaField label="Context Manifesto" value={icon.description} onChange={(v:any) => {
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

              {activeTab === 'industry' && (
                <motion.div key="industry" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Markets" subtitle="Global Specialization Layers" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[800px]">
                    <InputField label="Sector Directive" value={data.industry.title} onChange={(v:any) => update('industry.title', v)} />
                    <InputField label="Protocol Identifier" value={data.industry.subtitle} mono onChange={(v:any) => update('industry.subtitle', v)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {data.industry.items.map((item:any, i:number) => (
                       <div key={i} className="bg-black border border-white/5 p-12 rounded-[56px] relative group shadow-2xl hover:border-white/10 transition-all">
                          <button onClick={() => {
                             const n = data.industry.items.filter((_:any, idx:number) => idx !== i);
                             update('industry.items', n);
                          }} className="absolute top-10 right-10 text-white/10 hover:text-red-500 text-[9px] font-black transition-colors uppercase">Remove</button>
                          <div className="space-y-10">
                            <ImageUpload onUpload={(url) => {
                              const n = [...data.industry.items]; n[i].image = url; update('industry.items', n);
                            }} currentUrl={item.image} label="Sector Imagery" />
                            <InputField label="Sector Identity" value={item.title} onChange={(v:any) => {
                              const n = [...data.industry.items]; n[i].title = v; update('industry.items', n);
                            }} />
                            <TextAreaField label="Strategic Insights" value={item.desc} onChange={(v:any) => {
                              const n = [...data.industry.items]; n[i].desc = v; update('industry.items', n);
                            }} />
                          </div>
                       </div>
                    ))}
                    <button onClick={() => {
                        const n = [...data.industry.items, { title: "NEW SECTOR", desc: "", image: "" }];
                        update('industry.items', n);
                    }} className="h-[500px] border-2 border-dashed border-white/5 rounded-[56px] flex flex-col items-center justify-center gap-6 hover:border-gold/20 hover:bg-gold/[0.01] transition-all group overflow-hidden relative">
                       <span className="text-4xl text-white/5 group-hover:text-gold/20 transition-colors tracking-tighter font-black">EXTEND</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 group-hover:text-gold/40 transition-colors">Integrate New Layer</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div key="services" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                  <SectionHeader title="Solutions" subtitle="Primary Operational Modules" />
                  <div className="grid grid-cols-2 gap-12 max-w-[800px]">
                     <InputField label="Master Solution Set" value={data.services.title1} onChange={(v:any) => update('services.title1', v)} />
                     <InputField label="Operational Protocol" value={data.services.title2} onChange={(v:any) => update('services.title2', v)} />
                  </div>
                  <div className="space-y-20">
                     {data.services.items.map((item:any, i:number) => (
                       <div key={i} className="bg-black border border-white/5 p-16 rounded-[64px] relative group shadow-[0_40px_100px_rgba(0,0,0,0.6)] grid grid-cols-1 xl:grid-cols-2 gap-20">
                          <button onClick={() => {
                             const n = data.services.items.filter((_:any, idx:number) => idx !== i);
                             update('services.items', n);
                          }} className="absolute top-12 right-12 text-white/5 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">Terminte Module</button>
                          <div className="space-y-12">
                             <div className="flex gap-6 items-end">
                                <InputField label="Protocol ID" value={item.id} mono onChange={(v:any) => {
                                   const n = [...data.services.items]; n[i].id = v; update('services.items', n);
                                }} />
                                <InputField label="Service Identity" value={item.title} onChange={(v:any) => {
                                   const n = [...data.services.items]; n[i].title = v; update('services.items', n);
                                }} />
                             </div>
                             <TextAreaField label="Functional Directives" value={item.desc} onChange={(v:any) => {
                                const n = [...data.services.items]; n[i].desc = v; update('services.items', n);
                             }} />
                             <InputField label="Technical Designation" value={item.tag} mono onChange={(v:any) => {
                                const n = [...data.services.items]; n[i].tag = v; update('services.items', n);
                             }} />
                          </div>
                          <div>
                             <ImageUpload label="Hero Asset" currentUrl={item.img} onUpload={(url) => {
                               const n = [...data.services.items]; n[i].img = url; update('services.items', n);
                             }} />
                          </div>
                       </div>
                     ))}
                     <button onClick={() => {
                        const n = [...data.services.items, { id: "04", title: "NEW SOLUTION", desc: "", img: "", tag: "[EDGE]" }];
                        update('services.items', n);
                     }} className="w-full h-32 border-2 border-dashed border-white/5 rounded-[64px] flex items-center justify-center gap-8 hover:bg-white/[0.01] hover:border-gold/20 transition-all text-[11px] font-black uppercase tracking-[0.6em] text-white/10 hover:text-gold/40 shadow-inner">Initialize Operational Module +</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'community' && (
                <motion.div key="community" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                   <SectionHeader title="Network" subtitle="Growth & Reach Intelligence" />
                   <div className="grid grid-cols-2 gap-12 max-w-[800px]">
                      <InputField label="Protocol Tag" value={data.community.tagline} mono onChange={(v:any) => update('community.tagline', v)} />
                      <InputField label="Network Action Key" value={data.community.ctaText} onChange={(v:any) => update('community.ctaText', v)} />
                   </div>
                   <div className="grid grid-cols-2 gap-12 max-w-[800px]">
                      <InputField label="Headline Lead" value={data.community.title1} onChange={(v:any) => update('community.title1', v)} />
                      <InputField label="Headline Sub" value={data.community.title2} onChange={(v:any) => update('community.title2', v)} />
                   </div>
                   <TextAreaField label="Network Expansion Manifesto" value={data.community.description} onChange={(v:any) => update('community.description', v)} />
                   
                   <div className="pt-24 space-y-16">
                      <div className="flex items-center justify-between pb-8 border-b border-white/5">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Authority Metrics</h3>
                         <button onClick={() => {
                           const n = [...data.community.stats, { label: "NEW KPX", value: 0, suffix: "" }];
                           update('community.stats', n);
                         }} className="px-6 py-3 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-gold hover:text-white transition-all">+ ADD INDEX</button>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.community.stats.map((stat:any, i:number) => (
                           <div key={i} className="bg-black border border-white/5 p-10 rounded-[40px] relative group hover:border-gold/20 transition-all shadow-2xl">
                              <button onClick={() => {
                                 const n = data.community.stats.filter((_:any, idx:number) => idx !== i);
                                 update('community.stats', n);
                              }} className="absolute top-8 right-8 text-white/5 hover:text-red-500 text-[9px] font-black transition-colors">×</button>
                              <div className="space-y-8">
                                 <InputField label="Index Label" value={stat.label} mono onChange={(v:any) => {
                                    const n = [...data.community.stats]; n[i].label = v; update('community.stats', n);
                                 }} />
                                 <div className="flex gap-4">
                                    <InputField label="Value" value={stat.value} type="number" mono onChange={(v:any) => {
                                       const n = [...data.community.stats]; n[i].value = parseFloat(v); update('community.stats', n);
                                    }} />
                                    <InputField label="Designator" value={stat.suffix} mono onChange={(v:any) => {
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
                   <SectionHeader title="Manifesto" subtitle="Strategic Philosophical Direction" />
                   <div className="grid grid-cols-2 gap-12 max-w-[800px]">
                      <InputField label="Directive Tag" value={data.vision.tagline} mono onChange={(v:any) => update('vision.tagline', v)} />
                      <InputField label="Sub-Identity Tag" value={data.vision.episodeTag} onChange={(v:any) => update('vision.episodeTag', v)} />
                   </div>
                   <div className="grid grid-cols-2 gap-12 max-w-[800px]">
                      <InputField label="Narrative Lead" value={data.vision.title1} onChange={(v:any) => update('vision.title1', v)} />
                      <InputField label="Narrative Focus" value={data.vision.title2} onChange={(v:any) => update('vision.title2', v)} />
                   </div>
                   <TextAreaField label="Full Strategic Manifesto" value={data.vision.description} onChange={(v:any) => update('vision.description', v)} />
                   <div className="grid grid-cols-3 gap-8">
                      <InputField label="Status Code" value={data.vision.launchTag} mono onChange={(v:any) => update('vision.launchTag', v)} />
                      <InputField label="Action Call" value={data.vision.ctaText} onChange={(v:any) => update('vision.ctaText', v)} />
                      <InputField label="Bridge Authority" value={data.vision.ctaLink} mono onChange={(v:any) => update('vision.ctaLink', v)} />
                   </div>
                </motion.div>
              )}

              {activeTab === 'newsletter' && (
                <motion.div key="newsletter" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-24">
                   <SectionHeader title="Nexus" subtitle="Global Intelligence Broadcast" />
                   <div className="max-w-[700px] space-y-16">
                      <InputField label="Nexus Identifier" value={data.newsletter.tagline} mono onChange={(v:any) => update('newsletter.tagline', v)} />
                      <div className="grid grid-cols-2 gap-10">
                         <InputField label="Protocol Title 1" value={data.newsletter.title1} onChange={(v:any) => update('newsletter.title1', v)} />
                         <InputField label="Protocol Title 2" value={data.newsletter.title2} onChange={(v:any) => update('newsletter.title2', v)} />
                      </div>
                      <TextAreaField label="Intel Propagation Value" value={data.newsletter.description} onChange={(v:any) => update('newsletter.description', v)} />
                      <InputField label="Institutional Protection (Copyright)" value={data.newsletter.copyright} onChange={(v:any) => update('newsletter.copyright', v)} />
                   </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* STATUS BAR - Fixed Bottom */}
        <AnimatePresence>
          {message && (
            <motion.div 
               initial={{ y: 50, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }} 
               exit={{ y: 50, opacity: 0 }} 
               className="fixed bottom-12 right-12 z-[2000] px-10 py-6 bg-white text-black rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex items-center gap-6"
            >
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

        body { overflow: hidden; height: 100vh; width: 100vw; }
      `}</style>
    </main>
  );
}
