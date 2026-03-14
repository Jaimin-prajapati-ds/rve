'use client';

import { useState, useEffect, useRef } from 'react';
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
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] uppercase font-bold tracking-widest">No Media Asset</div>
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setMessage('PUBLISHING...');
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setMessage('CHANGES SYNCED');
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
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin" />
      <div className="text-white/20 font-mono text-[9px] tracking-[0.6em] uppercase">Securing Connection</div>
    </div>
  );

  const tabs = [
    { id: 'hero', label: 'BRAND IDENTITY', icon: '✦' },
    { id: 'industry', label: 'MARKET SECTORS', icon: '◈' },
    { id: 'services', label: 'CORE SERVICES', icon: '▣' },
    { id: 'community', label: 'NETWORK REACH', icon: '♒' },
    { id: 'vision', label: 'CORPORATE VISION', icon: '❂' },
    { id: 'newsletter', label: 'NEXUS HUB', icon: '✉' }
  ];

  return (
    <main className="fixed inset-0 bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-gold selection:text-black font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-[320px] bg-black border-r border-white/5 flex flex-col z-[100] shrink-0">
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.open('/', '_blank')}>
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-[14px] group-hover:bg-gold transition-all font-mono rotate-3 group-hover:rotate-0">RVE</div>
            <div className="flex flex-col">
              <span className="font-black text-[16px] tracking-tight uppercase leading-none">Management</span>
              <span className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">v4.0.1 Stable</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 py-10 custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeTab === tab.id ? 'bg-white/[0.03] text-white shadow-inner' : 'text-white/20 hover:text-white/50 hover:bg-white/[0.01]'}`}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-gold/5 v-transparent opacity-50" />
              )}
              <div className="flex items-center gap-5 relative z-10">
                <span className={`text-[14px] transition-colors duration-500 ${activeTab === tab.id ? 'text-gold' : 'text-white/5'}`}>{tab.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_15px_rgba(201,168,76,0.6)] relative z-10" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-6">
           <AnimatePresence>
            {hasUnsavedChanges && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gold/5 border border-gold/10 px-5 py-4 rounded-2xl flex items-center justify-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold/80">Buffer Active</span>
                </motion.div>
            )}
           </AnimatePresence>
           <button 
             onClick={() => {
               document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
               window.location.href = "/admin/login";
             }}
             className="w-full text-center text-[9px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-red-500 transition-all py-5 border border-white/5 rounded-2xl hover:bg-red-500/[0.03] hover:border-red-500/10"
           >
             Terminate Session
           </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <section className="flex-1 flex flex-col h-full bg-[#080808] relative min-w-0">
        {/* TOP STATUS BAR */}
        <header className="h-[90px] border-b border-white/5 flex items-center justify-between px-12 bg-black/60 backdrop-blur-2xl z-50 shrink-0">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4 px-5 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                 <div className={`w-2 h-2 rounded-full ${storageStatus.postgres ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-gold shadow-[0_0_12px_rgba(201,168,76,0.5)]'}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    {storageStatus.postgres ? 'Sync Protocol: Online' : 'Sync Protocol: Local Only'}
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button 
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className={`flex items-center gap-5 px-10 h-[50px] rounded-2xl transition-all duration-700 font-black text-[10px] uppercase tracking-[0.25em] relative overflow-hidden shadow-2xl ${saving ? 'bg-white/5 text-white/20 cursor-wait' : hasUnsavedChanges ? 'bg-white text-black hover:bg-gold hover:text-white active:scale-[0.98]' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}
              >
                {saving && (
                  <motion.div initial={{ x: -200 }} animate={{ x: 400 }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-gold/10 skew-x-12" />
                )}
                <span>{saving ? 'Processing...' : 'Deploy Changes'}</span>
              </button>
           </div>
        </header>

        {/* SCROLLABLE CANVAS - FIXING THE SCROLL BY ENSURING HEIGHT 100% and OVERFLOW-Y */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 lg:p-20 custom-scrollbar scroll-smooth relative">
          <div className="max-w-[1000px] mx-auto w-full pb-32">
            <AnimatePresence mode="wait">
              {activeTab === 'hero' && (
                <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="space-y-20">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Brand<br/>Identity</h1>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-black border-l-2 border-gold pl-6 mt-6">Core Headlines & Icons</p>
                  </div>

                  <div className="grid grid-cols-1 gap-10">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Master Title</label>
                      <input 
                        type="text" 
                        value={data.hero?.title || ''}
                        onChange={(e) => updateNested('hero.title', e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-3xl px-10 py-10 text-4xl font-black text-white focus:border-gold/40 transition-all outline-none shadow-2xl focus:shadow-gold/[0.02]"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Manifesto Subtext</label>
                      <textarea 
                        value={data.hero?.subtitle || ''}
                        onChange={(e) => updateNested('hero.subtitle', e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-3xl px-10 py-10 min-h-[160px] text-xl font-medium text-white/50 focus:border-gold/40 transition-all outline-none leading-relaxed shadow-2xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-10 pt-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Global Icons</h3>
                        <button onClick={() => {
                          const newIcons = [...(data.hero?.icons || []), { name: "Name", handle: "@handle", description: "Position", image: "" }];
                          updateNested('hero.icons', newIcons);
                        }} className="px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hover:scale-105">+ Deploy Icon</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {data.hero?.icons?.map((icon: any, idx: number) => (
                          <div key={idx} className="bg-white/[0.01] border border-white/5 p-10 rounded-[48px] group relative hover:border-white/10 transition-all shadow-2xl hover:bg-white/[0.02]">
                            <button onClick={() => {
                              const n = data.hero.icons.filter((_: any, i: number) => i !== idx);
                              updateNested('hero.icons', n);
                            }} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 text-[10px] font-black uppercase transition-all z-20">X</button>
                            
                            <div className="space-y-10">
                              <ImageUpload 
                                currentUrl={icon.image} 
                                onUpload={url => {
                                  const n = [...data.hero.icons];
                                  n[idx].image = url;
                                  updateNested('hero.icons', n);
                                }} 
                              />
                              <div className="space-y-6">
                                  <input className="bg-transparent text-2xl font-black w-full border-b border-white/5 pb-3 focus:border-gold outline-none" placeholder="Icon Name" value={icon.name} onChange={e => {
                                    const n = [...data.hero.icons];
                                    n[idx].name = e.target.value;
                                    updateNested('hero.icons', n);
                                  }} />
                                  <input className="bg-transparent text-[10px] font-mono text-gold/60 w-full border-b border-white/5 pb-3 focus:border-gold outline-none" placeholder="@socialhandle" value={icon.handle} onChange={e => {
                                    const n = [...data.hero.icons];
                                    n[idx].handle = e.target.value;
                                    updateNested('hero.icons', n);
                                  }} />
                                  <textarea className="bg-transparent text-[12px] font-medium text-white/30 w-full min-h-[90px] outline-none leading-relaxed" placeholder="Brief authority description..." value={icon.description} onChange={e => {
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
                <motion.div key="industry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Market<br/>Sectors</h1>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-black border-l-2 border-gold pl-6 mt-6">Global Specialization</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="bg-white/[0.01] border border-white/5 p-10 rounded-[40px] space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Section Headline</label>
                        <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-2xl font-black text-white focus:border-gold/30 outline-none" value={data.industry?.title || ''} onChange={e => updateNested('industry.title', e.target.value)} />
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 p-10 rounded-[40px] space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Label Component</label>
                        <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-2xl font-black text-gold focus:border-gold/30 outline-none font-mono" value={data.industry?.subtitle || ''} onChange={e => updateNested('industry.subtitle', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {data.industry?.items?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white/[0.01] border border-white/5 p-10 rounded-[48px] group relative hover:border-white/10 transition-all shadow-2xl">
                          <button onClick={() => {
                            const n = data.industry.items.filter((_: any, i: number) => i !== idx);
                            updateNested('industry.items', n);
                          }} className="absolute top-10 right-10 text-red-500/20 hover:text-red-500 text-[10px] font-black uppercase transition-all z-20">X</button>
                          
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
                                  className="bg-transparent text-2xl font-black w-full border-b border-white/5 pb-4 focus:border-gold outline-none" 
                                  placeholder="Sector Designation"
                                  value={item.title} 
                                  onChange={e => {
                                    const n = [...data.industry.items];
                                    n[idx].title = e.target.value;
                                    updateNested('industry.items', n);
                                  }}
                                />
                                <textarea 
                                  className="bg-transparent text-[13px] font-medium text-white/40 w-full min-h-[100px] outline-none leading-relaxed" 
                                  placeholder="Value proposition description..."
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
                    }} className="border border-dashed border-white/10 p-12 rounded-[48px] text-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm font-black uppercase tracking-[0.4em] flex items-center justify-center min-h-[400px]">Expand Markets +</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Core<br/>Solutions</h1>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-black border-l-2 border-gold pl-6 mt-6">Capabilities Hierarchy</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Primary Header</label>
                        <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-2xl font-black text-white focus:border-gold/30 outline-none" value={data.services?.title1 || ''} onChange={e => updateNested('services.title1', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Secondary Header</label>
                        <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-2xl font-black text-white focus:border-gold/30 outline-none" value={data.services?.title2 || ''} onChange={e => updateNested('services.title2', e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="space-y-12">
                    {data.services?.items?.map((service: any, idx: number) => (
                        <div key={idx} className="bg-white/[0.01] border border-white/5 p-16 rounded-[60px] group relative hover:border-white/10 transition-all shadow-2xl">
                          <button onClick={() => {
                            const n = data.services.items.filter((_: any, i: number) => i !== idx);
                            updateNested('services.items', n);
                          }} className="absolute top-12 right-12 text-red-500/20 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all">TERMINATE MODULE</button>
                          
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                              <div className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <input 
                                      className="w-20 bg-black/60 border border-white/10 rounded-2xl p-4 text-center text-lg font-mono text-gold font-black shadow-inner"
                                      placeholder="ID"
                                      value={service.id}
                                      onChange={e => {
                                        const n = [...data.services.items];
                                        n[idx].id = e.target.value;
                                        updateNested('services.items', n);
                                      }}
                                    />
                                    <input 
                                      className="flex-1 bg-transparent text-4xl font-black border-b border-white/5 pb-6 focus:border-gold outline-none" 
                                      placeholder="Solution Title"
                                      value={service.title} 
                                      onChange={e => {
                                        const n = [...data.services.items];
                                        n[idx].title = e.target.value;
                                        updateNested('services.items', n);
                                      }}
                                    />
                                </div>
                                <textarea 
                                  className="bg-transparent text-xl font-medium text-white/40 w-full min-h-[160px] outline-none leading-relaxed" 
                                  placeholder="Full competency description and impact metrics..."
                                  value={service.desc} 
                                  onChange={e => {
                                    const n = [...data.services.items];
                                    n[idx].desc = e.target.value;
                                    updateNested('services.items', n);
                                  }}
                                />
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">Classification Label</label>
                                    <input 
                                      className="bg-black/40 border border-white/5 rounded-2xl px-8 py-4 text-xs font-mono text-gold/40 w-full outline-none focus:border-gold/30"
                                      placeholder="[ CLASSIFICATION ]"
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
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-4">Core Asset</label>
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
                        const n = [...(data.services?.items || []), { id: "04", title: "New Module", desc: "", img: "", tag: "[ NEW PROTOCOL ]" }];
                        updateNested('services.items', n);
                    }} className="w-full border border-dashed border-white/10 p-16 rounded-[60px] text-white/10 hover:border-gold/30 hover:text-gold transition-all text-lg font-black uppercase tracking-[0.5em] shadow-inner">Integrate New Solution +</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'community' && (
                <motion.div key="community" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Network<br/>Reach</h1>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-black border-l-2 border-gold pl-6 mt-6">Metrics & Social Proof</p>
                  </div>
                  
                  <div className="space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Protocol Label</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-7 text-gold font-mono text-base outline-none focus:border-gold/30" value={data.community?.tagline || ''} onChange={e => updateNested('community.tagline', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Primary CTA Action</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-7 text-white font-black text-base outline-none focus:border-gold/30" value={data.community?.ctaText || ''} onChange={e => updateNested('community.ctaText', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Section Headline Structure</label>
                        <div className="grid grid-cols-2 gap-6">
                          <input className="bg-black border border-white/5 rounded-2xl p-8 w-full text-4xl font-black text-white outline-none focus:border-gold/30" value={data.community?.title1 || ''} onChange={e => updateNested('community.title1', e.target.value)} />
                          <input className="bg-black border border-white/5 rounded-2xl p-8 w-full text-4xl font-black text-white outline-none focus:border-gold/30" value={data.community?.title2 || ''} onChange={e => updateNested('community.title2', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Community Philosophy</label>
                        <textarea className="w-full bg-black border border-white/5 rounded-3xl p-10 min-h-[180px] text-2xl font-medium text-white/50 outline-none focus:border-gold/40 leading-relaxed shadow-2xl" value={data.community?.description || ''} onChange={e => updateNested('community.description', e.target.value)} />
                    </div>

                    <div className="border-t border-white/5 pt-12 space-y-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/60">Live Metrics</h3>
                          <button onClick={() => {
                            const n = [...(data.community?.stats || []), { label: "METRIC", value: 0, suffix: "+" }];
                            updateNested('community.stats', n);
                          }} className="px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">+ Add Metric</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {data.community?.stats?.map((stat: any, idx: number) => (
                            <div key={idx} className="bg-white/[0.01] border border-white/5 p-8 rounded-[32px] relative group hover:border-white/10 transition-all shadow-2xl">
                                <button onClick={() => {
                                  const n = data.community.stats.filter((_: any, i: number) => i !== idx);
                                  updateNested('community.stats', n);
                                }} className="absolute top-6 right-6 text-red-500/0 group-hover:text-red-500 text-[10px] font-black uppercase transition-all z-20">X</button>
                                <div className="space-y-6">
                                  <input className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white/20 w-full outline-none focus:text-white" value={stat.label} onChange={e => {
                                      const n = [...data.community.stats];
                                      n[idx].label = e.target.value;
                                      updateNested('community.stats', n);
                                  }} />
                                  <div className="flex items-end gap-2">
                                      <input className="bg-transparent text-5xl font-black text-white w-full outline-none focus:text-gold" value={stat.value} onChange={e => {
                                        const n = [...data.community.stats];
                                        n[idx].value = e.target.value;
                                        updateNested('community.stats', n);
                                      }} />
                                      <input className="bg-transparent text-2xl font-black text-gold w-10 outline-none mb-1" value={stat.suffix} onChange={e => {
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
                <motion.div key="vision" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Corporate<br/>Vision</h1>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-black border-l-2 border-gold pl-6 mt-6">Philosophy & Narrative</p>
                  </div>

                  <div className="space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Manifesto Label</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-7 text-gold font-mono text-base outline-none" value={data.vision?.tagline || ''} onChange={e => updateNested('vision.tagline', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Content Designation</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-7 text-white/40 font-black text-base outline-none" value={data.vision?.episodeTag || ''} onChange={e => updateNested('vision.episodeTag', e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 ml-4">Headline 1</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-4xl font-black text-white outline-none focus:border-gold/30" value={data.vision?.title1 || ''} onChange={e => updateNested('vision.title1', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 ml-4">Headline 2</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-4xl font-black text-white outline-none focus:border-gold/30" value={data.vision?.title2 || ''} onChange={e => updateNested('vision.title2', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-4">Master Narrative Text</label>
                        <textarea 
                          className="w-full bg-black border border-white/5 rounded-[40px] p-12 min-h-[320px] text-2xl font-medium text-white/60 focus:border-gold/40 outline-none leading-relaxed shadow-2xl"
                          value={data.vision?.description || ''}
                          onChange={e => updateNested('vision.description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/10 ml-4">Deployment Status</label>
                          <input className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-gold font-mono text-xs outline-none" value={data.vision?.launchTag || ''} onChange={e => updateNested('vision.launchTag', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/10 ml-4">Primary Call</label>
                          <input className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white font-black text-xs outline-none tracking-widest" value={data.vision?.ctaText || ''} onChange={e => updateNested('vision.ctaText', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/10 ml-4">Protocol URL</label>
                          <input className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white/20 font-mono text-xs outline-none" value={data.vision?.ctaLink || ''} onChange={e => updateNested('vision.ctaLink', e.target.value)} />
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'newsletter' && (
                <motion.div key="newsletter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">Nexus<br/>Hub</h1>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.4em] font-black border-l-2 border-gold pl-6 mt-6">Digital Subscription Interface</p>
                  </div>

                  <div className="space-y-16">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-4">Functional Label</label>
                        <input className="w-full bg-black border border-white/5 rounded-2xl p-7 text-gold font-mono text-base outline-none" value={data.newsletter?.tagline || ''} onChange={e => updateNested('newsletter.tagline', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 ml-4">Header 1</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-4xl font-black text-white outline-none focus:border-gold/30" value={data.newsletter?.title1 || ''} onChange={e => updateNested('newsletter.title1', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase text-white/30 ml-4">Header 2</label>
                          <input className="w-full bg-black border border-white/5 rounded-2xl p-8 text-4xl font-black text-white outline-none focus:border-gold/30" value={data.newsletter?.title2 || ''} onChange={e => updateNested('newsletter.title2', e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-4">Value Proposition</label>
                        <textarea 
                          className="w-full bg-black border border-white/5 rounded-[40px] p-12 min-h-[180px] text-2xl font-medium text-white/40 outline-none focus:border-gold/40 leading-relaxed shadow-2xl"
                          value={data.newsletter?.description || ''}
                          onChange={e => updateNested('newsletter.description', e.target.value)}
                        />
                    </div>

                    <div className="pt-16 border-t border-white/5 opacity-50">
                        <label className="text-[9px] font-black uppercase text-white/20 ml-4">Institutional Copyright Notice</label>
                        <input className="w-full bg-transparent p-6 text-xs font-medium text-white/40 outline-none" value={data.newsletter?.copyright || ''} onChange={e => updateNested('newsletter.copyright', e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ y: 60, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="fixed bottom-12 left-1/2 bg-[#0a0a0a] text-white z-[2000] px-10 py-6 rounded-[32px] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex items-center gap-6 backdrop-blur-3xl min-w-[400px]"
            >
              <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_20px_rgba(201,168,76,1)] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] font-mono">{message}</span>
                <span className="text-[8px] text-white/40 uppercase tracking-widest mt-1.5">{saving ? 'Transaction in progress...' : 'Operational state updated'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACCESS OVERLAY SHADER */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.03); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        input, textarea { caret-color: #C9A84C; }
        @media (max-width: 1024px) {
          main { height: auto !important; overflow-y: auto !important; }
          aside { height: auto !important; }
          section { height: auto !important; }
        }
      `}</style>
    </main>
  );
}
