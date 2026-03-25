import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { breedData } from '../../data/breedData';
import { toast } from 'sonner';
import { translations } from '../../data/translations';
import { AlertTriangle } from 'lucide-react';

function CattleInfoPage({ isDark, language }) {
  const [cattle, setCattle] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();
  const { username, cattleId } = useParams();
  const { user } = useAuth();
  const t = translations[language];
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    if (!user || user.username !== username) { navigate('/login'); return; }
    fetchCattle();
    window.scrollTo(0, 0);
  }, [user, username, cattleId]);

  const fetchCattle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const response = await fetch(`${API_BASE}/api/cattle/${cattleId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (response.ok) {
        const currentCattle = await response.json();
        setCattle(currentCattle);
        setFormData(currentCattle);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t.fetchFailed);
        navigate(`/${username}`);
      }
    } catch (error) {
      toast.error(`Failed to connect to server`);
      navigate(`/${username}`);
    } finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/cattle/${cattleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const updatedCattle = await response.json();
        setCattle(updatedCattle);
        setFormData(updatedCattle);
        setIsEditing(false);
        toast.success(t.saveSuccess);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t.saveFailed);
      }
    } catch (error) { toast.error(t.saveFailed); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeletingId(cattleId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/cattle/${cattleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success(t.deleteSuccess);
        setConfirmDelete(null);
        navigate(`/${username}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t.deleteFailed);
      }
    } catch (error) { toast.error(t.deleteFailed); }
    finally { setDeletingId(null); }
  };

  const handlePredictBreed = () => {
    localStorage.setItem('predictionContext', JSON.stringify({ fromPage: 'edit-cattle', cattleId, currentData: formData }));
    navigate('/predict');
  };

  const handlePredictDisease = () => {
    localStorage.setItem('diseasePredictionContext', JSON.stringify({ fromPage: 'edit-cattle', cattleId, currentData: formData }));
    navigate('/disease');
  };

  const breeds = Object.keys(breedData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)] font-black uppercase tracking-widest text-xs">{t.loadingCattleDetails}</p>
        </div>
      </div>
    );
  }

  if (!cattle) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
              <div className={`w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#111a14] border-white/10' : 'bg-white border-gray-200'}`}>
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-center mb-2 text-[var(--text)]">{language === 'en' ? 'Delete Cattle?' : 'मवेशी हटाएं?'}</h3>
                  <p className="text-[var(--muted)] font-medium text-center text-sm sm:text-base mb-8">{t.deleteConfirm}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                      <button
                          onClick={() => setConfirmDelete(null)}
                          className="w-full sm:flex-1 py-3 sm:py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-black hover:scale-[1.02] transition-all text-[var(--text)]"
                      >
                          {language === 'en' ? 'Cancel' : 'रद्द करें'}
                      </button>
                      <button
                          onClick={() => handleDelete()}
                          disabled={deletingId === cattleId}
                          className="w-full sm:flex-1 py-3 sm:py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                      >
                          {deletingId === cattleId ? (language === 'en' ? 'Deleting...' : 'हटाया जा रहा है...') : (language === 'en' ? 'Delete' : 'हटाएं')}
                      </button>
                  </div>
              </div>
          </div>
      )}
      <style>{`
        .info-card { animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
      `}</style>

      {/* Hero Header */}
      <div className="relative h-[45vh] lg:h-[55vh] w-full overflow-hidden">
        <img
          src={formData.image || '/default-cattle.jpg'}
          alt={cattle.name}
          className="w-full h-full object-cover scale-105 blur-sm opacity-30 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-20">
          <div className="relative group animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent)] to-emerald-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-[3rem] overflow-hidden border-8 border-[var(--card)] shadow-2xl">
              <img src={formData.image || '/default-cattle.jpg'} alt={cattle.name} className="w-full h-full object-cover" />
              {isEditing && (
                <label htmlFor="image-upload" className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fa-solid fa-camera text-3xl mb-2"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.changePhoto || 'Change'}</span>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Quick Actions Float */}
            {!isEditing && (
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                <button onClick={() => setIsEditing(true)} className="w-12 h-12 bg-blue-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                  <i className="fa-solid fa-pen-nib"></i>
                </button>
                <button onClick={() => setConfirmDelete(cattleId)} className="w-12 h-12 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-4xl lg:text-5xl font-black text-center bg-transparent border-b-4 border-[var(--accent)] outline-none text-[var(--text)] mb-2 px-4"
              />
            ) : (
              <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-[var(--text)] drop-shadow-sm">
                {cattle.name}
              </h1>
            )}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-black uppercase tracking-widest border border-[var(--accent)]/20">
                {cattle.breed}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 shadow-lg ${cattle.healthStatus === 'Excellent' ? 'bg-green-500 text-white' :
                  cattle.healthStatus === 'Good' ? 'bg-blue-500 text-white' :
                    cattle.healthStatus === 'Fair' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                }`}>
                {cattle.healthStatus || 'Good'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Info Column */}
          <div className="flex-[2] space-y-8">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-10 shadow-2xl info-card">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--border)]">
                <h3 className="text-xl font-black text-[var(--text)] uppercase tracking-tight flex items-center gap-3">
                  <i className="fa-solid fa-clipboard-list text-[var(--accent)]"></i>
                  {t.vitalStatistics || 'Vital Statistics'}
                </h3>
                {isEditing && (
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                      {saving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check mr-2"></i>}
                      {t.saveChanges}
                    </button>
                    <button onClick={() => { setIsEditing(false); setFormData(cattle); }} className="px-6 py-2.5 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl font-black text-xs uppercase tracking-widest">
                      {t.cancel}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="input-group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block px-2">{t.cattleId}</label>
                    {isEditing ? (
                      <input name="cattleId" value={formData.cattleId} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)]" />
                    ) : (
                      <div className="px-6 py-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] font-bold text-[var(--text)] text-lg">#{cattle.cattleId}</div>
                    )}
                  </div>

                  <div className="input-group">
                    <div className="flex justify-between items-center mb-2 px-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">{t.breed}</label>
                      {isEditing && (
                        <button type="button" onClick={handlePredictBreed} className="cursor-pointer text-[10px] font-black text-[var(--accent)] hover:underline uppercase">Identify</button>
                      )}
                    </div>
                    {isEditing ? (
                      <select name="breed" value={formData.breed} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)] appearance-none">
                        {breeds.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    ) : (
                      <div className="px-6 py-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] font-bold text-[var(--text)] text-lg">{cattle.breed}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block px-2">{t.age} ({t.years})</label>
                      {isEditing ? (
                        <input name="age" type="number" step="0.1" value={formData.age} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)]" />
                      ) : (
                        <div className="px-6 py-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] font-bold text-[var(--text)] text-lg">{cattle.age}</div>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block px-2">{t.weight} (Kg)</label>
                      {isEditing ? (
                        <input name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)]" />
                      ) : (
                        <div className="px-6 py-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] font-bold text-[var(--text)] text-lg">{cattle.weight}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="input-group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block px-2">{t.gender}</label>
                    {isEditing ? (
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)] appearance-none">
                        <option value="Bull">{t.bull}</option>
                        <option value="Cow">{t.cow}</option>
                        <option value="Heifer">{t.heifer}</option>
                        <option value="Calf">{t.calf}</option>
                      </select>
                    ) : (
                      <div className="px-6 py-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] font-bold text-[var(--text)] text-lg">
                        <i className={`fa-solid ${cattle.gender === 'Cow' ? 'fa-venus' : 'fa-mars'} mr-3 opacity-30`}></i>
                        {cattle.gender}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block px-2">{t.milkProductionDay} (L/day)</label>
                    {isEditing ? (
                      <input name="milkProduction" type="number" step="0.1" value={formData.milkProduction} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)]" />
                    ) : (
                      <div className="px-6 py-4 bg-[var(--accent)]/5 rounded-2xl border border-[var(--accent)]/20 font-black text-[var(--accent)] text-2xl flex items-center gap-4">
                        <i className="fa-solid fa-bucket opacity-30"></i>
                        {cattle.milkProduction || 0}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block px-2">{t.healthStatus}</label>
                    {isEditing ? (
                      <select name="healthStatus" value={formData.healthStatus} onChange={handleChange} className="w-full px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none font-bold text-[var(--text)] appearance-none">
                        <option value="Excellent">{t.excellent}</option>
                        <option value="Good">{t.good}</option>
                        <option value="Fair">{t.fair}</option>
                        <option value="Poor">{t.poor}</option>
                      </select>
                    ) : (
                      <div className="px-6 py-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] font-bold text-[var(--text)] text-lg">{cattle.healthStatus || 'Good'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-10 shadow-2xl info-card delay-1">
              <div className="flex items-center justify-between mb-8 pb-4">
                <h3 className="text-xl font-black text-[var(--text)] uppercase tracking-tight flex items-center gap-3">
                  <i className="fa-solid fa-shield-virus text-red-500"></i>
                  {t.healthAndDisease || 'Health Monitoring'}
                </h3>
                {!isEditing && (
                  <button onClick={handlePredictDisease} className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    <i className="fa-solid fa-stethoscope mr-2"></i> {t.screenNow || 'Screen for disease'}
                  </button>
                )}
              </div>

              <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${cattle.disease && cattle.disease !== 'None'
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-green-500/5 border-green-500/20'
                }`}>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] px-2">{t.activeDiagnosis || 'Active Diagnosis'}</label>
                    {isEditing && (
                        <button type="button" onClick={handlePredictDisease} className="cursor-pointer text-[10px] font-black text-red-500 hover:underline uppercase">Screen For Disease</button>
                      )}
                    </div>
                    <div className="relative">
                      <i className="fa-solid fa-virus-covid absolute left-6 top-1/2 -translate-y-1/2 text-red-500 opacity-50"></i>
                      <input name="disease" value={formData.disease} onChange={handleChange} className="w-full pl-16 pr-6 py-5 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl focus:border-red-500 outline-none font-bold text-[var(--text)]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl ${cattle.disease && cattle.disease !== 'None' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      }`}>
                      <i className={`fa-solid ${cattle.disease && cattle.disease !== 'None' ? 'fa-bacteria' : 'fa-house-medical-circle-check'}`}></i>
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black ${cattle.disease && cattle.disease !== 'None' ? 'text-red-500' : 'text-green-500'}`}>
                        {cattle.disease && cattle.disease !== 'None' ? cattle.disease : (language === 'en' ? 'Healthy Condition' : 'निरोगी स्थिति')}
                      </h4>
                      <p className="text-[var(--muted)] font-medium mt-1">
                        {cattle.disease && cattle.disease !== 'None'
                          ? (language === 'en' ? 'Monitoring recommended. Consult a veterinarian.' : 'निगरानी की आवश्यकता है। पशु चिकित्सक से संपर्क करें।')
                          : (language === 'en' ? 'No active diseases detected in recent screenings.' : 'हाल की जांच में कोई सक्रिय बीमारी नहीं मिली।')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-96 space-y-8">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-8 shadow-2xl info-card delay-2">
              <h4 className="font-black text-[var(--text)] mb-6 uppercase tracking-widest text-xs opacity-40">{t.history || 'System Logs'}</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted)] shrink-0">
                    <i className="fa-solid fa-calendar-plus"></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{t.registrationDate || 'Registered On'}</div>
                    <div className="font-bold text-[var(--text)] text-sm">{new Date(cattle.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { dateStyle: 'long' })}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted)] shrink-0">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{t.lastUpdate || 'Last Updated'}</div>
                    <div className="font-bold text-[var(--text)] text-sm">{new Date(cattle.updatedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { dateStyle: 'long' })}</div>
                  </div>
                </div>
              </div>

              
            </div>

            <button
              onClick={() => navigate(`/${username}/allcattles`)}
              className="w-full py-5 bg-[var(--card)] -[var(--text)] border border-[var(--border)] rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-[var(--surface)] transition-all flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-layer-group"></i>
              {t.allCattles}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CattleInfoPage;