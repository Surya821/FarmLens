import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { useAuth } from '../../context/AuthContext';

function SkinDiseasePage({ isDark, language, skinPrediction, setSkinPrediction, setGlobalImage }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [allPredictions, setAllPredictions] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, incrementUsage, getUsageLimit, triggerLimitModal } = useAuth();
  const t = translations[language];

  const currentLimit = getUsageLimit('ai');
  const currentUsage = user?.aiUsage || 0;
  const isLimitReached = currentUsage >= currentLimit;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const API_URL = import.meta.env.VITE_PY_API_URL || 'http://localhost:8000';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        if (setGlobalImage) setGlobalImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setSkinPrediction(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    if (isLimitReached) {
      triggerLimitModal(true);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Check and increment usage on Node backend first
      await incrementUsage('ai');

      const response = await fetch(`${API_URL}/predict-skin`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.error === "No cattle detected") {
          setSkinPrediction("No cattle detected");
          return;
        }
        throw new Error(data.error || "Prediction failed");
      }

      if (data.status === "success") {
        setSkinPrediction(data.predicted_disease);
        setConfidence(Math.round(data.confidence * 100));
        setAllPredictions(data.all_predictions);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error predicting skin disease. Please check if the AI server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setUploadedImage(null);
    setSelectedFile(null);
    setSkinPrediction(null);
    if (setGlobalImage) setGlobalImage(null);
    setConfidence(0);
    setAllPredictions(null);
  };

  const isHealthy = skinPrediction === "Healthy";
  const noCattleDetected = skinPrediction === "No cattle detected";

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f9faf8]'}`}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .confidence-fill {
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12">
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
            <div className="text-red-500 font-black text-sm tracking-widest uppercase">
              <i className="fa-solid fa-microscope mr-2"></i> {t.skinDiagnostic}
            </div>
            {user && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${isLimitReached ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-red-500/10 border-items-red-500/20 text-red-500'}`}>
                {isLimitReached 
                  ? (language === 'en' ? 'LIMIT REACHED' : 'सीमा समाप्त') 
                  : `${currentLimit - currentUsage} ${language === 'en' ? 'SCANS LEFT' : 'स्कैन शेष'}`
                }
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            {t.skinDiseasePredict}
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            {t.skinAnalysisSubtitle}
          </p>

          {user && isLimitReached && (
            <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-r from-red-500 to-orange-500 text-white animate-fade-up">
              <h3 className="text-xl font-black mb-2">{language === 'en' ? 'Usage Limit Reached' : 'उपयोग सीमा समाप्त'}</h3>
              <p className="font-medium opacity-90 mb-4">{language === 'en' ? 'You have used all your free AI scans. Upgrade to Pro for 100 scans or Enterprise for unlimited access!' : 'आपने अपने सभी मुफ़्त एआई स्कैन का उपयोग कर लिया है। 100 स्कैन के लिए प्रो या असीमित एक्सेस के लिए एंटरप्राइज पर अपग्रेड करें!'}</p>
              <button 
                onClick={() => navigate('/membership')}
                className="px-8 py-3 bg-white text-red-500 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                {language === 'en' ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
              </button>
            </div>
          )}
        </div>

        {/* Main Interface */}
        {!skinPrediction && !isLoading ? (
          <div className="animate-fade-up">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-red-500', 'bg-red-500/5'); }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-red-500', 'bg-red-500/5'); }}
              onDrop={(e) => { e.preventDefault(); handleFileSelect({ target: { files: e.dataTransfer.files } }); }}
              className={`relative border-2 border-dashed border-[var(--border)] rounded-[2.5rem] p-12 text-center cursor-pointer transition-all hover:border-red-500 bg-[var(--card)] group ${uploadedImage ? 'p-6' : ''}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
              />

              {!uploadedImage ? (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <i className="fa-solid fa-camera-retro text-4xl text-red-500"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-2 text-[var(--text)]">{language === 'en' ? 'Upload Skin Patch' : 'त्वचा के हिस्से की फोटो अपलोड करें'}</h2>
                    <p className="text-[var(--muted)] font-medium">{language === 'en' ? 'Drag and drop or click to select a photo' : 'खींचें और छोड़ें या फोटो चुनने के लिए क्लिक करें'}</p>
                  </div>
                  <button className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                    {t.chooseFile}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-[2rem] overflow-hidden max-h-[400px]">
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-contain bg-black/5" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-sm">
                        {language === 'en' ? 'Click to Change' : 'बदलने के लिए क्लिक करें'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePredict(); }}
                    className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-bolt-lightning"></i> {t.predictBtn}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetAll(); }}
                    className="text-[var(--muted)] font-black hover:text-red-500 transition-colors uppercase text-xs tracking-widest"
                  >
                    {t.cancel}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20 animate-fade-up">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-red-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                🔬
              </div>
            </div>
            <h2 className="text-2xl font-black mb-2">{t.analyzingSkin}</h2>
            <p className="text-[var(--muted)] font-medium">{language === 'en' ? 'Scanning pixel patterns for infection markers' : 'संक्रमण चिह्नों के लिए पिक्सेल पैटर्न को स्कैन किया जा रहा है'}</p>
          </div>
        ) : noCattleDetected ? (
          <div className="animate-fade-up">
            <div className="bg-red-500/5 border-2 border-red-500/20 rounded-[3rem] p-12 text-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h2 className="text-3xl font-black text-red-600 mb-4">{t.scanningFailed}</h2>
              <p className="text-lg text-[var(--muted)] font-medium mb-8 max-w-md mx-auto">{t.noCattleDetectedDesc}</p>
              <button 
                onClick={resetAll} 
                className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
              >
                {t.tryAnotherImage}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-up">
            {/* Result Header */}
            <div className={`rounded-[3rem] p-10 border-2 overflow-hidden relative shadow-2xl ${isHealthy ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-48 h-48 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  <img src={uploadedImage} alt="Input" className="w-full h-full object-cover" />
                </div>
                
                <div className="text-center md:text-left">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 ${isHealthy ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isHealthy ? 'Healthy Analysis' : 'Diagnostic Detected'}
                  </div>
                  
                  <h2 className="text-4xl font-black mb-4 tracking-tight">
                    {isHealthy ? t.skinHealthy : (
                      <>
                        <span className="block text-lg font-bold text-[var(--muted)] mb-1">{t.skinConditionFound}</span>
                        <span className="text-red-500">{prediction}</span>
                      </>
                    )}
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black">{confidence}%</div>
                    <div className="flex-1 h-2 w-32 bg-[var(--border)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full confidence-fill ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${confidence}%` }}></div>
                    </div>
                    <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider">AI Confidence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations / Next Steps */}
            {!isHealthy && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-notes-medical text-red-500"></i>
                  {language === 'en' ? 'Veterinary Recommendations' : 'पशु चिकित्सा सिफारिशें'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <h4 className="font-bold text-red-600 mb-2">{language === 'en' ? 'Immediate Action' : 'तत्काल कार्रवाई'}</h4>
                    <p className="text-sm text-[var(--muted)] font-medium">{language === 'en' ? 'Isolate the affected animal from the rest of the herd to prevent potential spread.' : 'संभावित फैलाव को रोकने के लिए प्रभावित जानवर को झुंड के बाकी हिस्सों से अलग करें।'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <h4 className="font-bold text-amber-600 mb-2">{language === 'en' ? 'Professional Care' : 'पेशेवर देखभाल'}</h4>
                    <p className="text-sm text-[var(--muted)] font-medium">{language === 'en' ? 'Consult a certified veterinarian immediately for confirmation and treatment plan.' : 'पुष्टि और उपचार योजना के लिए तुरंत प्रमाणित पशु चिकित्सक से परामर्श लें।'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={resetAll} className="flex-1 py-4 border-2 border-[var(--border)] text-[var(--text)] rounded-2xl font-black hover:bg-red-500/5 transition-all flex items-center justify-center gap-3">
                <i className="fa-solid fa-arrow-rotate-left"></i> {t.tryAnotherImage}
              </button>
              <button 
                onClick={() => navigate('/disease')}
                className="flex-1 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl font-black shadow-lg flex items-center justify-center gap-3 hover:border-red-500 hover:text-red-500 transition-all"
              >
                <i className="fa-solid fa-stethoscope"></i> {t.diseasePredict}
              </button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-20 border-t border-[var(--border)] pt-16">
          <div className="flex items-center gap-3 mb-10 px-2 text-red-500">
            <i className="fa-solid fa-lightbulb text-2xl"></i>
            <h3 className="text-2xl font-black text-[var(--text)]">{t.skinTips}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-bullseye text-xl"></i>
              </div>
              <p className="text-sm text-[var(--muted)] font-bold leading-relaxed">{t.skinTip1}</p>
            </div>
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-sun text-xl"></i>
              </div>
              <p className="text-sm text-[var(--muted)] font-bold leading-relaxed">{t.skinTip2}</p>
            </div>
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-hand-holding-hand text-xl"></i>
              </div>
              <p className="text-sm text-[var(--muted)] font-bold leading-relaxed">{t.skinTip3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkinDiseasePage;
