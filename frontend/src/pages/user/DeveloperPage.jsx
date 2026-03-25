import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, CheckCircle, Shield, Activity, BarChart3, AlertCircle, Info, ExternalLink, Book, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { translations } from '../../data/translations';

const DeveloperPage = ({ isDark, language }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = translations[language];
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [keys, setKeys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState(null);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [keysRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/api-keys`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/api/api-keys/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const keysData = await keysRes.json();
      const statsData = await statsRes.json();

      setKeys(keysData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load developer data');
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/api-keys/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newKeyName })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedKey(data.apiKey);
        setShowKeyModal(true);
        setNewKeyName('');
        fetchData();
        toast.success('API Key generated successfully');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate key');
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeKey = (id) => {
    setKeyToRevoke(id);
    setShowRevokeModal(true);
  };

  const confirmRevoke = async () => {
    if (!keyToRevoke) return;
    setRevoking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/api-keys/${keyToRevoke}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success(t.keyRevokedSuccessfully || 'Key revoked successfully');
        setShowRevokeModal(false);
        setKeyToRevoke(null);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to revoke key');
    } finally {
      setRevoking(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-12 pb-16 px-4 md:px-8 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
            <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
          </div>
          <span className="text-sm uppercase tracking-widest">{t?.back || 'Back'}</span>
        </button>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 text-[var(--accent)] font-bold mb-2">
              <Activity size={20} />
              <span className="uppercase tracking-[0.2em] text-sm">{t.developerConsole}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight">
              {t.apiManagement}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/membership')}
              className="px-6 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-bold hover:border-[var(--accent)] transition-all flex items-center gap-2"
            >
              <Shield size={18} />
              Change Plan
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
          <div className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[var(--muted)] font-bold text-sm uppercase tracking-wider mb-2">{t.currentPlan}</p>
              <h3 className="text-3xl font-black text-[var(--accent)] mb-2">{stats?.membership}</h3>
              <p className="text-xs font-semibold text-[var(--muted)] opacity-70">
                {stats?.membership === 'Free' ? t.basicDiagnostic : t.unlimitedDiagnostic}
              </p>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[var(--muted)] font-bold text-sm uppercase tracking-wider mb-2">{t.aiRecognitionUsage}</p>
              <h3 className="text-3xl font-black text-blue-500 mb-2">{stats?.aiUsage}</h3>
              <div className="w-full h-1.5 bg-blue-500/10 rounded-full mt-4">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min((stats?.aiUsage / (stats?.membership === 'Free' ? 10 : 100)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[var(--muted)] font-bold text-sm uppercase tracking-wider mb-2">{t.symptomDiagnosticUsage}</p>
              <h3 className="text-3xl font-black text-purple-500 mb-2">{stats?.symptomUsage}</h3>
              <div className="w-full h-1.5 bg-purple-500/10 rounded-full mt-4">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${Math.min((stats?.symptomUsage / (stats?.membership === 'Free' ? 50 : 500)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Key Management Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-xl">
              <div className="flex max-sm:block items-center justify-between mb-5">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <Key className="text-[var(--accent)]" /> 
                  {t.yourApiKeys}
                </h3>
                <div className="flex gap-2 max-sm:mt-2">
                  <input 
                    type="text" 
                    placeholder={t.keyNamePlaceholder}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold focus:border-[var(--accent)] outline-none"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <button 
                    onClick={generateKey}
                    disabled={isGenerating}
                    className="p-2.5 rounded-xl bg-[var(--accent)] text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                  >
                    {isGenerating ? <div className="animate-spin w-5 h-5 border-b-2 border-white rounded-full"></div> : <Plus size={22} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {keys.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                      <Key size={32} />
                    </div>
                    <p className="text-[var(--muted)] font-bold italic">{t.noActiveApiKeysFound}</p>
                  </div>
                ) : (
                  keys.map((key) => (
                    <div key={key._id} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                      <div>
                        <h4 className="font-extrabold text-[var(--text)] mb-1">{key.name}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                          <code className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-[var(--accent)]">{key.keyHint}</code>
                          <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                          {key.lastUsed && <span>Used: {new Date(key.lastUsed).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => revokeKey(key._id)}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        title={t.revokeKey}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Docs Area */}
            <div className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--accent)]"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">{t.quickStartGuide}</h3>
                <button 
                  onClick={() => navigate('/docs?tab=api')}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm group"
                >
                  <div className="max-sm:hidden"><Book size={14} /></div>
                  {t.fullDocumentation} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm mb-2 text-[var(--accent)] uppercase tracking-wider">{t.authentication}</h4>
                  <p className="text-sm text-[var(--muted)] mb-3">{t.includeApiKeyInHeader}</p>
                  <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] font-mono text-[10px] sm:text-xs">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-2 text-[var(--accent)] uppercase tracking-wider">{t.availableEndpoints}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black px-2 py-0.5 bg-green-500 text-white rounded uppercase">POST</span>
                        <code className="text-[10px] font-bold">/v1/predict/breed</code>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] font-medium">{t.identifyCattleBreedsFromImages}</p>
                    </div>
                    <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black px-2 py-0.5 bg-green-500 text-white rounded uppercase">POST</span>
                        <code className="text-[10px] font-bold">/v1/predict/symptoms</code>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] font-medium">{t.getHealthAnalysisFromSymptoms}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)] to-emerald-600 text-white shadow-2xl">
              <BarChart3 className="mb-6 opacity-30" size={48} />
              <h3 className="text-2xl font-black mb-4 tracking-tight">{t.enterpriseAccess}</h3>
              <p className="text-sm font-medium opacity-90 leading-relaxed mb-8">
                {t.integrateFarmLensAdvancedAi}
              </p>
              <button 
                onClick={() => navigate('/membership')}
                className="w-full py-4 bg-white text-[var(--accent)] rounded-2xl font-black shadow-xl hover:scale-105 transition-all"
              >
                Go Unlimited
              </button>
            </div>

            <div className="p-6 rounded-[2rem] bg-[var(--card)] border border-[var(--border)]">
              <h4 className="font-extrabold flex items-center gap-2 mb-4">
                <Shield className="text-[var(--accent)]" size={18} />
                {t.securityNotice}
              </h4>
              <ul className="space-y-3 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider leading-relaxed">
                <li className="flex gap-2">
                  <AlertCircle size={14} className="shrink-0 text-orange-500" />
                  {t.neverShareApiKeys}
                </li>
                <li className="flex gap-2">
                  <AlertCircle size={14} className="shrink-0 text-orange-500" />
                  {t.regularlyRotateKeys}
                </li>
                <li className="flex gap-2">
                  <AlertCircle size={14} className="shrink-0 text-orange-500" />
                  {t.monitorUsagePeriodically}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Reveal Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[var(--card)] w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-[var(--border)] animate-fade-up">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4">{t.yourApiKeyModalTitle}</h2>
              <p className="text-[var(--muted)] font-bold mb-8">
                {t.copyThisKeyNow}
              </p>
              
              <div className="relative group mb-8">
                <div className="w-full p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-mono text-sm break-all text-[var(--accent)]">
                  {generatedKey}
                </div>
                <button 
                  onClick={() => copyToClipboard(generatedKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-all"
                >
                  {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>

              <button 
                onClick={() => setShowKeyModal(false)}
                className="w-full py-4 bg-[var(--text)] text-[var(--bg)] rounded-2xl font-black"
              >
                {t.iveSavedIt}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Revoke API Key Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[var(--card)] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--border)] animate-fade-up">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <Trash2 size={24} />
                </div>
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:rotate-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h2 className="text-2xl font-black mb-3 text-[var(--text)]">{t.revokeKeyConfirmTitle}</h2>
              <p className="text-[var(--muted)] font-medium text-sm leading-relaxed mb-8">
                {t.revokeKeyConfirmMessage}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={revoking}
                  onClick={confirmRevoke}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                >
                  {revoking ? <div className="animate-spin w-5 h-5 border-b-2 border-white rounded-full"></div> : t.confirmRevoke}
                </button>
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="w-full py-4 bg-[var(--surface)] text-[var(--text)] rounded-2xl font-black border border-[var(--border)] hover:bg-[var(--border)]/20 transition-all"
                >
                  {t.cancelRevoke}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPage;
