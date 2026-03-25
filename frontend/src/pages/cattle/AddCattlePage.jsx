import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { breedData } from '../../data/breedData';
import { toast } from 'sonner';
import { translations } from '../../data/translations';

function AddCattlePage({ isDark, language, prediction, diseasePrediction, skinPrediction, globalImage }) {
  const [formData, setFormData] = useState({
    name: '',
    cattleId: '',
    breed: prediction || '',
    age: '',
    weight: '',
    gender: '',
    milkProduction: '',
    disease: skinPrediction || diseasePrediction || 'None',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useAuth();
  const t = translations[language];
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    if (!user || user.username !== username) { navigate('/login'); }
  }, [user, username, navigate]);

  // Sync global predictions to form if they change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      breed: prev.breed || prediction || '',
      disease: prev.disease === 'None' || !prev.disease ? (skinPrediction || diseasePrediction || 'None') : prev.disease
    }));
  }, [prediction, diseasePrediction, skinPrediction]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const submitData = { ...formData, age: parseFloat(formData.age), weight: parseFloat(formData.weight), milkProduction: formData.milkProduction ? parseFloat(formData.milkProduction) : 0 };
      const response = await fetch(`${API_BASE}/api/cattle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(submitData)
      });
      if (response.ok) {
        toast.success(t.saveSuccess);
        navigate(`/${username}`);
      } else {
        const data = await response.json();
        toast.error(data.error || t.failedToAddCattle);
      }
    } catch (error) { toast.error(t.networkError); }
    finally { setLoading(false); }
  };

  const breeds = Object.keys(breedData);

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      <style>{`
        .form-card { animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .input-group:focus-within label { color: var(--accent); }
        select option {
          background-color: var(--card);
          color: var(--text);
          padding: 12px;
          font-family: inherit;
        }
        /* Style for the select element itself to ensure consistency */
        select {
          cursor: pointer;
          background: transparent;
        }
        /* Custom styling for the select dropdown container */
        .custom-select-container {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-select-container:hover {
          border-color: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
        }
        .custom-select-container:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-alpha, rgba(22, 163, 74, 0.1));
        }
        .custom-select-container i {
          transition: all 0.3s ease;
        }
        .custom-select-container:hover i {
          color: var(--accent);
          opacity: 0.6;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
              <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
            </div>
            <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">{t.addCattle}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">{t.newRegistration || 'New Registration'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card space-y-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] overflow-hidden shadow-2xl p-10 md:p-16">

            {/* Image Upload Section */}
            <div className="flex flex-col items-center mb-16">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent)] to-emerald-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 border-[var(--card)] shadow-2xl bg-[var(--surface)]">
                  {formData.image ? (
                    <img src={formData.image} alt="Cattle" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[var(--muted)] opacity-30 gap-3">
                      <i className="fa-solid fa-cow text-5xl"></i>
                      <span className="text-[10px] font-black uppercase tracking-widest">{t.noPhoto || 'No Photo'}</span>
                    </div>
                  )}
                  <label htmlFor="image-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                    <div className="flex flex-col items-center gap-2">
                      <i className="fa-solid fa-camera-viewfinder text-2xl"></i>
                      <span className="text-[10px] font-black uppercase tracking-widest">{t.changePhoto || 'Change'}</span>
                    </div>
                  </label>
                </div>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-8">
                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.cattleName} *</label>
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <i className="fa-solid fa-tag text-[var(--muted)] opacity-30"></i>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Ganga"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                    />
                  </div>
                </div>

                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.cattleId} *</label>
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <i className="fa-solid fa-hashtag text-[var(--muted)] opacity-30"></i>
                    <input
                      name="cattleId"
                      type="text"
                      required
                      placeholder="e.g. C-10293"
                      value={formData.cattleId}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                    />
                  </div>
                </div>

                <div className="input-group flex flex-col gap-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{t.breed} *</label>
                    <button type="button" onClick={() => navigate('/predict')} className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:underline">
                      <i className="fa-solid fa-wand-magic-sparkles mr-1"></i> {t.identify || 'Predict'}
                    </button>
                  </div>
                  <div className="custom-select-container relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <i className="fa-solid fa-dna text-[var(--muted)] opacity-30"></i>
                    <select
                      name="breed"
                      required
                      value={formData.breed}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)] appearance-none cursor-pointer"
                    >
                      <option value="">{t.selectBreed}</option>
                      {breeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
                    </select>
                    <i className="fa-solid fa-angle-down text-[var(--muted)] opacity-30 pointer-events-none"></i>
                  </div>
                </div>
              </div>

              {/* Physical Info */}
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="input-group flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.age} ({t.years}) *</label>
                    <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                      <input
                        name="age"
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={formData.age}
                        onChange={handleChange}
                        className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                      />
                    </div>
                  </div>
                  <div className="input-group flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.weight} (Kg) *</label>
                    <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                      <input
                        name="weight"
                        type="number"
                        required
                        min="0"
                        value={formData.weight}
                        onChange={handleChange}
                        className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.gender} *</label>
                  <div className="custom-select-container relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <i className="fa-solid fa-venus-mars text-[var(--muted)] opacity-30"></i>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)] appearance-none cursor-pointer"
                    >
                      <option value="">{t.selectGender}</option>
                      <option value="Bull">{t.bull}</option>
                      <option value="Cow">{t.cow}</option>
                      <option value="Heifer">{t.heifer}</option>
                      <option value="Calf">{t.calf}</option>
                    </select>
                    <i className="fa-solid fa-angle-down text-[var(--muted)] opacity-30 pointer-events-none"></i>
                  </div>
                </div>

                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.milkProductionDay} (L/day)</label>
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <i className="fa-solid fa-bucket text-[var(--muted)] opacity-30"></i>
                    <input
                      name="milkProduction"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.milkProduction}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <div className="input-group flex flex-col gap-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{t.healthStatus} / {t.disease}</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => navigate('/disease')} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline">
                      <i className="fa-solid fa-stethoscope mr-1"></i> {t.predictDisease || 'Screen for Disease'}
                    </button>
                    <button type="button" onClick={() => navigate('/skin-disease')} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">
                      <i className="fa-solid fa-microscope mr-1"></i> {t.skinScan || 'Skin Scan'}
                    </button>
                  </div>
                </div>
                <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                  <i className="fa-solid fa-virus-slash text-[var(--muted)] opacity-30"></i>
                  <input
                    name="disease"
                    type="text"
                    placeholder={t.diseasePlaceholder || "Enter disease or 'None'"}
                    value={formData.disease}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-12">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 bg-[var(--accent)] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-green-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                {loading ? t.saving : t.saveCattle}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/${username}`)}
                className="flex-1 py-5 bg-[var(--surface)] text-[var(--text)] border-2 border-[var(--border)] rounded-[2rem] font-black text-lg hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCattlePage;