import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import { Database, Plus, Globe, Info, Image as ImageIcon, CheckCircle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import LocationPicker from '../../components/LocationPicker';

function AdminBreeds({ isDark, setIsDark }) {
  const [formData, setFormData] = useState({
    name: '',
    descEn: '',
    descHi: '',
    originEn: '',
    originHi: '',
    weightEn: '',
    weightHi: '',
    milkEn: '',
    milkHi: '',
    characteristicsEn: '',
    characteristicsHi: '',
    lat: '',
    lng: ''
  });
  const [careRequirements, setCareRequirements] = useState([
    { titleEn: '', titleHi: '', descEn: '', descHi: '' }
  ]);
  const [healthConsiderations, setHealthConsiderations] = useState([
    { titleEn: '', titleHi: '', descEn: '', descHi: '' }
  ]);
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
      name: formData.name,
      description: { en: formData.descEn, hi: formData.descHi },
      origin: { en: formData.originEn, hi: formData.originHi },
      weight: { en: formData.weightEn, hi: formData.weightHi },
      milkProduction: { en: formData.milkEn, hi: formData.milkHi },
      characteristics: {
        en: formData.characteristicsEn.split(',').map(s => s.trim()),
        hi: formData.characteristicsHi.split(',').map(s => s.trim())
      },
      careRequirements: careRequirements.map(c => ({
        title: { en: c.titleEn, hi: c.titleHi },
        description: { en: c.descEn, hi: c.descHi }
      })),
      healthConsiderations: healthConsiderations.map(c => ({
        title: { en: c.titleEn, hi: c.titleHi },
        description: { en: c.descEn, hi: c.descHi }
      })),
      lat: formData.lat ? parseFloat(formData.lat) : null,
      lng: formData.lng ? parseFloat(formData.lng) : null,
    };

    const submitFormData = new FormData();
    submitFormData.append('data', JSON.stringify(payloadObj));
    if (imageFile) {
      submitFormData.append('imageFile', imageFile);
    }

    try {
      const res = await fetch(`${API_BASE}/api/breeds`, {
        method: 'POST',
        // Omit Content-Type so browser sets boundary for multipart/form-data
        body: submitFormData
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setImageFile(null);
          setFormData({
            name: '', descEn: '', descHi: '',
            originEn: '', originHi: '', weightEn: '', weightHi: '',
            milkEn: '', milkHi: '', characteristicsEn: '', characteristicsHi: '',
            lat: '', lng: ''
          });
          setCareRequirements([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
          setHealthConsiderations([{ titleEn: '', titleHi: '', descEn: '', descHi: '' }]);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to add breed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <AdminNavbar isDark={isDark} setIsDark={setIsDark} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Breed Management</h1>
          <p className="text-[var(--muted)] font-medium text-sm sm:text-base">Expand the global cattle database</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-lg sm:shadow-2xl relative overflow-hidden">

          {success && (
            <div className="absolute inset-0 z-50 bg-[var(--card)]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-black">Breed Added Successfully!</h3>
                <p className="text-[var(--muted)] font-medium mt-2">New intelligence has been integrated.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
            {/* Primary Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">

                <label className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
                  <Plus size={16} className="text-green-500" /> Breed Name
                </label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sahiwal"
                  className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className=" flex gap-2 text-sm font-black uppercase tracking-[0.2em]">
                  <ImageIcon size={16} className="text-blue-500" /> Breed Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            {/* Bilingual Content Grids */}
            <div className="space-y-6 sm:space-y-8">
              <SectionHeader icon={<Globe size={18} />} title="Description & Origin" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <textarea
                    value={formData.descEn}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    onBlur={(e) => { if (!formData.descHi) handleAutoTranslate(e.target.value, 'descHi'); }}
                    placeholder="English Description"
                    className="w-full h-28 sm:h-32 px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm sm:text-base"
                  ></textarea>
                  <input
                    type="text"
                    value={formData.originEn}
                    onChange={(e) => setFormData({ ...formData, originEn: e.target.value })}
                    onBlur={(e) => { if (!formData.originHi) handleAutoTranslate(e.target.value, 'originHi'); }}
                    placeholder="Origin (EN)"
                    className="w-full px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-4 mt-6 md:mt-0">
                  <textarea
                    value={formData.descHi}
                    onChange={(e) => setFormData({ ...formData, descHi: e.target.value })}
                    placeholder="विवरण (हिंदी म) "
                    className="w-full h-28 sm:h-32 px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm sm:text-base"
                  ></textarea>
                  <input
                    type="text"
                    value={formData.originHi}
                    onChange={(e) => setFormData({ ...formData, originHi: e.target.value })}
                    placeholder="मूल (हिंदी म)"
                    className="w-full px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm sm:text-base"
                  />
                </div>

              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <SectionHeader icon={<Info size={18} />} title="Specifications (Weight & Milk)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.weightEn}
                    onChange={(e) => setFormData({ ...formData, weightEn: e.target.value })}
                    onBlur={(e) => { if (!formData.weightHi) handleAutoTranslate(e.target.value, 'weightHi'); }}
                    placeholder="Weight Range (EN)"
                    className="w-full px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    value={formData.milkEn}
                    onChange={(e) => setFormData({ ...formData, milkEn: e.target.value })}
                    onBlur={(e) => { if (!formData.milkHi) handleAutoTranslate(e.target.value, 'milkHi'); }}
                    placeholder="Milk Production (EN)"
                    className="w-full px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-4 mt-2 md:mt-0">
                  <input
                    type="text"
                    value={formData.weightHi}
                    onChange={(e) => setFormData({ ...formData, weightHi: e.target.value })}
                    placeholder="वजन सीमा (हिंदी म)"
                    className="w-full px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    value={formData.milkHi}
                    onChange={(e) => setFormData({ ...formData, milkHi: e.target.value })}
                    placeholder="दूध उत्पादन (हिंदी म)"
                    className="w-full px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <SectionHeader icon={<CheckCircle size={18} />} title="Characteristics" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <textarea
                  value={formData.characteristicsEn}
                  onChange={(e) => setFormData({ ...formData, characteristicsEn: e.target.value })}
                  onBlur={(e) => { if (!formData.characteristicsHi) handleAutoTranslate(e.target.value, 'characteristicsHi'); }}
                  placeholder="Feature 1, Feature 2, Feature 3 (EN)"
                  className="w-full h-24 px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm sm:text-base"
                ></textarea>
                <textarea
                  value={formData.characteristicsHi}
                  onChange={(e) => setFormData({ ...formData, characteristicsHi: e.target.value })}
                  placeholder="विशेषता 1, विशेषता 2, विशेषता 3 (HI)"
                  className="w-full h-24 px-5 sm:px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm sm:text-base"
                ></textarea>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between border-b-2 border-green-500/10 pb-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-green-500"><Info size={18} /></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em]">Care Requirements</h3>
                </div>
                {careRequirements.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setCareRequirements([...careRequirements, { titleEn: '', titleHi: '', descEn: '', descHi: '' }])}
                    className="flex items-center gap-1 text-sm text-[var(--accent)] font-bold hover:underline"
                  >
                    <Plus size={16} /> Add
                  </button>
                )}
              </div>
              
              {careRequirements.map((care, idx) => (
                <div key={idx} className="space-y-4 p-5 sm:p-6 border border-[var(--border)] rounded-[2rem] bg-[var(--surface)] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-[var(--muted)]">Requirement {idx + 1}</span>
                    {careRequirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCareRequirements(careRequirements.filter((_, i) => i !== idx))}
                        className="text-red-500 text-sm font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <input
                      type="text"
                      placeholder="Title (EN)"
                      value={care.titleEn}
                      onChange={e => {
                        const newCare = [...careRequirements];
                        newCare[idx].titleEn = e.target.value;
                        setCareRequirements(newCare);
                      }}
                      onBlur={e => handleArrayTranslate(e.target.value, idx, 'titleHi', setCareRequirements)}
                      className="w-full px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm"
                    />
                    <input
                      type="text"
                      placeholder="शीर्षक (HI)"
                      value={care.titleHi}
                      onChange={e => {
                        const newCare = [...careRequirements];
                        newCare[idx].titleHi = e.target.value;
                        setCareRequirements(newCare);
                      }}
                      className="w-full px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm"
                    />
                    <textarea
                      placeholder="Description (EN)"
                      value={care.descEn}
                      onChange={e => {
                        const newCare = [...careRequirements];
                        newCare[idx].descEn = e.target.value;
                        setCareRequirements(newCare);
                      }}
                      onBlur={e => handleArrayTranslate(e.target.value, idx, 'descHi', setCareRequirements)}
                      className="w-full h-24 px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm"
                    />
                    <textarea
                      placeholder="विवरण (HI)"
                      value={care.descHi}
                      onChange={e => {
                        const newCare = [...careRequirements];
                        newCare[idx].descHi = e.target.value;
                        setCareRequirements(newCare);
                      }}
                      className="w-full h-24 px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between border-b-2 border-red-500/10 pb-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-red-500"><Info size={18} /></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em]">Health Considerations</h3>
                </div>
                {healthConsiderations.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setHealthConsiderations([...healthConsiderations, { titleEn: '', titleHi: '', descEn: '', descHi: '' }])}
                    className="flex items-center gap-1 text-sm text-[var(--accent)] font-bold hover:underline"
                  >
                    <Plus size={16} /> Add
                  </button>
                )}
              </div>
              
              {healthConsiderations.map((health, idx) => (
                <div key={idx} className="space-y-4 p-5 sm:p-6 border border-[var(--border)] rounded-[2rem] bg-[var(--surface)] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-[var(--muted)]">Consideration {idx + 1}</span>
                    {healthConsiderations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setHealthConsiderations(healthConsiderations.filter((_, i) => i !== idx))}
                        className="text-red-500 text-sm font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <input
                      type="text"
                      placeholder="Title (EN)"
                      value={health.titleEn}
                      onChange={e => {
                        const newHealth = [...healthConsiderations];
                        newHealth[idx].titleEn = e.target.value;
                        setHealthConsiderations(newHealth);
                      }}
                      onBlur={e => handleArrayTranslate(e.target.value, idx, 'titleHi', setHealthConsiderations)}
                      className="w-full px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm"
                    />
                    <input
                      type="text"
                      placeholder="शीर्षक (HI)"
                      value={health.titleHi}
                      onChange={e => {
                        const newHealth = [...healthConsiderations];
                        newHealth[idx].titleHi = e.target.value;
                        setHealthConsiderations(newHealth);
                      }}
                      className="w-full px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold text-sm"
                    />
                    <textarea
                      placeholder="Brief Description (EN)"
                      value={health.descEn}
                      onChange={e => {
                        const newHealth = [...healthConsiderations];
                        newHealth[idx].descEn = e.target.value;
                        setHealthConsiderations(newHealth);
                      }}
                      onBlur={e => handleArrayTranslate(e.target.value, idx, 'descHi', setHealthConsiderations)}
                      className="w-full h-24 px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm"
                    />
                    <textarea
                      placeholder="संक्षिप्त विवरण (HI)"
                      value={health.descHi}
                      onChange={e => {
                        const newHealth = [...healthConsiderations];
                        newHealth[idx].descHi = e.target.value;
                        setHealthConsiderations(newHealth);
                      }}
                      className="w-full h-24 px-5 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold resize-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Map Coordinates Picker */}
            <div className="space-y-6 sm:space-y-8">
              <SectionHeader icon={<Globe size={18} />} title="Pin on World Map" />
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                onChange={(lat, lng) => setFormData(prev => ({ ...prev, lat: lat ?? '', lng: lng ?? '' }))}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 sm:py-6 bg-green-500 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl sm:shadow-2xl shadow-green-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing Data...' : 'Integrate New Breed'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b-2 border-green-500/10 mb-6">
      <div className="text-green-500">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h3>
    </div>
  );
}

export default AdminBreeds;
