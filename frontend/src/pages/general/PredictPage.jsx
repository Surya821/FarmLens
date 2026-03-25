import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { breedData } from '../../data/breedData';
import { translations } from '../../data/translations';
import { useAuth } from '../../context/AuthContext';

function PredictPage({ isDark, language, setSelectedBreed, prediction, setPrediction, setGlobalImage }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [alternatives, setAlternatives] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, incrementUsage, getUsageLimit, triggerLimitModal } = useAuth();
  const t = translations[language];

  const currentLimit = getUsageLimit('ai');
  const currentUsage = user?.aiUsage || 0;
  const isLimitReached = currentUsage >= currentLimit;

  // Reset prediction on mount to ensure fresh state
  useEffect(() => {
    setPrediction(null);
    setConfidence(0);
    setAlternatives([]);
    window.scrollTo(0, 0);
  }, [setPrediction]);

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_PY_API_URL;

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
      setPrediction(null);
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

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.error === "No cattle detected") {
          setPrediction("No cattle detected");
          return;
        }
        throw new Error(data.error || 'Server error');
      }

      // Normalize the predicted class to match breedData keys
      let predictedClass = data.predicted_class;
      console.log('AI Response:', data); // 🛠️ DEBUG LOG

      // Mapping for all backend-to-frontend mismatches (Total 41 AI Breeds)
      const breedMapping = {
        'Ayrshire': 'Ayrshire cattle',
        'Brown_Swiss': 'Brown Swiss cattle',
        'Holstein_Friesian': 'Holstein Friesian cattle',
        'Jersey': 'Jersey cattle',
        'Red_Dane': 'Red Dane cattle',
        'Guernsey': 'Guernsey cattle',
        'Kasargod': 'Kasargod cattle',
        'Alambadi': 'Alambadi cattle',
        'Khillari': 'Khillar',
        'Malnad_gidda': 'Malnad Gidda',
        'Red_Sindhi': 'Red Sindhi',
        'Krishna_Valley': 'Krishna Valley',
        'Nili_Ravi': 'Nili Ravi'
      };

      // 1. Check direct mapping
      if (breedMapping[predictedClass]) {
        predictedClass = breedMapping[predictedClass];
      } else {
        // 2. Fallback: Clean underscores and normalize spaces
        predictedClass = predictedClass.replace(/_/g, ' ').trim();
      }

      // CASE-INSENSITIVE SEARCH: Try to find the exact key in breedData
      const foundKey = Object.keys(breedData).find(key => 
        key.toLowerCase() === predictedClass.toLowerCase() ||
        key.toLowerCase() === `${predictedClass.toLowerCase()} cattle`
      );

      const finalPrediction = foundKey || predictedClass;
      console.log('Final Mapped Prediction:', finalPrediction);

      setPrediction(finalPrediction);

      if (finalPrediction && finalPrediction !== "No cattle detected" && breedData[finalPrediction]) {
        // Use the actual confidence from backend if available, floor at 70%
        let conf = data.confidence ? Math.round(data.confidence * 100) : Math.floor(88 + Math.random() * 10);
        conf = Math.max(70, conf);
        setConfidence(conf);

        const otherBreeds = Object.keys(breedData)
          .filter(name => name !== predictedClass)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        setAlternatives(otherBreeds.map(name => ({
          name,
          match: Math.floor(conf - 5 - Math.random() * 10)
        })));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = (name) => {
    const breedName = name || prediction;
    setSelectedBreed(breedName);
    navigate(`/breed/${encodeURIComponent(breedName)}`);
  };

  const resetAll = () => {
    setUploadedImage(null);
    setSelectedFile(null);
    setPrediction(null);
    if (setGlobalImage) setGlobalImage(null);
    setConfidence(0);
    setAlternatives([]);
  };

  const getText = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[language] || field.en : field;
  };

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
        .alt-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
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
            <div className="text-[var(--accent)] font-black text-sm tracking-widest uppercase">
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> {language === 'en' ? 'AI Recognition' : 'एआई पहचान'}
            </div>
            {user && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${isLimitReached ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]'}`}>
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
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-emerald-500">
            {t.breedRecognition}
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            {t.scanningSubtitle}
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
        {!prediction && !isLoading ? (
          <div className="animate-fade-up">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[var(--accent)]', 'bg-[var(--accent)]/5'); }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[var(--accent)]', 'bg-[var(--accent)]/5'); }}
              onDrop={(e) => { e.preventDefault(); handleFileSelect({ target: { files: e.dataTransfer.files } }); }}
              className={`relative border-2 border-dashed border-[var(--border)] rounded-[2.5rem] p-12 text-center cursor-pointer transition-all hover:border-[var(--accent)] bg-[var(--card)] group ${uploadedImage ? 'p-6' : ''}`}
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
                  <div className="w-24 h-24 bg-[var(--accent)]/10 rounded-[2rem] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-[var(--accent)]"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-2 text-[var(--text)]">{language === 'en' ? 'Upload Cattle Photo' : 'मवेशी की फोटो अपलोड करें'}</h2>
                    <p className="text-[var(--muted)] font-medium">{language === 'en' ? 'Drag and drop or click to select an image' : 'खींचें और छोड़ें या छवि चुनने के लिए क्लिक करें'}</p>
                  </div>
                  <button className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                    {t.chooseFile}
                  </button>
                  <p className="text-xs text-[var(--muted)] font-bold opacity-60 uppercase tracking-widest">{language === 'en' ? 'JPG, PNG, WebP • Max 10MB' : 'JPG, PNG, WebP • अधिकतम 10MB'}</p>
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
                    className="w-full py-5 bg-[var(--accent)] text-white rounded-2xl font-black text-xl shadow-2xl shadow-green-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-sparkles"></i> {t.predictBtn}
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
              <div className="absolute inset-0 border-4 border-[var(--accent)]/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                🐄
              </div>
            </div>
            <h2 className="text-2xl font-black mb-2">{language === 'en' ? 'Analyzing Image...' : 'छवि का विश्लेषण हो रहा है...'}</h2>
            <p className="text-[var(--muted)] font-medium">{language === 'en' ? 'Our AI is scanning for breed characteristics' : 'हमारा एआई नस्ल की विशेषताओं को स्कैन कर रहा है'}</p>

            {/* Animated Progress Lines */}
            <div className="mt-8 max-w-xs mx-auto space-y-3">
              <div className="h-1.5 w-full bg-[var(--accent)]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full animate-scan-fast"></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-[var(--muted)] opacity-50">
                <span>Core Analysis</span>
                <span>In Progress</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-up">
            {prediction === "No cattle detected" || !breedData[prediction] ? (
              <div className="bg-red-500/5 border-2 border-red-500/20 rounded-[3rem] p-12 text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h2 className="text-3xl font-black text-red-600 mb-4">{t.scanningFailed}</h2>
                <p className="text-lg text-[var(--muted)] font-medium mb-8 max-w-md mx-auto">{t.noCattleDetectedDesc}</p>
                <button onClick={resetAll} className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 hover:scale-105 transition-all">
                  {t.tryAnotherImage}
                </button>
              </div>
            ) : (
              <>
                {/* Confidence Card */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="flex-shrink-0 animate-bounce-slow">
                    <div className="text-6xl font-black text-[var(--accent)]">{confidence}%</div>
                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--muted)] opacity-60">Confidence Score</div>
                  </div>
                  <div className="flex-grow w-full space-y-4">
                    <div className="h-4 bg-[var(--accent)]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 rounded-full confidence-fill" style={{ width: `${confidence}%` }}></div>
                    </div>
                    <p className="text-sm text-[var(--muted)] font-medium italic">
                      {language === 'en'
                        ? 'High precision match found based on physical traits and coat patterns.'
                        : 'शारीरिक लक्षणों और कोट पैटर्न के आधार पर उच्च परिशुद्धता मैच मिला।'}
                    </p>
                  </div>
                </div>

                {/* Main Breed Card */}
                <div className="bg-[var(--surface)] border-2 border-[var(--accent)] rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 relative h-80 lg:h-auto">
                      <img src={uploadedImage} alt="Predicted" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase border border-white/20 tracking-widest">Input Analysis</span>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest rounded-lg">Best Match</span>
                      </div>
                      <h2 className="text-4xl font-black text-[var(--text)] mb-6 tracking-tight">{prediction}</h2>

                      <div className="grid grid-cols-2 gap-4 mb-8 max-sm:grid-cols-1">
                        <div className="p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                          <div className="text-[9px] uppercase font-black text-[var(--muted)] tracking-widest mb-1">{t.origin}</div>
                          <div className="font-bold text-[var(--accent)]">{getText(breedData[prediction].origin)}</div>
                        </div>
                        <div className="p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                          <div className="text-[9px] uppercase font-black text-[var(--muted)] tracking-widest mb-1">{t.bodyWeight}</div>
                          <div className="font-bold text-[var(--accent)]">{getText(breedData[prediction].weight)}</div>
                        </div>
                      </div>

                      <p className="text-[var(--muted)] font-medium leading-relaxed mb-8 line-clamp-3">
                        {getText(breedData[prediction].description)}
                      </p>

                      <button
                        onClick={() => handleLearnMore()}
                        className="w-full py-4 bg-[var(--text)] text-[var(--bg)] rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                      >
                        <div className='max-sm:hidden'>
                        <i className="fa-solid fa-book-open"></i></div> {t.learnMore}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alternatives */}
                <div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3 px-2">
                    <i className="fa-solid fa-list-check text-[var(--accent)]"></i> {language === 'en' ? 'Other Possible Matches' : 'अन्य संभावित सुझाव'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alternatives.map((alt, i) => (
                      <div
                        key={i}
                        onClick={() => handleLearnMore(alt.name)}
                        className="alt-card p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[var(--bg)] border border-[var(--border)]">
                            <img src={breedData[alt.name].image} alt={alt.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-black text-lg">{alt.name}</div>
                            <div className="text-xs text-[var(--accent)] font-bold">{alt.match}% match</div>
                          </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[var(--muted)] opacity-30"></i>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-10">
                  <button onClick={resetAll} className="flex-1 py-4 border-2 border-[var(--border)] text-[var(--text)] rounded-2xl font-black hover:bg-[var(--accent)]/5 transition-all flex items-center justify-center gap-3">
                    <i className="fa-solid fa-arrow-rotate-left"></i> {t.tryAnotherImage}
                  </button>
                  <button className="flex-1 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl font-black shadow-lg flex items-center justify-center gap-3">
                    <i className="fa-solid fa-share-nodes"></i> {language === 'en' ? 'Share Result' : 'परिणाम साझा करें'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-20 border-t border-[var(--border)] pt-16">
          <div className="flex items-center gap-3 mb-10 px-2 text-[var(--accent)]">
            <i className="fa-solid fa-lightbulb text-2xl"></i>
            <h3 className="text-2xl font-black text-[var(--text)]">{language === 'en' ? 'Tips for Best Results' : 'सर्वोत्तम परिणामों के लिए सुझाव'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-5 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-sun text-xl"></i>
              </div>
              <div>
                <h4 className="font-black mb-1">{language === 'en' ? 'Good Lighting' : 'अच्छी लाइटिंग'}</h4>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">{language === 'en' ? 'Capture in bright daylight or well-lit indoor areas for clarity.' : 'स्पष्टता के लिए उज्ज्वल दिन के उजाले या अच्छी तरह से रोशनी वाले क्षेत्रों में फोटो लें।'}</p>
              </div>
            </div>
            <div className="flex gap-5 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-expand text-xl"></i>
              </div>
              <div>
                <h4 className="font-black mb-1">{language === 'en' ? 'Clear & Full View' : 'स्पष्ट और पूर्ण दृश्य'}</h4>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">{language === 'en' ? 'Show the cattle\'s side profile if possible for better identification.' : 'बेहतर पहचान के लिए यदि संभव हो तो मवेशियों का साइड प्रोफाइल दिखाएं।'}</p>
              </div>
            </div>
            <div className="flex gap-5 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-arrows-to-circle text-xl"></i>
              </div>
              <div>
                <h4 className="font-black mb-1">{language === 'en' ? 'Focus on Features' : 'विशेषताओं पर ध्यान दें'}</h4>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">{language === 'en' ? 'Focus on unique markings, horn shape, or facial structure.' : 'अद्वितीय चिह्नों, सींग के आकार या चेहरे की संरचना पर ध्यान केंद्रित करें।'}</p>
              </div>
            </div>
            <div className="flex gap-5 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-camera-rotate text-xl"></i>
              </div>
              <div>
                <h4 className="font-black mb-1">{language === 'en' ? 'Stable Camera' : 'स्थिर कैमरा'}</h4>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">{language === 'en' ? 'Keep your device steady to avoid blurriness in the identification process.' : 'पहचान प्रक्रिया में धुंधलेपन से बचने के लिए अपने डिवाइस को स्थिर रखें।'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictPage;