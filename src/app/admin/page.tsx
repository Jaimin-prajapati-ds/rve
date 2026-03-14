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

  useEffect(() => {
    if (data && originalData) {
      setHasUnsavedChanges(JSON.stringify(data) !== JSON.stringify(originalData));
    }
  }, [data, originalData]);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(d => {
        setData(JSON.parse(JSON.stringify(d)));
        setOriginalData(JSON.parse(JSON.stringify(d)));
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setMessage('ERROR FETCHING CMS DATA');
      });
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
        setMessage('CHANGES PUBLISHED SUCCESSFULLY');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage(`ERROR: ${errorData.error || 'COULD NOT SAVE'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      setMessage('SYSTEM ERROR: UNABLE TO REACH SERVER');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleResetSection = (section: string) => {
    try {
      const newData = { ...data };
      newData[section] = JSON.parse(JSON.stringify(originalData[section]));
      setData(newData);
      setMessage(`SECTION REVERTED`);
    } catch (err) {
      setMessage('FAILED TO REVERT');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const updateNested = (path: string, val: any) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = val;
    setData(newData);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <div className="text-white font-sans text-[11px] tracking-[0.4em] uppercase font-bold opacity-30">INITIALIZING SECURE SUITE</div>
    </div>
  );

  const tabs = [
    { id: 'hero', label: 'Top Section' },
    { id: 'industry', label: 'Industry Items' },
    { id: 'services', label: 'Services List' },
    { id: 'community', label: 'Our Numbers' },
    { id: 'vision', label: 'Projects' },
    { id: 'newsletter', label: 'Footer Settings' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-gold selection:text-black">
      {/* Save Bar */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5 py-3 px-6 md:px-12 flex justify-between items-center shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href = '/'}>
             <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-[10px]">RVE</div>
             <span className="font-bold text-[14px] tracking-tight uppercase">Dashboard</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${saving ? 'bg-gold animate-ping' : 'bg-green-500'} `} />
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold hidden lg:block">Connected</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-2">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Unsaved Changes</span>
                </div>
              )}
           </div>
           
           <div className="flex items-center gap-4">
              <button 
               onClick={handleSave}
               disabled={saving}
               className={`px-8 py-3 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all ${saving ? 'bg-white/10 text-white/20' : 'bg-white text-black hover:bg-gold hover:scale-105 active:scale-95'}`}
              >
                {saving ? 'Saving...' : 'Publish Changes'}
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 md:p-12 lg:flex gap-16">
        {/* Navigation */}
        <nav className="lg:w-72 mb-12 lg:mb-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-8 py-5 rounded-[24px] font-bold transition-all flex items-center justify-between group ${activeTab === tab.id ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <span>{tab.label}</span>
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
          
          <div className="mt-12 px-6 pt-12 border-t border-white/5 space-y-4">
             <a href="/" target="_blank" className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold group-hover:text-white">View Live Site</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_#c9a84c]" />
             </a>
             <button onClick={() => {
               document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
               window.location.href = "/admin/login";
             }} className="w-full text-center text-[10px] uppercase tracking-widest text-red-500/30 hover:text-red-500 font-bold transition-colors py-2">Terminate Session</button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 max-w-[900px]">
          <AnimatePresence mode="wait">
            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Main Headline Area</h2>
                    <p className="text-white/40 text-sm">Change the text and cards at the top of your website.</p>
                  </div>
                  <button onClick={() => handleResetSection('hero')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Undo Changes</button>
                </header>

                <div className="grid gap-12">
                  <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-inner">
                    <div className="grid gap-6">
                      <div>
                        <label className="label">Primary Headline</label>
                        <input 
                          type="text" 
                          value={data.hero?.title || ''}
                          onChange={(e) => updateNested('hero.title', e.target.value)}
                          className="admin-input text-2xl font-bold py-6 px-8 rounded-[24px]"
                        />
                      </div>
                      <div>
                        <label className="label">Contextual Subtitle</label>
                        <textarea 
                          value={data.hero?.subtitle || ''}
                          onChange={(e) => updateNested('hero.subtitle', e.target.value)}
                          className="admin-input min-h-[140px] py-6 px-8 rounded-[24px] leading-relaxed text-white/70"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-xl font-bold">Featured Professional Cards</h3>
                       <button 
                         onClick={() => {
                           const newIcons = [...(data.hero?.icons || []), { name: "New Profile", handle: "@handle", description: "Experience description", image: "" }];
                           updateNested('hero.icons', newIcons);
                         }}
                         className="text-[10px] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full font-bold uppercase tracking-widest transition-all"
                       >
                         + Add Profile
                       </button>
                    </div>
                    <div className="grid gap-8">
                      {data.hero?.icons?.map((icon: any, idx: number) => (
                        <div key={idx} className="relative group/card">
                          <button 
                             onClick={() => {
                               const newIcons = data.hero.icons.filter((_: any, i: number) => i !== idx);
                               updateNested('hero.icons', newIcons);
                             }}
                             className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all z-20 hover:scale-110 active:scale-95 shadow-xl"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10 hover:border-white/10 transition-colors">
                            <div className="space-y-6">
                              <div>
                                <label className="label">Name</label>
                                <input 
                                  type="text" 
                                  value={icon.name}
                                  onChange={(e) => {
                                    const newIcons = [...data.hero.icons];
                                    newIcons[idx].name = e.target.value;
                                    updateNested('hero.icons', newIcons);
                                  }}
                                  className="admin-input font-bold"
                                />
                              </div>
                              <div>
                                <label className="label">Handle</label>
                                <input 
                                  type="text" 
                                  value={icon.handle}
                                  onChange={(e) => {
                                    const newIcons = [...data.hero.icons];
                                    newIcons[idx].handle = e.target.value;
                                    updateNested('hero.icons', newIcons);
                                  }}
                                  className="admin-input text-gold/60 font-mono"
                                />
                              </div>
                              <div>
                                <label className="label">Narrative</label>
                                <textarea 
                                  value={icon.description}
                                  onChange={(e) => {
                                    const newIcons = [...data.hero.icons];
                                    newIcons[idx].description = e.target.value;
                                    updateNested('hero.icons', newIcons);
                                  }}
                                  className="admin-input min-h-[100px] text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="label text-center mb-4">Portrait Asset</label>
                              <ImageUpload 
                                currentUrl={icon.image}
                                onUpload={(url) => {
                                  const newIcons = [...data.hero.icons];
                                  newIcons[idx].image = url;
                                  updateNested('hero.icons', newIcons);
                                }}
                                onError={(err) => setMessage('ERROR: ' + err)}
                              />
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
              <motion.div key="industry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Market Sections</h2>
                    <p className="text-white/40 text-sm">Update the different industry cards you show.</p>
                  </div>
                  <button onClick={() => handleResetSection('industry')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Undo Changes</button>
                </header>

                <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-6">
                  <div>
                    <label className="label">Section Headline</label>
                    <input 
                      type="text" 
                      value={data.industry?.title || ''}
                      onChange={(e) => updateNested('industry.title', e.target.value)}
                      className="admin-input text-2xl font-bold py-6 px-8 rounded-[24px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end px-4">
                   <button 
                     onClick={() => {
                       const newItems = [...(data.industry?.items || []), { title: "New Market", desc: "Capability description", image: "" }];
                       updateNested('industry.items', newItems);
                     }}
                     className="text-[10px] bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full font-bold uppercase tracking-widest transition-all"
                   >
                     + Add Market
                   </button>
                </div>

                <div className="grid gap-8">
                  {data.industry?.items?.map((item: any, idx: number) => (
                    <div key={idx} className="relative group/card">
                       <button 
                          onClick={() => {
                            const newItems = data.industry.items.filter((_: any, i: number) => i !== idx);
                            updateNested('industry.items', newItems);
                          }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all z-20 hover:scale-110 shadow-xl"
                       >
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </button>
                       <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                             <div>
                               <label className="label">Market Name</label>
                               <input 
                                 type="text" 
                                 value={item.title}
                                 onChange={(e) => {
                                   const newItems = [...data.industry.items];
                                   newItems[idx].title = e.target.value;
                                   updateNested('industry.items', newItems);
                                 }}
                                 className="admin-input font-black"
                               />
                             </div>
                             <div>
                               <label className="label">Capabilities</label>
                               <textarea 
                                 value={item.desc}
                                 onChange={(e) => {
                                   const newItems = [...data.industry.items];
                                   newItems[idx].desc = e.target.value;
                                   updateNested('industry.items', newItems);
                                 }}
                                 className="admin-input min-h-[120px] text-sm"
                               />
                             </div>
                          </div>
                          <div>
                             <label className="label text-center mb-4">Market Asset (PNG/JPG)</label>
                             <ImageUpload 
                               currentUrl={item.image}
                               onUpload={(url) => {
                                  const newItems = [...data.industry.items];
                                  newItems[idx].image = url;
                                  updateNested('industry.items', newItems);
                               }}
                               onError={(err) => setMessage('ERROR: ' + err)}
                             />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <header className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
                  <button onClick={() => handleResetSection('services')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Undo Changes</button>
                </header>
                <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 grid grid-cols-2 gap-8">
                  <div>
                    <label className="label">Headline Prefix</label>
                    <input type="text" value={data.services?.title1 || ''} onChange={e => updateNested('services.title1', e.target.value)} className="admin-input font-bold" />
                  </div>
                  <div>
                    <label className="label">Headline Accent</label>
                    <input type="text" value={data.services?.title2 || ''} onChange={e => updateNested('services.title2', e.target.value)} className="admin-input font-bold" />
                  </div>
                </div>

                <div className="flex justify-end px-4">
                   <button 
                     onClick={() => {
                       const newItems = [...(data.services?.items || []), { id: "0" + ((data.services?.items?.length || 0) + 1), title: "New Service", desc: "Solution description", img: "", tag: "[New]" }];
                       updateNested('services.items', newItems);
                     }}
                     className="text-[10px] bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full font-bold uppercase tracking-widest transition-all"
                   >
                     + Add Solution
                   </button>
                </div>

                <div className="grid gap-8">
                   {data.services?.items?.map((item: any, idx: number) => (
                     <div key={idx} className="relative group/card">
                       <button 
                          onClick={() => {
                            const newItems = data.services.items.filter((_: any, i: number) => i !== idx);
                            updateNested('services.items', newItems);
                          }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all z-20 hover:scale-110 shadow-xl"
                       >
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </button>
                       <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="label">Solution Title</label>
                               <input type="text" value={item.title} onChange={e => {
                                 const items = [...data.services.items];
                                 items[idx].title = e.target.value;
                                 updateNested('services.items', items);
                               }} className="admin-input font-bold" />
                             </div>
                             <div>
                               <label className="label">Tag System</label>
                               <input type="text" value={item.tag} onChange={e => {
                                 const items = [...data.services.items];
                                 items[idx].tag = e.target.value;
                                 updateNested('services.items', items);
                               }} className="admin-input font-mono text-gold" />
                             </div>
                           </div>
                           <div>
                             <label className="label">Description</label>
                             <textarea value={item.desc} onChange={e => {
                               const items = [...data.services.items];
                               items[idx].desc = e.target.value;
                               updateNested('services.items', items);
                             }} className="admin-input min-h-[100px]" />
                           </div>
                         </div>
                         <div>
                           <label className="label text-center mb-4">Solution Visualization</label>
                           <ImageUpload 
                            currentUrl={item.img} 
                            onUpload={(url) => {
                             const items = [...data.services.items];
                             items[idx].img = url;
                             updateNested('services.items', items);
                            }} 
                            onError={(err) => setMessage('ERROR: ' + err)}
                           />
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div key="community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <header className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold tracking-tight">Community Stats</h2>
                  <button onClick={() => handleResetSection('community')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Undo Changes</button>
                </header>
                <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="col-span-2">
                        <label className="label">Contextual Tagline</label>
                        <input type="text" value={data.community?.tagline || ''} onChange={e => updateNested('community.tagline', e.target.value)} className="admin-input" />
                      </div>
                      <div>
                        <label className="label">Headline Anchor</label>
                        <input type="text" value={data.community?.title1 || ''} onChange={e => updateNested('community.title1', e.target.value)} className="admin-input font-bold" />
                      </div>
                      <div>
                        <label className="label">Headline Emphatic (Italic)</label>
                        <input type="text" value={data.community?.title2 || ''} onChange={e => updateNested('community.title2', e.target.value)} className="admin-input italic font-bold" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {data.community?.stats?.map((stat: any, idx: number) => (
                     <div key={idx} className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-6 group/stat relative">
                        <button 
                          onClick={() => {
                            const newStats = data.community.stats.filter((_: any, i: number) => i !== idx);
                            updateNested('community.stats', newStats);
                          }}
                          className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover/stat:opacity-100 transition-all font-bold text-[10px]"
                        >
                          DELETE
                        </button>
                        <label className="label text-center">{stat.label}</label>
                        <div className="flex gap-4">
                          <input type="number" step="0.1" value={stat.value} onChange={e => {
                            const stats = [...data.community.stats];
                            stats[idx].value = parseFloat(e.target.value);
                            updateNested('community.stats', stats);
                          }} className="flex-1 bg-black border border-white/10 rounded-2xl py-6 text-center text-4xl font-black focus:border-gold outline-none" />
                          <input type="text" value={stat.suffix} onChange={e => {
                            const stats = [...data.community.stats];
                            stats[idx].suffix = e.target.value;
                            updateNested('community.stats', stats);
                          }} className="w-24 bg-black border border-white/10 rounded-2xl py-6 text-center text-3xl font-black text-gold focus:border-gold outline-none" />
                        </div>
                        <input type="text" value={stat.label} onChange={e => {
                           const stats = [...data.community.stats];
                           stats[idx].label = e.target.value;
                           updateNested('community.stats', stats);
                        }} className="admin-input py-3 text-[10px] uppercase font-black tracking-widest text-center text-white/40" />
                     </div>
                   ))}
                   <button 
                     onClick={() => {
                       const newStats = [...(data.community?.stats || []), { label: "NEW STAT", value: 0, suffix: "+" }];
                       updateNested('community.stats', newStats);
                     }}
                     className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-[40px] p-10 flex flex-col items-center justify-center text-white/20 hover:text-gold hover:border-gold transition-all group min-h-[250px]"
                   >
                     <span className="text-4xl group-hover:scale-125 transition-transform mb-2">+</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">Add Metric</span>
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'vision' && (
              <motion.div key="vision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <header className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold tracking-tight">Future Projects</h2>
                  <button onClick={() => handleResetSection('vision')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Undo Changes</button>
                </header>
                <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="label">Section Header</label><input className="admin-input font-bold" value={data.vision?.title1 || ''} onChange={e => updateNested('vision.title1', e.target.value)} /></div>
                    <div><label className="label">Project Name</label><input className="admin-input font-bold" value={data.vision?.title2 || ''} onChange={e => updateNested('vision.title2', e.target.value)} /></div>
                  </div>
                  <div><label className="label">Project Description</label><textarea className="admin-input min-h-[140px] text-lg leading-relaxed" value={data.vision?.description || ''} onChange={e => updateNested('vision.description', e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="label">Launching Tag</label><input className="admin-input bg-gold/5 border-gold/20 text-gold font-bold" value={data.vision?.launchTag || ''} onChange={e => updateNested('vision.launchTag', e.target.value)} /></div>
                    <div><label className="label">Info Label</label><input className="admin-input font-mono" value={data.vision?.episodeTag || ''} onChange={e => updateNested('vision.episodeTag', e.target.value)} /></div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'newsletter' && (
              <motion.div key="newsletter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <header className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold tracking-tight">Footer & Copy</h2>
                  <button onClick={() => handleResetSection('newsletter')} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Undo Changes</button>
                </header>
                <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="label">Footer Header 1</label><input className="admin-input font-bold" value={data.newsletter?.title1 || ''} onChange={e => updateNested('newsletter.title1', e.target.value)} /></div>
                    <div><label className="label">Footer Header 2</label><input className="admin-input font-bold" value={data.newsletter?.title2 || ''} onChange={e => updateNested('newsletter.title2', e.target.value)} /></div>
                  </div>
                  <div><label className="label">Footer Main Text</label><textarea className="admin-input min-h-[120px]" value={data.newsletter?.description || ''} onChange={e => updateNested('newsletter.description', e.target.value)} /></div>
                  <div><label className="label">Copyright Text</label><input className="admin-input py-4 text-white/30 text-[10px]" value={data.newsletter?.copyright || ''} onChange={e => updateNested('newsletter.copyright', e.target.value)} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }} 
            animate={{ opacity: 1, y: 0, x: "-50%" }} 
            exit={{ opacity: 0, y: 20, x: "-50%" }} 
            className="fixed bottom-12 left-1/2 bg-white text-black font-black px-12 py-6 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[9999] text-[10px] tracking-[0.2em] uppercase flex items-center gap-6 pointer-events-none"
          >
             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.includes('ERROR') ? 'bg-red-500' : 'bg-black'}`}>
                {message.includes('ERROR') ? (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
             </div>
             {message}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.2);
          font-weight: 900;
          margin-bottom: 12px;
          margin-left: 16px;
        }
        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 16px 24px;
          color: white;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          outline: none;
        }
        .admin-input:focus {
          background: rgba(255,255,255,0.03);
          border-color: #c9a84c;
          box-shadow: 0 0 40px rgba(201,168,76,0.05);
        }
      `}</style>
    </main>
  );
}
