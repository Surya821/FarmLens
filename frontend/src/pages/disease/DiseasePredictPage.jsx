import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { useAuth } from '../../context/AuthContext';
import { getSymptomName, getDiseaseName, symptomTranslations } from '../../data/symptoms';

function DiseasePredictPage({ isDark, language, diseasePrediction, setDiseasePrediction }) {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSymptoms, setIsFetchingSymptoms] = useState(true);
  const [symptomSearchQuery, setSymptomSearchQuery] = useState('');
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, incrementUsage, getUsageLimit, triggerLimitModal } = useAuth();
  const t = translations[language];

  const currentLimit = getUsageLimit('symptoms');
  const currentUsage = user?.symptomUsage || 0;
  const isLimitReached = currentUsage >= currentLimit;

  const API_URL = import.meta.env.VITE_PY_API_URL;
  const fallbackSymptoms = Object.keys(symptomTranslations).slice(0, 32);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_URL}/symptoms`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data && data.symptoms && Array.isArray(data.symptoms)) {
          setSymptoms(data.symptoms);
        } else {
          setSymptoms(fallbackSymptoms);
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        setError(`Failed to load symptoms: ${error.message}. Using fallback list.`);
        setSymptoms(fallbackSymptoms);
      } finally {
        setIsFetchingSymptoms(false);
      }
    };
    fetchSymptoms();
    window.scrollTo(0, 0);
  }, [API_URL]);

  // Reset prediction when leaving the page
  useEffect(() => {
    return () => {
      setDiseasePrediction(null);
    };
  }, [setDiseasePrediction]);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      alert(t.selectSymptomAlert);
      return;
    }

    if (isLimitReached) {
      triggerLimitModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Check and increment usage on Node backend first
      await incrementUsage('symptom');

      const response = await fetch(`${API_URL}/disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      setDiseasePrediction(data.predicted_disease);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      alert(`${language === 'en' ? 'Error' : 'त्रुटि'}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setDiseasePrediction(null);
    setError(null);
    setSymptomSearchQuery('');
  };

  if (isFetchingSymptoms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[var(--accent)]/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🩺</div>
          </div>
          <p className="text-lg font-black text-[var(--text)] animate-pulse">{t.loadingSymptoms}</p>
        </div>
      </div>
    );
  }

  const filteredSymptoms = symptoms.filter(s =>
    getSymptomName(s, language).toLowerCase().includes(symptomSearchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-24 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#fcfdfb]'}`}>
      <style>{`
        .hero-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 30%, rgba(239, 68, 68, 0.05) 0%, transparent 60%),
                      radial-gradient(ellipse at 10% 80%, rgba(22, 163, 74, 0.05) 0%, transparent 60%);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease forwards;
        }
        .symptom-tag {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-up">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
              <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
            </div>
            <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
          </button>
          <div className="flex flex-col items-end gap-2">
            <div className="text-[var(--accent)] font-black text-sm tracking-widest uppercase">
              <i className="fa-solid fa-stethoscope mr-2"></i> {t.diagnostics}
            </div>
            {user && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${isLimitReached ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]'}`}>
                {isLimitReached 
                  ? (language === 'en' ? 'LIMIT REACHED' : 'सीमा समाप्त') 
                  : `${currentLimit - currentUsage} ${language === 'en' ? 'ANALYSES LEFT' : 'विश्लेषण शेष'}`
                }
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-teal-500">
            {t.predictDisease}
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Select the symptoms your cattle is exhibiting to get an instant AI-powered health assessment and localized treatment advice.'
              : 'अपने मवेशियों में दिखने वाले लक्षणों का चयन करें ताकि तत्काल एआई-संचालित स्वास्थ्य मूल्यांकन और स्थानीय उपचार सलाह मिल सके।'}
          </p>

          {user && isLimitReached && (
            <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-r from-red-500 to-orange-500 text-white animate-fade-up">
              <h3 className="text-xl font-black mb-2">{language === 'en' ? 'Usage Limit Reached' : 'उपयोग सीमा समाप्त'}</h3>
              <p className="font-medium opacity-90 mb-4">{language === 'en' ? 'You have used all your free symptom analyses. Upgrade to Pro for 500 scans or Enterprise for unlimited access!' : 'आपने अपने सभी मुफ़्त लक्षणों के विश्लेषण का उपयोग कर लिया है। 500 स्कैन के लिए प्रो या असीमित एक्सेस के लिए एंटरप्राइज पर अपग्रेड करें!'}</p>
              <button 
                onClick={() => navigate('/membership')}
                className="px-8 py-3 bg-white text-red-500 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                {language === 'en' ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
              </button>
            </div>
          )}
        </div>
        {/* API Status Alert */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 animate-fade-up">
            <i className="fa-solid fa-triangle-exclamation text-amber-500 text-xl mt-1"></i>
            <div>
              <h4 className="font-black text-amber-600 dark:text-amber-400 text-sm">{t.apiConnectionIssue}</h4>
              <p className="text-xs font-medium opacity-70">{error}</p>
            </div>
          </div>
        )}

        {!diseasePrediction ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Selection Area */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden animate-fade-up">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <i className="fa-solid fa-list-check text-[var(--accent)]"></i> {language === 'en' ? 'Symptom Panel' : 'लक्षण पैनल'}
                  </h3>
                  <div className="relative flex-1 max-w-xs">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-40 text-sm"></i>
                    <input
                      type="text"
                      placeholder={t.search}
                      value={symptomSearchQuery}
                      onChange={(e) => setSymptomSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-bold text-sm focus:border-[var(--accent)] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSymptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`symptom-tag p-4 rounded-2xl text-left border-2 flex items-center justify-between group ${isSelected
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-green-500/20'
                          : 'bg-[var(--surface)] border-transparent hover:border-[var(--accent)]/30 text-[var(--text)]'
                          }`}
                      >
                        <span className="font-bold text-sm truncate pr-2">{getSymptomName(symptom, language)}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${isSelected ? 'bg-white border-white text-[var(--accent)]' : 'border-[var(--border)] group-hover:border-[var(--accent)]'
                          }`}>
                          {isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {filteredSymptoms.length === 0 && (
                  <div className="py-20 text-center opacity-40">
                    <i className="fa-solid fa-search text-4xl mb-4"></i>
                    <p className="font-black italic">{language === 'en' ? 'No symptoms match your search' : 'आपकी खोज से कोई लक्षण मेल नहीं खाता'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[var(--surface)] border-2 border-dashed border-[var(--border)] rounded-[2.5rem] p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h4 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] opacity-60 mb-6">{t.selectedLabel}</h4>

                <div className="space-y-3 mb-8">
                  {selectedSymptoms.length > 0 ? (
                    selectedSymptoms.map(s => (
                      <div key={s} className="flex items-center justify-between px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl group">
                        <span className="text-xs font-bold truncate pr-3">{getSymptomName(s, language)}</span>
                        <button onClick={() => handleSymptomToggle(s)} className="text-red-500 opacity-40 hover:opacity-100 transition-opacity">
                          <i className="fa-solid fa-circle-xmark"></i>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-xs font-bold text-[var(--muted)] opacity-50 italic">
                      {language === 'en' ? 'No symptoms selected' : 'कोई लक्षण नहीं चुना गया'}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handlePredict}
                    disabled={selectedSymptoms.length === 0 || isLoading}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${selectedSymptoms.length === 0 || isLoading
                      ? 'bg-[var(--muted)]/20 text-[var(--muted)] cursor-not-allowed'
                      : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-green-500/20 active:scale-95'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                        <span>{t.analyzingPathologies}</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-wand-sparkles"></i>
                        <span>{t.runAiDiagnosis}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 text-[var(--muted)] font-black uppercase text-xs tracking-widest hover:text-red-500 transition-colors"
                  >
                    {t.clear}
                  </button>
                </div>
              </div>

              {/* Quick Tips Box */}
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2rem] p-6 animate-fade-up shadow-sm" style={{ animationDelay: '0.3s' }}>
                <h5 className="font-black text-blue-600 dark:text-blue-400 text-sm mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-lightbulb"></i> {language === 'en' ? 'Diagnostic Tip' : 'नैदानिक टिप'}
                </h5>
                <p className="text-xs font-semibold leading-relaxed text-[var(--muted)]">
                  {language === 'en'
                    ? 'The more symptoms you select, the more accurate the AI prediction will be. Include even subtle changes in behavior.'
                    : 'आप जितने अधिक लक्षण चुनेंगे, एआई भविष्यवाणी उतनी ही सटीक होगी। व्यवहार में सूक्ष्म परिवर्तनों को भी शामिल करें।'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
            <div className="relative p-1 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 rounded-[2.5rem] shadow-2xl overflow-hidden group">
              <div className="bg-[var(--card)] rounded-[2.4rem] p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full"></div>

                <div className="text-center relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] text-[9px] font-black uppercase tracking-[0.2em] mb-6 bg-[var(--surface)] shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {t.diagnosisResult}
                  </div>

                  <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-2 uppercase tracking-tight">
                    {t.conditionIdentified}
                  </h3>

                  <div className="text-3xl md:text-5xl font-black text-[var(--text)] tracking-tighter mb-6 leading-[1.1]">
                    {getDiseaseName(diseasePrediction, language)}
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <div 
                      onClick={() => setIsSymptomModalOpen(true)}
                      className="px-5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center gap-3 cursor-pointer hover:border-[var(--accent)] hover:shadow-lg transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                        <i className="fa-solid fa-code-branch text-xs"></i>
                      </div>
                      <div className="text-left">
                        <div className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50">{t.crossReferenced}</div>
                        <div className="text-xs font-black underline decoration-dashed underline-offset-4 decoration-[var(--accent)]/30">{selectedSymptoms.length} {t.symptomNodesText}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    <button
                      onClick={() => navigate(`/prescription?disease=${diseasePrediction}`)}
                      className="px-10 py-4 bg-[var(--text)] text-[var(--bg)] rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 flex items-center gap-4"
                    >
                      <i className="fa-solid fa-file-medical"></i>
                      {t.getClinicalPrescription}
                    </button>

                    <div className="max-w-lg p-5 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex flex-col items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center text-base">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div>
                        <p className="text-sm font-black text-amber-600 dark:text-amber-500 mb-1">{t.medicalDisclaimer}</p>
                        <p className="text-[10px] font-bold text-amber-800/60 dark:text-amber-300/60 leading-relaxed uppercase tracking-widest">{t.medicalDisclaimerText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-4xl mx-auto">
              <button onClick={handleReset} className="flex-1 py-4 border-2 border-[var(--border)] text-[var(--text)] rounded-2xl font-black hover:bg-red-500/5 transition-all flex items-center justify-center gap-3">
                <i className="fa-solid fa-arrow-rotate-left"></i> {language === 'en' ? 'Try Again' : 'पुनः प्रयास करें'}
              </button>
              <button
                onClick={() => navigate('/diseases')}
                className="flex-1 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl font-black shadow-lg flex items-center justify-center gap-3 hover:border-red-500 hover:text-red-500 transition-all"
              >
                <i className="fa-solid fa-book-medical"></i> {language === 'en' ? 'Show All Diseases' : 'सभी रोग देखें'}
              </button>
            </div>
          </div>
        )}

        {/* Tips Section - Only shown when no prediction */}
        {!diseasePrediction && (
          <div className="mt-20 border-t border-[var(--border)] pt-16">
            <div className="flex items-center gap-3 mb-10 px-2 text-[var(--accent)]">
              <i className="fa-solid fa-user-doctor text-2xl"></i>
              <h3 className="text-2xl font-black text-[var(--text)]">{language === 'en' ? 'Veterinary Guidance' : 'पशु चिकित्सा मार्गदर्शन'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-temperature-half text-xl"></i>
                </div>
                <p className="text-sm text-[var(--muted)] font-bold leading-relaxed">
                  {language === 'en' 
                    ? 'Monitor body temperature twice daily during symptomatic periods.' 
                    : 'लक्षणों की अवधि के दौरान दिन में दो बार शरीर के तापमान की निगरानी करें।'}
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-water text-xl"></i>
                </div>
                <p className="text-sm text-[var(--muted)] font-bold leading-relaxed">
                  {language === 'en'
                    ? 'Ensure constant access to clean, electrolyte-enriched water.'
                    : 'स्वच्छ, इलेक्ट्रोलाइट-समृद्ध पानी तक निरंतर पहुंच सुनिश्चित करें।'}
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-shield-virus text-xl"></i>
                </div>
                <p className="text-sm text-[var(--muted)] font-bold leading-relaxed">
                  {language === 'en'
                    ? 'Implement immediate isolation protocols for highly contagious signs.'
                    : 'अत्यधिक संक्रामक लक्षणों के लिए तत्काल अलगाव प्रोटोकॉल लागू करें।'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Symptoms Modal */}
      {isSymptomModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--border)] animate-fade-up">
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[var(--text)]">{language === 'en' ? 'Symptom Profile' : 'लक्षण प्रोफ़ाइल'}</h3>
                <p className="text-xs font-bold text-[var(--muted)]">{selectedSymptoms.length} {t.symptomNodesText} {language === 'en' ? 'contributed to this diagnosis' : 'ने इस निदान में योगदान दिया'}</p>
              </div>
              <button 
                onClick={() => setIsSymptomModalOpen(false)}
                className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-wrap gap-3">
                {selectedSymptoms.map((s) => (
                  <div key={s} className="px-4 py-2.5 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                    <span className="text-sm font-bold text-[var(--text)]">{getSymptomName(s, language)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-[var(--card)] flex justify-end">
              <button 
                onClick={() => setIsSymptomModalOpen(false)}
                className="px-8 py-3 bg-[var(--text)] text-[var(--bg)] rounded-xl font-black text-sm active:scale-95 transition-all"
              >
                {t.back}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseasePredictPage;