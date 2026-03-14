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
        <label className={`cursor-pointer px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${uploading ? 'bg-white/10 text-white/40' : 'bg-white text-black hover:bg-gold hover:text-white'}`}>
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>
      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] relative group">
        {currentUrl ? (
          <img src={currentUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] uppercase font-bold tracking-widest">No Media</div>
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
    const fetchData = async () => {
      try {
        const res = await fetch('/api/cms');
        const d = await res.json();
        if (d.error?.includes('PRODUCTION_STORAGE_MISSING') || (d._system?.storageMissing)) {
           setStorageStatus({ postgres: false, blob: true });
        }
        setData(JSON.parse(JSON.stringify(d)));
        setOriginalData(JSON.parse(JSON.stringify(d)));
      } catch (err) {
        setMessage('CONNECTION ERROR');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage('PUBLISHING CHANGES...');
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setMessage('CHANGES PUBLISHED');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage(`ERROR: ${errorData.error || 'SAVE FAILED'}`);
      }
    } catch (err) {
      setMessage('CONNECTION ERROR');
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
      <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin" />
      <div className="text-white/20 font-mono text-[10px] tracking-[0.5em] uppercase">Initializing Session</div>
    </div>
  );

  const tabs = [
    { id: 'hero', label: 'Identity', icon: '✦' },
    { id: 'industry', label: 'Markets', icon: '◈' },
    { id: 'services', label: 'Services', icon: '▣' },
    { id: 'community', label: 'Community', icon: '♒' },
    { id: 'vision', label: 'Vision', icon: '❂' },
    { id: 'newsletter', label: 'Nexus', icon: '✉' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row h-screen overflow-hidden selection:bg-gold selection:text-black">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-[280px] bg-black border-r border-white/5 flex flex-col z-[100]">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open('/', '_blank')}>
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-[12px] group-hover:bg-gold transition-colors font-mono">RVE</div>
            <div className="flex flex-col">
              <span className="font-black text-[14px] tracking-tight uppercase leading-none">Admin</span>
              <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 py-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-white/5 text-white' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-[12px] transition-colors ${activeTab === tab.id ? 'text-gold' : 'text-white/10'}`}>{tab.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div layoutId="active-indicator" className="w-1 h-1 rounded-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           {hasUnsavedChanges && (
              <div className="bg-gold/5 border border-gold/10 px-4 py-3 rounded-xl flex items-center justify-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gold/80">Pending Changes</span>
              </div>
           )}
           <button 
             onClick={() => {
               document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
               window.location.href = "/admin/login";
             }}
             className="w-full text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-red-500 transition-colors py-4 border border-white/5 rounded-xl hover:bg-red-500/[0.02]"
           >
             Logout Session
           </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <section className="flex-1 flex flex-col h-full bg-[#080808] relative overflow-hidden">
        {/* TOP STATUS BAR */}
        <header className="h-[80px] border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl z-50">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
                 <div className={`w-1.5 h-1.5 rounded-full ${storageStatus.postgres ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gold/50'}`} />
                 <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">
                    {storageStatus.postgres ? 'Persistence: Live' : 'Persistence: Local'}
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className={`flex items-center gap-4 px-8 h-[44px] rounded-xl transition-all duration-500 font-black text-[9px] uppercase tracking-[0.2em] relative overflow-hidden ${saving ? 'bg-white/5 text-white/20 cursor-wait' : hasUnsavedChanges ? 'bg-white text-black hover:bg-gold hover:text-white shadow-xl active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed opacity-50'}`}
              >
                {saving && (
                  <motion.div initial={{ x: -100 }} animate={{ x: 200 }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-gold/20 skew-x-12" />
                )}
                <span>{saving ? 'Syncing...' : 'Publish Changes'}</span>
              </button>
           </div>
        </header>

        {/* SCROLLABLE CANVAS */}
        <div className="flex-1 overflow-y-auto p-10 lg:p-16 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-[900px] space-y-16">
                <div className="space-y-3">
                  <h1 className="text-5xl font-black tracking-tight uppercase">Identity</h1>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Main Headlines & Team Members</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Main Headline</label>
                      <input 
                        type="text" 
                        value={data.hero?.title || ''}
                        onChange={(e) => updateNested('hero.title', e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-2xl px-8 py-8 text-3xl font-black text-white focus:border-gold/30 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Sub-Headline / Description</label>
                      <textarea 
                        value={data.hero?.subtitle || ''}
                        onChange={(e) => updateNested('hero.subtitle', e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-2xl px-8 py-8 min-h-[140px] text-base font-medium text-white/60 focus:border-gold/30 transition-all outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 pt-8">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Featured Profiles</h3>
                      <button onClick={() => {
                        const newIcons = [...(data.hero?.icons || []), { name: "Name", handle: "@handle", description: "Position", image: "" }];
                        updateNested('hero.icons', newIcons);
                      }} className="px-5 py-2.5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">+ Add Entry</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {data.hero?.icons?.map((icon: any, idx: number) => (
                        <div key={idx} className="bg-white/[0.01] border border-white/5 p-8 rounded-[40px] group relative hover:border-white/10 transition-all">
                           <button onClick={() => {
                             const n = data.hero.icons.filter((_: any, i: number) => i !== idx);
                             updateNested('hero.icons', n);
                           }} className="absolute top-8 right-8 text-red-500/20 hover:text-red-500 text-[8px] font-black uppercase transition-all">Remove</button>
                           
                           <div className="space-y-8">
                             <ImageUpload 
                              currentUrl={icon.image} 
                              onUpload={url => {
                                const n = [...data.hero.icons];
                                n[idx].image = url;
                                updateNested('hero.icons', n);
                              }} 
                             />
                             <div className="space-y-4">
                                <input className="bg-transparent text-xl font-black w-full border-b border-white/5 pb-2 focus:border-gold outline-none" placeholder="Name" value={icon.name} onChange={e => {
                                   const n = [...data.hero.icons];
                                   n[idx].name = e.target.value;
                                   updateNested('hero.icons', n);
                                }} />
                                <input className="bg-transparent text-[9px] font-mono text-gold/60 w-full border-b border-white/5 pb-2 focus:border-gold outline-none" placeholder="@handle" value={icon.handle} onChange={e => {
                                   const n = [...data.hero.icons];
                                   n[idx].handle = e.target.value;
                                   updateNested('hero.icons', n);
                                }} />
                                <textarea className="bg-transparent text-[11px] font-medium text-white/30 w-full min-h-[80px] outline-none leading-relaxed" placeholder="Brief description..." value={icon.description} onChange={e => {
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
              <motion.div key="industry" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-[900px] space-y-16">
                <div className="space-y-3">
                  <h1 className="text-5xl font-black tracking-tight uppercase">Markets</h1>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Industry Focus Areas</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Display Title</label>
                      <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-xl font-black text-white focus:border-gold/30 outline-none" value={data.industry?.title || ''} onChange={e => updateNested('industry.title', e.target.value)} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Label Tag</label>
                      <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-xl font-black text-white focus:border-gold/30 outline-none font-mono text-gold" value={data.industry?.subtitle || ''} onChange={e => updateNested('industry.subtitle', e.target.value)} />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {data.industry?.items?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white/[0.01] border border-white/5 p-8 rounded-[40px] group relative hover:border-white/10 transition-all">
                         <button onClick={() => {
                           const n = data.industry.items.filter((_: any, i: number) => i !== idx);
                           updateNested('industry.items', n);
                         }} className="absolute top-8 right-8 text-red-500/20 hover:text-red-500 text-[8px] font-black uppercase transition-all">Remove</button>
                         
                         <div className="space-y-8">
                            <ImageUpload 
                              currentUrl={item.image}
                              onUpload={url => {
                                const n = [...data.industry.items];
                                n[idx].image = url;
                                updateNested('industry.items', n);
                              }}
                            />
                            <div className="space-y-4">
                               <input 
                                 className="bg-transparent text-xl font-black w-full border-b border-white/5 pb-2 focus:border-gold outline-none" 
                                 placeholder="Sector Name"
                                 value={item.title} 
                                 onChange={e => {
                                   const n = [...data.industry.items];
                                   n[idx].title = e.target.value;
                                   updateNested('industry.items', n);
                                 }}
                               />
                               <textarea 
                                 className="bg-transparent text-[11px] font-medium text-white/30 w-full min-h-[80px] outline-none leading-relaxed" 
                                 placeholder="Sector Description"
                                 value={item.desc} 
                                 onChange={e => {
                                   const n = [...data.industry.items];
                                   n[idx].desc = e.target.value;
                                   updateNested('industry.items', n);
                                 }}
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                   <button onClick={() => {
                     const n = [...(data.industry?.items || []), { title: "NEW SECTOR", desc: "", image: "" }];
                     updateNested('industry.items', n);
                   }} className="border border-dashed border-white/10 p-10 rounded-[40px] text-white/20 hover:border-gold/30 hover:text-gold transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center min-h-[300px]">Add Market Segment +</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-[900px] space-y-16">
                <div className="space-y-3">
                  <h1 className="text-5xl font-black tracking-tight uppercase">Services</h1>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Solutions & Expertise</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Head 1</label>
                      <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-xl font-black text-white focus:border-gold/30 outline-none" value={data.services?.title1 || ''} onChange={e => updateNested('services.title1', e.target.value)} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Head 2</label>
                      <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-xl font-black text-white focus:border-gold/30 outline-none" value={data.services?.title2 || ''} onChange={e => updateNested('services.title2', e.target.value)} />
                   </div>
                </div>
                
                <div className="space-y-8">
                   {data.services?.items?.map((service: any, idx: number) => (
                      <div key={idx} className="bg-white/[0.01] border border-white/5 p-12 rounded-[48px] group relative hover:border-white/10 transition-all">
                         <button onClick={() => {
                           const n = data.services.items.filter((_: any, i: number) => i !== idx);
                           updateNested('services.items', n);
                         }} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 text-[8px] font-black uppercase">Remove Module</button>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                               <div className="flex items-center gap-6">
                                  <input 
                                    className="w-16 bg-black/40 border border-white/5 rounded-xl p-3 text-center text-xs font-mono text-gold font-bold"
                                    placeholder="ID"
                                    value={service.id}
                                    onChange={e => {
                                      const n = [...data.services.items];
                                      n[idx].id = e.target.value;
                                      updateNested('services.items', n);
                                    }}
                                  />
                                  <input 
                                    className="flex-1 bg-transparent text-3xl font-black border-b border-white/5 pb-4 focus:border-gold outline-none" 
                                    placeholder="Service Title"
                                    value={service.title} 
                                    onChange={e => {
                                      const n = [...data.services.items];
                                      n[idx].title = e.target.value;
                                      updateNested('services.items', n);
                                    }}
                                  />
                               </div>
                               <textarea 
                                 className="bg-transparent text-lg font-medium text-white/40 w-full min-h-[140px] outline-none leading-relaxed" 
                                 placeholder="Describe the solution module..."
                                 value={service.desc} 
                                 onChange={e => {
                                   const n = [...data.services.items];
                                   n[idx].desc = e.target.value;
                                   updateNested('services.items', n);
                                 }}
                               />
                               <div className="space-y-2">
                                  <label className="text-[8px] font-black uppercase tracking-widest text-white/10 ml-2">Category Tag</label>
                                  <input 
                                     className="bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-[10px] font-mono text-white/30 w-full outline-none focus:border-gold/30"
                                     placeholder="[ CATEGORY ]"
                                     value={service.tag}
                                     onChange={e => {
                                       const n = [...data.services.items];
                                       n[idx].tag = e.target.value;
                                       updateNested('services.items', n);
                                     }}
                                  />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[8px] font-black uppercase tracking-widest text-white/10 ml-2">Featured Asset</label>
                               <ImageUpload 
                                 currentUrl={service.img}
                                 onUpload={url => {
                                   const n = [...data.services.items];
                                   n[idx].img = url;
                                   updateNested('services.items', n);
                                 }}
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                   <button onClick={() => {
                      const n = [...(data.services?.items || []), { id: "04", title: "New Service", desc: "", img: "", tag: "[ NEW ]" }];
                      updateNested('services.items', n);
                   }} className="w-full border border-dashed border-white/10 p-12 rounded-[48px] text-white/20 hover:border-gold/30 hover:text-gold transition-all text-sm font-black uppercase tracking-[0.3em]">Add Solution Module +</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div key="community" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-[900px] space-y-16">
                <div className="space-y-3">
                  <h1 className="text-5xl font-black tracking-tight uppercase">Community</h1>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Metrics & Engagement</p>
                </div>
                
                <div className="space-y-12">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Label</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-5 text-gold font-mono text-sm outline-none focus:border-gold/30" value={data.community?.tagline || ''} onChange={e => updateNested('community.tagline', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">CTA Action</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-5 text-white font-black text-sm outline-none focus:border-gold/30" value={data.community?.ctaText || ''} onChange={e => updateNested('community.ctaText', e.target.value)} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Headline Structure</label>
                      <div className="grid grid-cols-2 gap-4">
                         <input className="bg-black border border-white/5 rounded-xl p-6 w-full text-2xl font-black text-white outline-none focus:border-gold/30" value={data.community?.title1 || ''} onChange={e => updateNested('community.title1', e.target.value)} />
                         <input className="bg-black border border-white/5 rounded-xl p-6 w-full text-2xl font-black text-white outline-none focus:border-gold/30" value={data.community?.title2 || ''} onChange={e => updateNested('community.title2', e.target.value)} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Description Manifesto</label>
                      <textarea className="w-full bg-black border border-white/5 rounded-2xl p-8 min-h-[140px] text-lg font-medium text-white/60 outline-none focus:border-gold/30 leading-relaxed" value={data.community?.description || ''} onChange={e => updateNested('community.description', e.target.value)} />
                   </div>

                   <div className="border-t border-white/5 pt-8 space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Growth Stats</h3>
                         <button onClick={() => {
                           const n = [...(data.community?.stats || []), { label: "NEW STAT", value: 0, suffix: "+" }];
                           updateNested('community.stats', n);
                         }} className="px-4 py-2 rounded-lg border border-white/10 text-[8px] font-black uppercase hover:bg-white hover:text-black transition-all">+ Add Stat</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.community?.stats?.map((stat: any, idx: number) => (
                           <div key={idx} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl relative group hover:border-white/10 transition-all">
                              <button onClick={() => {
                                const n = data.community.stats.filter((_: any, i: number) => i !== idx);
                                updateNested('community.stats', n);
                              }} className="absolute top-4 right-4 text-red-500/0 group-hover:text-red-500 text-[7px] uppercase transition-all">Delete</button>
                              <div className="space-y-4">
                                 <input className="bg-transparent text-[8px] font-black uppercase tracking-widest text-white/20 w-full outline-none focus:text-white" value={stat.label} onChange={e => {
                                    const n = [...data.community.stats];
                                    n[idx].label = e.target.value;
                                    updateNested('community.stats', n);
                                 }} />
                                 <div className="flex items-center gap-1">
                                    <input className="bg-transparent text-3xl font-black text-white w-full outline-none focus:text-gold" value={stat.value} onChange={e => {
                                       const n = [...data.community.stats];
                                       n[idx].value = e.target.value;
                                       updateNested('community.stats', n);
                                    }} />
                                    <input className="bg-transparent text-xl font-black text-gold w-8 outline-none" value={stat.suffix} onChange={e => {
                                       const n = [...data.community.stats];
                                       n[idx].suffix = e.target.value;
                                       updateNested('community.stats', n);
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

            {activeTab === 'vision' && (
              <motion.div key="vision" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-[900px] space-y-16">
                 <div className="space-y-3">
                  <h1 className="text-5xl font-black tracking-tight uppercase">Vision</h1>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">The Narrative Series</p>
                </div>

                <div className="space-y-12">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/20 ml-2">Label</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-5 text-gold font-mono text-sm outline-none" value={data.vision?.tagline || ''} onChange={e => updateNested('vision.tagline', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/20 ml-2">Episode Tag</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-5 text-white/30 font-medium text-sm outline-none" value={data.vision?.episodeTag || ''} onChange={e => updateNested('vision.episodeTag', e.target.value)} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/20 ml-2">Title Line 1</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-2xl font-black text-white outline-none focus:border-gold/30" value={data.vision?.title1 || ''} onChange={e => updateNested('vision.title1', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/20 ml-2">Title Line 2</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-2xl font-black text-white outline-none focus:border-gold/30" value={data.vision?.title2 || ''} onChange={e => updateNested('vision.title2', e.target.value)} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-white/20 ml-2">Series Manifesto</label>
                      <textarea 
                        className="w-full bg-black border border-white/5 rounded-2xl p-10 min-h-[240px] text-lg font-medium text-white/80 focus:border-gold/30 outline-none leading-relaxed"
                        value={data.vision?.description || ''}
                        onChange={e => updateNested('vision.description', e.target.value)}
                      />
                   </div>

                   <div className="grid grid-cols-3 gap-6 pt-6">
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/10 ml-2">Status Clip</label>
                         <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-gold font-mono text-[10px] outline-none" value={data.vision?.launchTag || ''} onChange={e => updateNested('vision.launchTag', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/10 ml-2">CTA Action</label>
                         <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white font-black text-[10px] outline-none underline decoration-gold" value={data.vision?.ctaText || ''} onChange={e => updateNested('vision.ctaText', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/10 ml-2">Destination URL</label>
                         <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white/20 font-mono text-[10px] outline-none" value={data.vision?.ctaLink || ''} onChange={e => updateNested('vision.ctaLink', e.target.value)} />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'newsletter' && (
              <motion.div key="newsletter" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-[900px] space-y-16">
                 <div className="space-y-3">
                  <h1 className="text-5xl font-black tracking-tight uppercase">Nexus</h1>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Engagement Hub</p>
                </div>

                <div className="space-y-12">
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-white/20 ml-2">Label</label>
                      <input className="w-full bg-black border border-white/5 rounded-xl p-5 text-gold font-mono text-sm outline-none" value={data.newsletter?.tagline || ''} onChange={e => updateNested('newsletter.tagline', e.target.value)} />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/20 ml-2">Headline 1</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-2xl font-black text-white outline-none focus:border-gold/30" value={data.newsletter?.title1 || ''} onChange={e => updateNested('newsletter.title1', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[8px] font-black uppercase text-white/20 ml-2">Headline 2</label>
                         <input className="w-full bg-black border border-white/5 rounded-xl p-6 text-2xl font-black text-white outline-none focus:border-gold/30" value={data.newsletter?.title2 || ''} onChange={e => updateNested('newsletter.title2', e.target.value)} />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-white/20 ml-2">Incentive Description</label>
                      <textarea 
                        className="w-full bg-black border border-white/5 rounded-2xl p-8 min-h-[140px] text-lg font-medium text-white/40 outline-none focus:border-gold/30 leading-relaxed"
                        value={data.newsletter?.description || ''}
                        onChange={e => updateNested('newsletter.description', e.target.value)}
                      />
                   </div>

                   <div className="border-t border-white/5 pt-8">
                      <label className="text-[8px] font-black uppercase text-white/10 ml-2">Institutional Copyright</label>
                      <input className="w-full bg-transparent p-4 text-[10px] font-medium text-white/20 outline-none" value={data.newsletter?.copyright || ''} onChange={e => updateNested('newsletter.copyright', e.target.value)} />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NOTIFICATIONS */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ y: 50, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed bottom-10 left-1/2 bg-[#111] text-white z-[2000] px-8 py-5 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 backdrop-blur-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(201,168,76,0.8)] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{message}</span>
                {message.includes('PUBLISHED') && storageStatus.postgres && <span className="text-[7px] text-white/40 uppercase tracking-widest mt-1">Cloud synchronized successfully</span>}
                {message.includes('PUBLISHED') && !storageStatus.postgres && <span className="text-[7px] text-gold/40 uppercase tracking-widest mt-1">Local session updated (Cloud unavailable)</span>}
              </div>
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
