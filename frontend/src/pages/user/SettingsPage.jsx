import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';
import { translations } from '../../data/translations';
import { ChangePasswordModal, ForgotPasswordModal } from '../../components/PasswordModals';
import { 
  Settings, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  LogOut, 
  Trash2, 
  Shield, 
  ChevronRight,
  ArrowRight,
  Zap,
  X,
  AlertTriangle
} from 'lucide-react';

const SettingsPage = ({ isDark, language, setLanguage }) => {
  const { user, logout, updateUser } = useAuth();
  const { setIsDark } = useTheme();
  const { username } = useParams();
  const navigate = useNavigate();
  const t = translations[language];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success(t.logoutSuccess || 'Logged out successfully');
    navigate('/', { replace: true });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/user/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        logout();
        toast.success(t.accountDeleted || 'Account deleted successfully');
        navigate('/', { replace: true });
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error) {
      toast.error('Error deleting account');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const SettingSection = ({ title, children, icon: Icon }) => (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-sm animate-fade-up">
      <div className="px-8 py-5 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-3">
        {Icon && <Icon className="text-[var(--accent)]" size={18} />}
        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">{title}</h3>
      </div>
      <div className="p-8 space-y-6">
        {children}
      </div>
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-[var(--text)]">{label}</h4>
        {description && <p className="text-xs text-[var(--muted)] font-medium mt-1 leading-relaxed max-w-sm">{description}</p>}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-12 pb-20 px-4 md:px-8 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
                <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
              </div>
              <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
            </button>
            <h1 className="text-3xl font-black text-[var(--text)] tracking-tight flex items-center gap-3">
              <Settings className="text-[var(--accent)]" />
              {t.settings}
            </h1>
          </div>
          <div className="hidden sm:block">
             <div className="px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest">
                {user?.membership || 'Free'} Member
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Profile Quick Link */}
          <div 
            onClick={() => navigate(`/${username}/profile`)}
            className="p-8 rounded-[2.5rem] bg-gradient-to-r from-[var(--accent)] to-emerald-600 text-white shadow-xl flex items-center justify-between cursor-pointer group hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={user?.avatar || '/default-avatar.png'} 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  alt="Avatar"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[var(--accent)] rounded-lg flex items-center justify-center shadow-lg">
                  <User size={16} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black">{user?.name}</h2>
                <p className="opacity-80 font-bold text-sm tracking-wide">@{user?.username}</p>
              </div>
            </div>
            <ChevronRight className="opacity-50 group-hover:translate-x-1 transition-transform" />
          </div>

          <SettingSection title={t.appSettings} icon={Zap}>
            <SettingRow 
              label={t.languageLabel} 
              description="Choose your preferred language for the interface."
            >
              <div className="flex bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--muted)]'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === 'hi' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--muted)]'}`}
                >
                  हिंदी
                </button>
              </div>
            </SettingRow>

            <SettingRow 
              label={t.toggleTheme} 
              description="Switch between light and dark modes for better visibility."
            >
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-3 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-[var(--text)] font-bold hover:border-[var(--accent)] transition-all shadow-sm"
              >
                {isDark ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} className="text-indigo-400" />}
                {isDark ? t.light : t.dark}
              </button>
            </SettingRow>
          </SettingSection>

          <SettingSection title={t.security} icon={Shield}>
            <SettingRow 
              label={t.accountInformation} 
              description="Manage your password and security questions."
            >
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="text-[var(--accent)] font-bold text-sm flex items-center gap-2 hover:underline"
                >
                  {t.changePassword} <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[var(--muted)] font-bold text-xs flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
                >
                  {t.forgotPassword || 'Forgot Password?'}
                </button>
              </div>
            </SettingRow>
            
            <SettingRow 
              label={t.logout} 
              description="Safely exit your current session on this device."
            >
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
              >
                {t.logout}
              </button>
            </SettingRow>
          </SettingSection>

          <SettingSection title={t.dangerousZone} icon={AlertTriangle}>
             <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h4 className="text-red-500 font-black mb-1 text-lg">{t.deleteAccount}</h4>
                  <p className="text-xs text-red-500/70 font-medium leading-relaxed max-w-sm">
                    {t.deleteAccountWarning}
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                >
                  {t.deleteAccount}
                </button>
             </div>
          </SettingSection>

        </div>

        <p className="mt-16 text-center text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-30">
          FarmLens Version 3.1.2 • AI Core 2.0
        </p>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[var(--card)] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--border)] animate-fade-up">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <Trash2 size={24} />
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:rotate-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h2 className="text-2xl font-black mb-3 text-[var(--text)]">{t.deleteAccount}</h2>
              <p className="text-[var(--muted)] font-medium text-sm leading-relaxed mb-8">
                {t.deleteAccountWarning}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                >
                  {isDeleting ? <div className="animate-spin w-5 h-5 border-b-2 border-white rounded-full"></div> : t.confirmDelete}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-[var(--surface)] text-[var(--text)] rounded-2xl font-black border border-[var(--border)] hover:bg-[var(--border)]/20 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          language={language}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

      {showForgotPasswordModal && (
        <ForgotPasswordModal
          language={language}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}

      <style>{`
        .bg-gradient-to-r {
          background-size: 200% auto;
          animation: shine 5s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>

    </div>
  );
};

export default SettingsPage;
