import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import { Database, Plus, Globe, Info, Image as ImageIcon, CheckCircle, AlertCircle, Activity, Heart, ShieldAlert, Sparkles, ShieldCheck } from 'lucide-react';
import AdminNavbar from './AdminNavbar';

function AdminDiseases({ isDark, setIsDark }) {
  const [formData, setFormData] = useState({
    nameEn: '',
    nameHi: '',
    severity: 'Medium',
    recoveryEn: '',
    recoveryHi: '',
    overviewEn: '',
    overviewHi: '',
  });

  const [symptoms, setSymptoms] = useState([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
  const [treatments, setTreatments] = useState([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
  const [causes, setCauses] = useState([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
  const [prevention, setPrevention] = useState([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAutoTranslate = async (text, fieldHi) => {
    if (!text) return;
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      const translated = data[0].map(x => x[0]).join('');
      setFormData(prev => ({ ...prev, [fieldHi]: translated }));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleArrayTranslate = async (text, idx, fieldHi, stateSetter) => {
    if (!text) return;
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      const translated = data[0].map(x => x[0]).join('');
      stateSetter(prev => {
        const newData = [...prev];
        if (!newData[idx][fieldHi]) {
          newData[idx][fieldHi] = translated;
        }
        return newData;
      });
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payloadObj = {
      name: { en: formData.nameEn, hi: formData.nameHi },
      severity: formData.severity,
      recoveryTime: { en: formData.recoveryEn, hi: formData.recoveryHi },
      overview: { en: formData.overviewEn, hi: formData.overviewHi },
      symptoms: symptoms.map(s => ({ title: { en: s.titleEn, hi: s.titleHi }, description: { en: s.descEn, hi: s.descHi } })),
      treatment: treatments.map(t => ({ title: { en: t.titleEn, hi: t.titleHi }, description: { en: t.descEn, hi: t.descHi } })),
      causes: causes.map(c => ({ title: { en: c.titleEn, hi: c.titleHi }, description: { en: c.descEn, hi: c.descHi } })),
      prevention: prevention.map(p => ({ title: { en: p.titleEn, hi: p.titleHi }, description: { en: p.descEn, hi: p.descHi } })),
    };

    const submitFormData = new FormData();
    submitFormData.append('data', JSON.stringify(payloadObj));
    if (imageFile) {
      submitFormData.append('imageFile', imageFile);
    }

    try {
      const res = await fetch(`${API_BASE}/api/diseases`, {
        method: 'POST',
        body: submitFormData
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setImageFile(null);
          setFormData({
            nameEn: '', nameHi: '', severity: 'Medium', recoveryEn: '', recoveryHi: '', overviewEn: '', overviewHi: '',
          });
          setSymptoms([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
          setTreatments([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
          setCauses([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
          setPrevention([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to add disease:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <AdminNavbar isDark={isDark} setIsDark={setIsDark} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Disease Management</h1>
          <p className="text-[var(--muted)] font-medium text-sm sm:text-base">Enhance the livestock health database</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-lg sm:shadow-2xl relative overflow-hidden">
          {success && (
            <div className="absolute inset-0 z-50 bg-[var(--card)]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-black">Disease Data Integrated!</h3>
                <p className="text-[var(--muted)] font-medium mt-2">The veterinary database has been updated.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
            {/* Primary Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
                  <Activity size={16} className="text-red-500" /> Disease Name (EN)
                </label>
                <input
                  type="text" required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  onBlur={(e) => { if (!formData.nameHi) handleAutoTranslate(e.target.value, 'nameHi'); }}
                  placeholder="e.g. Mastitis"
                  className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-red-500 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
                   नाम (HI)
                </label>
                <input
                  type="text" required
                  value={formData.nameHi}
                  onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                  placeholder="रोग का नाम"
                  className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-red-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
                  <ShieldAlert size={16} className="text-amber-500" /> Severity Level
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-amber-500 outline-none transition-all font-bold appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
                  <ImageIcon size={16} className="text-blue-500" /> Medical Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-blue-500 outline-none transition-all font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

             {/* Overview & Recovery */}
             <div className="space-y-6">
                <SectionHeader icon={<Globe size={18} />} title="Overview & Recovery" color="text-indigo-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <textarea
                      value={formData.overviewEn}
                      onChange={(e) => setFormData({ ...formData, overviewEn: e.target.value })}
                      onBlur={(e) => { if (!formData.overviewHi) handleAutoTranslate(e.target.value, 'overviewHi'); }}
                      placeholder="Medical Overview (EN)"
                      className="w-full h-32 px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold resize-none"
                    />
                    <input
                      type="text"
                      value={formData.recoveryEn}
                      onChange={(e) => setFormData({ ...formData, recoveryEn: e.target.value })}
                      onBlur={(e) => { if (!formData.recoveryHi) handleAutoTranslate(e.target.value, 'recoveryHi'); }}
                      placeholder="Recovery Time (e.g. 7-14 days) (EN)"
                      className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <textarea
                      value={formData.overviewHi}
                      onChange={(e) => setFormData({ ...formData, overviewHi: e.target.value })}
                      placeholder="रोग का विवरण (HI)"
                      className="w-full h-32 px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold resize-none"
                    />
                     <input
                      type="text"
                      value={formData.recoveryHi}
                      onChange={(e) => setFormData({ ...formData, recoveryHi: e.target.value })}
                      placeholder="रिकवरी का समय (HI)"
                      className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
             </div>

            {/* SYMPTOMS Section */}
            <ArraySection 
              title="Clinical Symptoms" 
              icon={<Heart size={18} />} 
              items={symptoms} 
              setItems={setSymptoms} 
              handleTranslate={handleArrayTranslate} 
              color="text-red-500"
            />

            {/* CAUSES Section */}
            <ArraySection 
              title="Probable Causes" 
              icon={<AlertCircle size={18} />} 
              items={causes} 
              setItems={setCauses} 
              handleTranslate={handleArrayTranslate} 
              color="text-amber-600"
            />

            {/* TREATMENT Section */}
            <ArraySection 
              title="Recommended Treatment" 
              icon={<Sparkles size={18} />} 
              items={treatments} 
              setItems={setTreatments} 
              handleTranslate={handleArrayTranslate} 
              color="text-blue-600"
            />

            {/* PREVENTION Section */}
            <ArraySection 
              title="Prevention Protocol" 
              icon={<ShieldCheck size={18} />} 
              items={prevention} 
              setItems={setPrevention} 
              handleTranslate={handleArrayTranslate} 
              color="text-green-600"
            />

            <button
              type="submit" disabled={loading}
              className="w-full py-6 bg-red-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing Medical Data...' : 'Integrate New Disease Resource'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, color }) {
  return (
    <div className={`flex items-center gap-3 pb-2 border-b-2 border-current ${color} mb-6`}>
      <div>{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h3>
    </div>
  );
}

function ArraySection({ title, icon, items, setItems, handleTranslate, color }) {
  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between border-b-2 border-current ${color} pb-2 mb-6`}>
        <div className="flex items-center gap-3">
          <div className={color}>{icon}</div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h3>
        </div>
        {items.length < 8 && (
          <button
            type="button"
            onClick={() => setItems([...items, { titleEn: '', titleHi: '', descEn: '', descHi: '' }])}
            className={`flex items-center gap-1 text-sm font-bold hover:underline ${color}`}
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>
      
      {items.map((item, idx) => (
        <div key={idx} className="space-y-4 p-6 border border-[var(--border)] rounded-[2rem] bg-[var(--surface)] shadow-inner">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-[var(--muted)] uppercase tracking-widest">Observation Point {idx + 1}</span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
                className="text-red-500 text-xs font-bold hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title (English)"
                value={item.titleEn}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx].titleEn = e.target.value;
                  setItems(newItems);
                }}
                onBlur={e => handleTranslate(e.target.value, idx, 'titleHi', setItems)}
                className="w-full px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl focus:border-current outline-none transition-all font-bold text-sm"
              />
              <textarea
                placeholder="Detailed Description (English)"
                value={item.descEn}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx].descEn = e.target.value;
                  setItems(newItems);
                }}
                onBlur={e => handleTranslate(e.target.value, idx, 'descHi', setItems)}
                className="w-full h-24 px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl focus:border-current outline-none transition-all font-bold resize-none text-sm"
              />
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="शीर्षक (हिंदी)"
                value={item.titleHi}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx].titleHi = e.target.value;
                  setItems(newItems);
                }}
                className="w-full px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl focus:border-current outline-none transition-all font-bold text-sm"
              />
              <textarea
                placeholder="विवरण (हिंदी)"
                value={item.descHi}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx].descHi = e.target.value;
                  setItems(newItems);
                }}
                className="w-full h-24 px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl focus:border-current outline-none transition-all font-bold resize-none text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDiseases;
