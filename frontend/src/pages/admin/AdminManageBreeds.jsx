import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, Edit3, Eye, AlertTriangle, X, CheckCircle, Image as ImageIcon, Database, Globe, Info } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import LocationPicker from '../../components/LocationPicker';

function AdminManageBreeds({ isDark, setIsDark }) {
  const [breeds, setBreeds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editBreed, setEditBreed] = useState(null);
  const [viewBreed, setViewBreed] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) { navigate('/admin'); return; }
    fetchBreeds();
  }, [navigate]);

  const fetchBreeds = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/breeds`);
      const data = await res.json();
      setBreeds(data);
    } catch (err) {
      console.error('Failed to fetch breeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBreed = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/breeds/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBreeds(prev => prev.filter(b => b._id !== id));
        setConfirmDelete(null);
      } else {
        alert('Failed to delete breed');
      }
    } catch (err) {
      alert('Network error while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  const saveEdit = async () => {
    setEditLoading(true);
    const payload = {
      name: editBreed.name,
      description: editBreed.description,
      origin: editBreed.origin,
      weight: editBreed.weight,
      milkProduction: editBreed.milkProduction,
      characteristics: editBreed.characteristics,
      careRequirements: editBreed.careRequirements,
      healthConsiderations: editBreed.healthConsiderations,
      lat: editBreed.lat ?? null,
      lng: editBreed.lng ?? null,
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(payload));
    if (editImageFile) fd.append('imageFile', editImageFile);

    try {
      const res = await fetch(`${API_BASE}/api/breeds/${editBreed._id}`, {
        method: 'PUT',
        body: fd
      });
      if (res.ok) {
        const updated = await res.json();
        setBreeds(prev => prev.map(b => b._id === updated._id ? updated : b));
        setEditSuccess(true);
        setTimeout(() => { setEditSuccess(false); setEditBreed(null); setEditImageFile(null); }, 1500);
      } else {
        alert('Failed to update breed');
      }
    } catch (err) {
      alert('Network error while updating');
    } finally {
      setEditLoading(false);
    }
  };

  const setEditField = (path, value) => {
    const keys = path.split('.');
    setEditBreed(prev => {
      const updated = { ...prev };
      if (keys.length === 1) updated[keys[0]] = value;
      else if (keys.length === 2) updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value };
      return updated;
    });
  };

  const handleAutoTranslate = async (text, pathHi) => {
    if (!text) return;
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      const translated = data[0].map(x => x[0]).join('');

      setEditBreed(prev => {
        const keys = pathHi.split('.');
        const updated = { ...prev };

        let finalValue = translated;
        // If it's characteristics, split it into an array
        if (pathHi === 'characteristics.hi') {
          finalValue = translated.split(',').map(s => s.trim());
        }

        if (keys.length === 1 && !updated[keys[0]]) {
          updated[keys[0]] = finalValue;
        } else if (keys.length === 2 && (!updated[keys[0]] || !updated[keys[0]][keys[1]])) {
          if (!updated[keys[0]]) updated[keys[0]] = {};
          updated[keys[0]][keys[1]] = finalValue;
        }
        return updated;
      });
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  const filteredBreeds = breeds.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <AdminNavbar isDark={isDark} setIsDark={setIsDark} />

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl transform animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#111a14]/90 border-red-500/20 shadow-red-500/5' : 'bg-white border-gray-200'}`}>
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-3xl font-black text-center mb-3 tracking-tight">Delete Breed?</h3>
            <p className="text-[var(--muted)] font-medium text-center mb-10 text-lg leading-relaxed">
              This will remove <span className="text-red-500 font-extrabold">{confirmDelete.name}</span> permanently from the global database.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--surface-hover)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBreed(confirmDelete._id)}
                disabled={deletingId === confirmDelete._id}
                className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {deletingId === confirmDelete._id ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewBreed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xl px-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-2xl rounded-[3rem] border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0f1712]/95 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="relative h-56 w-full flex-shrink-0">
              {viewBreed.image ? (
                <img src={viewBreed.image} alt={viewBreed.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                  <span className="text-white text-6xl font-black">{viewBreed.name?.[0]}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                <div>
                  <div className="text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Breed Intelligence</div>
                  <h3 className="text-3xl font-black text-white">{viewBreed.name}</h3>
                </div>
                <button
                  onClick={() => setViewBreed(null)}
                  className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <InfoRow label="Origin" value={viewBreed.origin?.en} subValue={viewBreed.origin?.hi} />
                <InfoRow label="Weight" value={viewBreed.weight?.en} subValue={viewBreed.weight?.hi} />
                <InfoRow label="Milk Production" value={viewBreed.milkProduction?.en} subValue={viewBreed.milkProduction?.hi} />
                <InfoRow label="Characteristics" value={Array.isArray(viewBreed.characteristics?.en) ? viewBreed.characteristics.en.join(', ') : viewBreed.characteristics?.en} subValue={Array.isArray(viewBreed.characteristics?.hi) ? viewBreed.characteristics.hi.join(', ') : viewBreed.characteristics?.hi} />
              </div>

              <div className="space-y-8">
                <div>
                  <SectionLabel>Description</SectionLabel>
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                      <div className="text-[10px] font-bold text-[var(--muted)] mb-1 uppercase tracking-widest">English</div>
                      <p className="text-sm font-medium leading-relaxed">{viewBreed.description?.en || 'N/A'}</p>
                    </div>
                    {viewBreed.description?.hi && (
                      <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                        <div className="text-[10px] font-bold text-green-500/60 mb-1 uppercase tracking-widest">Hindi</div>
                        <p className="text-sm font-medium leading-relaxed">{viewBreed.description?.hi}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-3 ml-1">Care Requirements</span>
                  {Array.isArray(viewBreed.careRequirements) && viewBreed.careRequirements.length > 0 ? (
                    <div className="space-y-3">
                      {viewBreed.careRequirements.map((c, i) => (
                        <div key={i} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] hover:border-green-500/30 transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-black border border-green-500/20">{i + 1}</div>
                            <div className="h-[1px] flex-1 bg-[var(--border)]" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50 mb-1">English</div>
                              <div className="font-extrabold text-sm text-[var(--text)] mb-1">{c.title?.en || '—'}</div>
                              <div className="text-xs text-[var(--muted)] leading-relaxed">{c.description?.en || '—'}</div>
                            </div>
                            <div className="border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-8">
                              <div className="text-[9px] font-black uppercase tracking-widest text-green-500 opacity-50 mb-1">Hindi</div>
                              <div className="font-extrabold text-sm text-green-600 dark:text-green-400 mb-1">{c.title?.hi || '—'}</div>
                              <div className="text-xs text-[var(--muted)] leading-relaxed">{c.description?.hi || '—'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[var(--muted)] text-sm italic border-2 border-dashed border-[var(--border)] rounded-[2.5rem]">
                      No specialized care data recorded.
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3 ml-1">Health Considerations</span>
                  {Array.isArray(viewBreed.healthConsiderations) && viewBreed.healthConsiderations.length > 0 ? (
                    <div className="space-y-3">
                      {viewBreed.healthConsiderations.map((c, i) => (
                        <div key={i} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] hover:border-red-500/30 transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xs font-black border border-red-500/20">{i + 1}</div>
                            <div className="h-[1px] flex-1 bg-[var(--border)]" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50 mb-1">English</div>
                              <div className="font-extrabold text-sm text-[var(--text)] mb-1">{c.title?.en || '—'}</div>
                              <div className="text-xs text-[var(--muted)] leading-relaxed">{c.description?.en || '—'}</div>
                            </div>
                            <div className="border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-8">
                              <div className="text-[9px] font-black uppercase tracking-widest text-red-500 opacity-50 mb-1">Hindi</div>
                              <div className="font-extrabold text-sm text-red-600 dark:text-red-400 mb-1">{c.title?.hi || '—'}</div>
                              <div className="text-xs text-[var(--muted)] leading-relaxed">{c.description?.hi || '—'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[var(--muted)] text-sm italic border-2 border-dashed border-[var(--border)] rounded-[2.5rem]">
                      No specific health risks recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editBreed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 py-8 animate-in fade-in duration-300">
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 flex flex-col ${isDark ? 'bg-[#111a14]/98 border-white/10' : 'bg-white border-gray-200'}`}>
                {/* Modal Header */}
                <div className={`p-8 border-b border-[var(--border)] flex items-center justify-between flex-shrink-0 ${isDark ? 'bg-black/20' : 'bg-gray-50/50'}`}>
                  <div>
                    <div className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Configuration Engine</div>
                    <h3 className="text-2xl font-black">{editSuccess ? 'Submission Complete' : `Edit: ${editBreed.name}`}</h3>
                  </div>
                  <button
                    onClick={() => { setEditBreed(null); setEditImageFile(null); }}
                    className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
                  {editSuccess ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-90">
                      <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-black mb-2">Genetic Update Successful</h3>
                      <p className="text-[var(--muted)] font-medium">The global registry has been updated.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <EditInput label="Breed Name" value={editBreed.name} onChange={v => setEditField('name', v)} />
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-2">
                                <ImageIcon size={14} className="text-blue-500" /> Breed Image (Cloudinary)
                              </label>
                              <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])}
                                className="w-full px-5 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 text-sm shadow-inner" />
                              {editBreed.image && !editImageFile && (
                                <div className="relative group w-40">
                                  <img src={editBreed.image} className="w-full h-24 rounded-2xl object-cover mt-2 border-2 border-[var(--border)] group-hover:border-green-500/50 transition-all shadow-lg" alt="current" />
                                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black text-white uppercase">Current Archetype</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1 block">Deployment Coordinates</label>
                            <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] shadow-inner overflow-hidden">
                              <LocationPicker
                                lat={editBreed.lat}
                                lng={editBreed.lng}
                                onChange={(lat, lng) => setEditBreed(prev => ({ ...prev, lat, lng }))}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-8 bg-[var(--surface)] rounded-[3rem] border border-[var(--border)] space-y-10 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            <div className="space-y-6">
                              <div className="flex items-center gap-3 pb-2 border-b border-[var(--border)]">
                                <Database size={16} className="text-green-500" />
                                <SectionLabel className="!mt-0">Core Specifications</SectionLabel>
                              </div>

                              <EditInput label="Origin EN" value={editBreed.origin?.en} onChange={v => setEditField('origin.en', v)} onBlur={v => handleAutoTranslate(v, 'origin.hi')} />
                              <EditInput label="Origin HI" value={editBreed.origin?.hi} onChange={v => setEditField('origin.hi', v)} />

                              <EditInput label="Weight EN" value={editBreed.weight?.en} onChange={v => setEditField('weight.en', v)} onBlur={v => handleAutoTranslate(v, 'weight.hi')} />
                              <EditInput label="Weight HI" value={editBreed.weight?.hi} onChange={v => setEditField('weight.hi', v)} />

                              <EditInput label="Milk EN" value={editBreed.milkProduction?.en} onChange={v => setEditField('milkProduction.en', v)} onBlur={v => handleAutoTranslate(v, 'milkProduction.hi')} />
                              <EditInput label="Milk HI" value={editBreed.milkProduction?.hi} onChange={v => setEditField('milkProduction.hi', v)} />
                            </div>

                            <div className="space-y-6">
                              <div className="flex items-center gap-3 pb-2 border-b border-[var(--border)]">
                                <Globe size={16} className="text-blue-500" />
                                <SectionLabel className="!mt-0">Linguistic Narratives</SectionLabel>
                              </div>
                              <EditTextarea label="Desc EN" value={editBreed.description?.en} onChange={v => setEditField('description.en', v)} onBlur={v => handleAutoTranslate(v, 'description.hi')} />
                              <EditTextarea label="Desc HI" value={editBreed.description?.hi} onChange={v => setEditField('description.hi', v)} />

                              <div className="pt-4 border-t border-[var(--border)] mt-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 block">Unique Traits (comma-separated)</span>
                                <EditInput label="EN List" value={editBreed.characteristics?.en?.join(', ')} onChange={v => setEditField('characteristics.en', v.split(',').map(s => s.trim()))} onBlur={v => handleAutoTranslate(v, 'characteristics.hi')} />
                                <div className="h-4" />
                                <EditInput label="HI List" value={editBreed.characteristics?.hi?.join(', ')} onChange={v => setEditField('characteristics.hi', v.split(',').map(s => s.trim()))} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                                <CheckCircle size={18} />
                              </div>
                              <h4 className="font-black uppercase tracking-widest text-sm">Specialized Care Network</h4>
                            </div>
                            {(!Array.isArray(editBreed.careRequirements) || editBreed.careRequirements.length < 5) && (
                              <button
                                type="button"
                                onClick={() => setEditBreed(prev => ({
                                  ...prev,
                                  careRequirements: [...(Array.isArray(prev.careRequirements) ? prev.careRequirements : []), { title: { en: '', hi: '' }, description: { en: '', hi: '' } }]
                                }))}
                                className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/10"
                              >
                                + Expand Matrix
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {(Array.isArray(editBreed.careRequirements) ? editBreed.careRequirements : []).map((care, idx) => (
                              <div key={idx} className="p-8 border border-[var(--border)] rounded-[2.5rem] bg-[var(--surface)] relative space-y-6 group hover:border-green-500/20 transition-all shadow-sm">
                                <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Requirement Unit #{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => setEditBreed(prev => {
                                      const newCares = [...prev.careRequirements];
                                      newCares.splice(idx, 1);
                                      return { ...prev, careRequirements: newCares };
                                    })}
                                    className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline opacity-60 hover:opacity-100"
                                  >
                                    Terminate Unit
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                    <EditInput label="Title EN" value={care.title?.en} onChange={v => {
                                      const newCares = [...editBreed.careRequirements];
                                      newCares[idx].title = { ...newCares[idx].title, en: v };
                                      setEditBreed({ ...editBreed, careRequirements: newCares });
                                    }} onBlur={async v => {
                                      if (!v || (care.title && care.title.hi)) return;
                                      try {
                                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(v)}`);
                                        const data = await res.json();
                                        const translated = data[0].map(x => x[0]).join('');
                                        const newCares = [...editBreed.careRequirements];
                                        newCares[idx].title = { ...newCares[idx].title, hi: translated };
                                        setEditBreed({ ...editBreed, careRequirements: newCares });
                                      } catch (err) { }
                                    }} />
                                    <EditTextarea label="Desc EN" value={care.description?.en} onChange={v => {
                                      const newCares = [...editBreed.careRequirements];
                                      newCares[idx].description = { ...newCares[idx].description, en: v };
                                      setEditBreed({ ...editBreed, careRequirements: newCares });
                                    }} onBlur={async v => {
                                      if (!v || (care.description && care.description.hi)) return;
                                      try {
                                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(v)}`);
                                        const data = await res.json();
                                        const translated = data[0].map(x => x[0]).join('');
                                        const newCares = [...editBreed.careRequirements];
                                        newCares[idx].description = { ...newCares[idx].description, hi: translated };
                                        setEditBreed({ ...editBreed, careRequirements: newCares });
                                      } catch (err) { }
                                    }} />
                                  </div>
                                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-[var(--border)] pt-8 md:pt-0 md:pl-8">
                                    <EditInput label="Title HI" value={care.title?.hi} onChange={v => {
                                      const newCares = [...editBreed.careRequirements];
                                      newCares[idx].title = { ...newCares[idx].title, hi: v };
                                      setEditBreed({ ...editBreed, careRequirements: newCares });
                                    }} />
                                    <EditTextarea label="Desc HI" value={care.description?.hi} onChange={v => {
                                      const newCares = [...editBreed.careRequirements];
                                      newCares[idx].description = { ...newCares[idx].description, hi: v };
                                      setEditBreed({ ...editBreed, careRequirements: newCares });
                                    }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                <Info size={18} />
                              </div>
                              <h4 className="font-black uppercase tracking-widest text-sm text-red-500">Survival Considerations</h4>
                            </div>
                            {(!Array.isArray(editBreed.healthConsiderations) || editBreed.healthConsiderations.length < 3) && (
                              <button
                                type="button"
                                onClick={() => setEditBreed(prev => ({
                                  ...prev,
                                  healthConsiderations: [...(Array.isArray(prev.healthConsiderations) ? prev.healthConsiderations : []), { title: { en: '', hi: '' }, description: { en: '', hi: '' } }]
                                }))}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/10"
                              >
                                + Log Observation
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {(Array.isArray(editBreed.healthConsiderations) ? editBreed.healthConsiderations : []).map((health, idx) => (
                              <div key={idx} className="p-8 border border-red-500/10 rounded-[2.5rem] bg-[var(--surface)] relative space-y-6 group hover:border-red-500/30 transition-all shadow-sm">
                                <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 opacity-60">Health Cluster #{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => setEditBreed(prev => {
                                      const newHealth = [...prev.healthConsiderations];
                                      newHealth.splice(idx, 1);
                                      return { ...prev, healthConsiderations: newHealth };
                                    })}
                                    className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline opacity-60 hover:opacity-100"
                                  >
                                    Revoke Entry
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                    <EditInput label="Title EN" value={health.title?.en} onChange={v => {
                                      const newHealth = [...editBreed.healthConsiderations];
                                      newHealth[idx].title = { ...newHealth[idx].title, en: v };
                                      setEditBreed({ ...editBreed, healthConsiderations: newHealth });
                                    }} onBlur={async v => {
                                      if (!v || (health.title && health.title.hi)) return;
                                      try {
                                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(v)}`);
                                        const data = await res.json();
                                        const translated = data[0].map(x => x[0]).join('');
                                        const newHealth = [...editBreed.healthConsiderations];
                                        newHealth[idx].title = { ...newHealth[idx].title, hi: translated };
                                        setEditBreed({ ...editBreed, healthConsiderations: newHealth });
                                      } catch (err) { }
                                    }} />
                                    <EditTextarea label="Desc EN" value={health.description?.en} onChange={v => {
                                      const newHealth = [...editBreed.healthConsiderations];
                                      newHealth[idx].description = { ...newHealth[idx].description, en: v };
                                      setEditBreed({ ...editBreed, healthConsiderations: newHealth });
                                    }} onBlur={async v => {
                                      if (!v || (health.description && health.description.hi)) return;
                                      try {
                                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(v)}`);
                                        const data = await res.json();
                                        const translated = data[0].map(x => x[0]).join('');
                                        const newHealth = [...editBreed.healthConsiderations];
                                        newHealth[idx].description = { ...newHealth[idx].description, hi: translated };
                                        setEditBreed({ ...editBreed, healthConsiderations: newHealth });
                                      } catch (err) { }
                                    }} />
                                  </div>
                                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-[var(--border)] pt-8 md:pt-0 md:pl-8">
                                    <EditInput label="Title HI" value={health.title?.hi} onChange={v => {
                                      const newHealth = [...editBreed.healthConsiderations];
                                      newHealth[idx].title = { ...newHealth[idx].title, hi: v };
                                      setEditBreed({ ...editBreed, healthConsiderations: newHealth });
                                    }} />
                                    <EditTextarea label="Desc HI" value={health.description?.hi} onChange={v => {
                                      const newHealth = [...editBreed.healthConsiderations];
                                      newHealth[idx].description = { ...newHealth[idx].description, hi: v };
                                      setEditBreed({ ...editBreed, healthConsiderations: newHealth });
                                    }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                {!editSuccess && (
                  <div className={`p-8 border-t border-[var(--border)] flex items-center justify-between flex-shrink-0 ${isDark ? 'bg-black/20' : 'bg-gray-50/50'}`}>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Global Synchronization</p>
                      <p className="text-[9px] font-medium text-green-500/70">Ready for network propagation</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button
                        onClick={() => { setEditBreed(null); setEditImageFile(null); }}
                        className="flex-1 sm:flex-none px-10 py-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--surface-hover)] transition-all"
                      >
                        Discard
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={editLoading}
                        className="flex-1 sm:flex-none px-12 py-5 bg-green-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50"
                      >
                        {editLoading ? 'Syncing...' : 'Push Updates'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Manage Breeds</h1>
          <p className="text-[var(--muted)] font-medium text-sm sm:text-base">View, edit, or delete cloud-stored breeds · {breeds.length} total</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-8 border-b border-[var(--border)]">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center text-[var(--muted)] group-focus-within:text-green-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search breeds..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 sm:pl-16 pr-4 sm:pr-8 py-4 sm:py-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl sm:rounded-[2rem] outline-none focus:border-green-500 transition-all font-bold text-sm sm:text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : filteredBreeds.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-black mb-2">No cloud breeds found</h3>
              <p className="text-[var(--muted)] text-sm font-medium">Add breeds from the "Add Breed" page first.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filteredBreeds.map(breed => (
                <div key={breed._id} className="flex items-center gap-4 px-4 sm:px-8 py-5 hover:bg-[var(--surface)] transition-colors">
                  {breed.image ? (
                    <img src={breed.image} alt={breed.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-[var(--border)] shadow" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow">
                      {breed.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-lg truncate">{breed.name}</div>
                    <div className="text-xs font-bold text-[var(--muted)] truncate">{breed.origin?.en || 'No origin set'}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setViewBreed(breed)}
                      className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setEditBreed({ ...breed })}
                      className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(breed)}
                      className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-xs font-black uppercase tracking-widest text-green-500 mt-4 mb-1">{children}</p>;
}

function EditInput({ label, value, onChange, onBlur }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] w-8 flex-shrink-0">{label}</span>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur && onBlur(e.target.value)}
        className="flex-1 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:border-green-500 outline-none transition-all font-bold text-sm"
      />
    </div>
  );
}

function EditTextarea({ label, value, onChange, onBlur }) {
  return (
    <div className="flex gap-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] w-8 flex-shrink-0 mt-3">{label}</span>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur && onBlur(e.target.value)}
        rows={3}
        className="flex-1 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:border-green-500 outline-none transition-all font-bold text-sm resize-none"
      />
    </div>
  );
}

function InfoRow({ label, value, multiline }) {
  if (!value) return null;
  return (
    <div className={`flex gap-3 ${multiline ? 'flex-col' : 'items-start'}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] flex-shrink-0 w-36">{label}</span>
      <span className="font-medium text-[var(--text)]">{value}</span>
    </div>
  );
}

export default AdminManageBreeds;
