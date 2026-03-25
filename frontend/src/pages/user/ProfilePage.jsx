import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { translations } from '../../data/translations';

function ProfilePage({ isDark, language }) {
  const [formData, setFormData] = useState({
    name: '', mobile: '', address: '', avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();
  const { user, updateUser } = useAuth();
  const t = translations[language];
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user || user.username !== username) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      mobile: user.mobile || '',
      address: user.address || '',
      avatar: user.avatar || ''
    });
    setLoading(false);
    window.scrollTo(0, 0);
  }, [user, username]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(t.profileUpdated);
      } else { toast.error(t.profileUpdateFailed); }
    } catch (error) { toast.error(t.profileUpdateFailed); }
    finally { setSaving(false); }
  };

  const updateAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/user/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ avatar: formData.avatar })
      });
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success(t.avatarUpdated);
      } else { toast.error(t.avatarUpdateFailed); }
    } catch (error) { toast.error(t.avatarUpdateFailed); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)] font-black uppercase tracking-widest text-xs">{t.loadingProfile}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      <style>{`
        .profile-card {
          animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .input-group:focus-within label {
          color: var(--accent);
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
            <span className="font-black text-xs uppercase tracking-widest">{t.back}</span>
          </button>
          <h2 className="text-xl font-black tracking-tight text-[var(--text)]">{t.accountSettings || 'Account Settings'}</h2>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] overflow-hidden shadow-2xl profile-card">
          <div className="h-40 bg-gradient-to-r from-emerald-500 to-[var(--accent)] relative">
            <div className="absolute inset-0 bg-black/10 opacity-50"></div>
          </div>
          
          <div className="px-10 pb-12 -mt-20 relative">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group">
                <div className="absolute -inset-2 bg-white rounded-full blur opacity-40"></div>
                <img
                  src={formData.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-8 border-[var(--card)] shadow-2xl relative z-10"
                />
                <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center border-4 border-[var(--card)] shadow-xl z-20 cursor-pointer hover:scale-110 active:scale-95 transition-all">
                  <i className="fa-solid fa-pen text-sm"></i>
                </label>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              
              {formData.avatar !== user?.avatar && (
                <button
                  type="button"
                  onClick={updateAvatar}
                  className="mt-6 px-6 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all shadow-lg shadow-green-600/10"
                >
                  {t.saveNewAvatar || 'Save New Avatar'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.fullName}</label>
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <div className="max-sm:hidden"><i className="fa-solid fa-user text-[var(--muted)] opacity-30"></i></div>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                    />
                  </div>
                </div>

                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.mobileNumber}</label>
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                    <div className="max-sm:hidden"><i className="fa-solid fa-phone text-[var(--muted)] opacity-30"></i></div>
                    <input
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)]"
                    />
                  </div>
                </div>
              </div>

              <div className="input-group flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] pl-4">{t.address}</label>
                <div className="relative flex items-start gap-3 px-6 py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all">
                  <div className="max-sm:hidden"><i className="fa-solid fa-location-dot text-[var(--muted)] opacity-30 mt-1"></i></div>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)] resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-[var(--surface)] rounded-[2rem] border border-[var(--border)] flex items-center justify-between opacity-70">
                <div className="flex items-center gap-4">
                  <div className="max-sm:hidden">
                    <div className="w-12 h-12 bg-[var(--card)] rounded-xl flex items-center justify-center text-[var(--muted)]">
                      <i className="fa-solid fa-at"></i>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{t.username}</div>
                    <div className="font-bold text-[var(--text)]">@{user?.username}</div>
                  </div>
                </div>
                <div className="max-sm:hidden">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] bg-[var(--border)]/30 px-3 py-1 rounded-full">
                  {t.fixed || 'Locked'}
                </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-5 bg-[var(--accent)] text-white rounded-2xl font-black text-lg shadow-2xl shadow-green-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-circle-check"></i>}
                  {saving ? t.saving : t.saveProfile}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/${username}`)}
                  className="flex-1 py-5 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl font-black text-lg hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-40 px-10 leading-relaxed">
          {t.profileDisclaimer || 'Your information is protected and only used for service personalization. FarmLens does not share livestock data with third parties.'}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;