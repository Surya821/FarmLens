import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { breedData } from '../../data/breedData';
import { translations } from '../../data/translations';

function BreedInfoPage({ isDark, language, selectedBreed, prediction }) {
  const { breedName } = useParams();
  const navigate = useNavigate();
  const t = translations[language];
  const [isVisible, setIsVisible] = useState(false);
  const [dynamicBreedInfo, setDynamicBreedInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine final breed name - decode URL encoding
  const finalBreedRaw = selectedBreed || prediction || decodeURIComponent(breedName);
  const finalBreed = finalBreedRaw;

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    
    // Always fetch dynamic data to check for overrides/care requirements
    fetchDynamicBreed();
  }, [finalBreed]);

  const fetchDynamicBreed = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/breeds`);
      const data = await res.json();
      const match = data.find(b => b.name === finalBreed);
      setDynamicBreedInfo(match);
    } catch (error) {
      console.error('Failed to fetch dynamic breed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Merge data: dynamic data (from DB) takes priority over static local data
  const breedInfo = dynamicBreedInfo 
    ? { ...(breedData[finalBreed] || {}), ...dynamicBreedInfo } 
    : breedData[finalBreed];

  const getText = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[language] || field.en : field;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!breedInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="fade-up">
          <div className="text-8xl mb-6 grayscale opacity-30">🔍</div>
          <h2 className="text-3xl font-black mb-4 text-[var(--text)]">
            {t.breedNotFound}
          </h2>
          <p className="mb-8 text-[var(--muted)] font-medium max-w-md mx-auto">
            {t.breedNotFoundDesc}
          </p>
          <button
            onClick={() => navigate('/breeds')}
            className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-xl shadow-green-600/20"
          >
            {language === 'en' ? 'Back to Breeds' : 'नस्लों पर वापस'}
          </button>
        </div>
      </div>
    );
  }

  const getBreedType = (breed) => {
    if (breed.type) return breed.type;
    const desc = (breed.description?.en || '').toLowerCase();
    if (desc.includes('dairy')) return 'Dairy';
    if (desc.includes('beef')) return 'Beef';
    if (desc.includes('dual')) return 'Dual-Purpose';
    return 'Other';
  };

  const getBreedRegion = (originStr) => {
    const origin = (originStr || '').toLowerCase();
    if (origin.includes('india') || origin.includes('pakistan') || origin.includes('asia')) return 'Asia';
    if (origin.includes('scotland') || origin.includes('uk') || origin.includes('jersey') || origin.includes('europe') || origin.includes('denmark') || origin.includes('switzerland') || origin.includes('netherlands') || origin.includes('france') || origin.includes('germany')) return 'Europe';
    if (origin.includes('brazil') || origin.includes('americas') || origin.includes('usa')) return 'Americas';
    if (origin.includes('africa')) return 'Africa';
    return 'Global';
  };

  const breedType = getBreedType(breedInfo);
  const breedOrigin = getText(breedInfo.origin);
  const breedRegion = getBreedRegion(breedInfo.origin?.en || '');

  // Find related breeds (just pick 3 others for now)
  const allBreedNames = Object.keys(breedData);
  const relatedNames = allBreedNames
    .filter(name => name !== finalBreed)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f0faf3]'}`}>
      <style>{`
        .detail-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, rgba(22, 163, 74, 0.1) 0%, transparent 70%),
                      radial-gradient(circle at 10% 80%, rgba(22, 163, 74, 0.05) 0%, transparent 50%);
        }
        .detail-badge {
          background: var(--accent-light);
          color: var(--accent);
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dark .detail-badge {
          background: rgba(22, 163, 74, 0.15);
        }
        .detail-spec {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 20px;
          border-radius: 20px;
          text-align: center;
          transition: transform 0.3s;
        }
        .detail-spec:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
        }
        .detail-spec-label {
          font-size: 0.7rem;
          color: var(--muted);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .detail-spec-value {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--text);
        }
        .detail-section-title {
          font-size: 1.75rem;
          font-weight: 900;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .detail-list-item {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 18px;
          border-radius: 18px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.2s;
        }
        .detail-list-item:hover {
          border-color: var(--accent);
          background: var(--surface);
        }
        .detail-list-item-icon {
          width: 32px;
          height: 32px;
          background: var(--accent-light);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          font-size: 0.9rem;
        }
        .dark .detail-list-item-icon {
          background: rgba(22, 163, 74, 0.2);
        }
        .related-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s;
          cursor: pointer;
        }
        .related-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <i className="fa-solid fa-arrow-left"></i> {t.back}
          </button>
          <div className="hidden md:block text-[var(--muted)] font-bold text-sm">
            {t.breeds} / <span className="text-[var(--accent)]">{finalBreed}</span>
          </div>
          <button
            onClick={() => navigate('/predict')}
            className="bg-[var(--accent)] text-white px-5 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
          >
            {t.identify}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="detail-hero-bg"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Info */}
            <div className={`flex-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="flex gap-3 mb-6">
                <span className="detail-badge">{breedType}</span>
                <span className="detail-badge">🌍 {breedRegion}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[var(--text)] mb-6 leading-tight">
                {finalBreed}
              </h1>
              <p className="text-xl text-[var(--muted)] font-medium leading-relaxed mb-10 max-w-2xl">
                {getText(breedInfo.description)}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="detail-spec">
                  <div className="detail-spec-label">{language === 'en' ? 'Production' : 'उत्पादन'}</div>
                  <div className="detail-spec-value">{getText(breedInfo.milkProduction) || '—'}</div>
                </div>
                <div className="detail-spec">
                  <div className="detail-spec-label">{t.weight}</div>
                  <div className="detail-spec-value">{getText(breedInfo.weight) || '—'}</div>
                </div>
                <div className="detail-spec">
                  <div className="detail-spec-label">{t.origin}</div>
                  <div className="detail-spec-value text-sm">{breedOrigin}</div>
                </div>
                <div className="detail-spec">
                  <div className="detail-spec-label">{language === 'en' ? 'Region' : 'क्षेत्र'}</div>
                  <div className="detail-spec-value">{breedRegion}</div>
                </div>
              </div>
            </div>

            {/* Right: Modern Image Card */}
            <div className={`w-full lg:w-[450px] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative p-3 bg-[var(--card)] border border-[var(--border)] rounded-[3rem] shadow-2xl overflow-hidden ring-8 ring-[var(--accent)]/5">
                <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5]">
                  <img
                    src={breedInfo.image}
                    alt={finalBreed}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/20 shadow-xl">
                  🐄
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Characteristics */}
            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="detail-section-title">
                <i className="fa-solid fa-star text-[var(--accent)]"></i> {t.keyCharacteristics}
              </h2>
              <div className="grid gap-4">
                {Array.isArray(getText(breedInfo.characteristics)) && getText(breedInfo.characteristics).map((char, i) => (
                  <div key={i} className="detail-list-item">
                    <div className="detail-list-item-icon">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div className="text-[var(--text)] font-semibold">{char}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Care & Health sections */}
            <div className={`space-y-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Care Requirements */}
              <div>
                <h2 className="detail-section-title">
                  <i className="fa-solid fa-heart text-[var(--accent)]"></i> {t.careRequirements}
                </h2>
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm">
                  <div className="space-y-8">
                    {Array.isArray(breedInfo.careRequirements) && breedInfo.careRequirements.length > 0 ? (
                      breedInfo.careRequirements.map((care, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                            <i className="fa-solid fa-circle-check text-lg"></i>
                          </div>
                          <div>
                            <h4 className="font-black text-[var(--text)] text-lg mb-1">{getText(care.title)}</h4>
                            <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                              {getText(care.description)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : breedData[finalBreed] ? (
                      <>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                            <i className="fa-solid fa-droplet text-lg"></i>
                          </div>
                          <div>
                            <h4 className="font-black text-[var(--text)] text-lg mb-1">{language === 'en' ? 'Hydration' : 'जलीकरण'}</h4>
                            <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                              {language === 'en'
                                ? 'Requires 40-70 liters of clean, fresh water daily. Consumption increases significantly during peak summer or lactation.'
                                : 'प्रतिदिन 40-70 लीटर स्वच्छ, ताजे पानी की आवश्यकता होती है। गर्मी या स्तनपान के दौरान खपत काफी बढ़ जाती है।'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shrink-0">
                            <i className="fa-solid fa-wheat-awn text-lg"></i>
                          </div>
                          <div>
                            <h4 className="font-black text-[var(--text)] text-lg mb-1">{language === 'en' ? 'Nutrition' : 'पोषण'}</h4>
                            <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                              {language === 'en'
                                ? 'Balanced diet of green fodder, dry roughage, and mineral mixtures is critical for maintaining health and productivity.'
                                : 'स्वास्थ्य और उत्पादकता बनाए रखने के लिए हरे चारे, सूखे चारे और खनिज मिश्रण का संतुलित आहार महत्वपूर्ण है।'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0">
                            <i className="fa-solid fa-house text-lg"></i>
                          </div>
                          <div>
                            <h4 className="font-black text-[var(--text)] text-lg mb-1">{language === 'en' ? 'Shelter' : 'आश्रय'}</h4>
                            <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                              {language === 'en'
                                ? 'Well-ventilated housing with proper drainage and dry bedding to prevent hoof diseases and respiratory issues.'
                                : 'खुर के रोगों और श्वसन संबंधी समस्याओं को रोकने के लिए उचित जल निकासी और सूखे बिस्तरों वाला हवादार आवास।'}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-[var(--muted)] italic">
                        {language === 'en' ? 'No care requirements listed for this breed.' : 'इस नस्ल के लिए कोई देखभाल आवश्यकताएं सूचीबद्ध नहीं हैं।'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Health Considerations */}
              <div>
                <h2 className="detail-section-title">
                  <i className="fa-solid fa-staff-snake text-[var(--accent)]"></i> {t.healthConsiderations}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.isArray(breedInfo.healthConsiderations) && breedInfo.healthConsiderations.length > 0 ? (
                    breedInfo.healthConsiderations.map((health, i) => (
                      <div key={i} className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl flex items-start gap-5 hover:border-red-500/30 transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0 shadow-sm">
                          <i className="fa-solid fa-notes-medical text-lg"></i>
                        </div>
                        <div>
                          <h5 className="font-black text-[var(--text)] text-base mb-1">{getText(health.title)}</h5>
                          <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">{getText(health.description)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl flex items-start gap-5 hover:border-red-500/30 transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0 shadow-sm">
                          <i className="fa-solid fa-temperature-arrow-up text-lg"></i>
                        </div>
                        <div>
                          <h5 className="font-black text-[var(--text)] text-base mb-1">{language === 'en' ? 'Vaccination' : 'टीकाकरण'}</h5>
                          <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                            {language === 'en' ? 'Regular FMD, HS, and BQ shots are mandatory for survival and productivity.' : 'जीवित रहने और उत्पादकता के लिए नियमित एफएमडी, एचएस और बीक्यू टीके अनिवार्य हैं।'}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl flex items-start gap-5 hover:border-red-500/30 transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                          <i className="fa-solid fa-bug-slash text-lg"></i>
                        </div>
                        <div>
                          <h5 className="font-black text-[var(--text)] text-base mb-1">{language === 'en' ? 'Deworming' : 'कृमिनाशक'}</h5>
                          <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                            {language === 'en' ? 'Bi-annual internal and external parasite control to maintain body weight.' : 'शरीर का वजन बनाए रखने के लिए अर्ध-वार्षिक आंतरिक और बाहरी परजीवी नियंत्रण।'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[3.5rem] p-12 bg-gradient-to-br from-[var(--accent)] to-emerald-800 text-white text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">{t.ownBreedCTA}</h2>
            <p className="text-xl text-white/80 font-medium mb-12 max-w-2xl mx-auto">
              {t.ownBreedDesc}
            </p>
            <button
              onClick={() => navigate('/predict')}
              className="bg-white text-[var(--accent)] px-12 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-transform shadow-2xl flex items-center gap-4 mx-auto"
            >
              <i className="fa-solid fa-camera-retro"></i> {t.identify}
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Related Breeds */}
      <section className="py-24 px-6 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="section-label mb-3">{t.moreToExplore}</div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text)]">{t.relatedBreeds}</h2>
            </div>
            <button
              onClick={() => { navigate('/breeds'); window.scrollTo(0, 0); }}
              className="text-[var(--accent)] font-black flex items-center gap-3 group text-lg"
            >
              {t.viewAll} <i className="fa-solid fa-arrow-right group-hover:translate-x-3 transition-transform"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {relatedNames.map((name, i) => {
              const rb = breedData[name];
              return (
                <div
                  key={name}
                  onClick={() => { navigate(`/breed/${encodeURIComponent(name)}`); window.scrollTo(0, 0); }}
                  className={`related-card group/rc transition-all duration-700 delay-${i + 1}00 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img src={rb.image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover/rc:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/rc:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-8">
                    <div className="detail-badge mb-5 bg-[var(--accent)]/10 text-[var(--accent)] inline-block">
                      {getBreedType(rb)}
                    </div>
                    <h3 className="text-2xl font-black text-[var(--text)] mb-4">{name}</h3>
                    <p className="text-[var(--muted)] font-medium line-clamp-2 text-base leading-relaxed">
                      {getText(rb.description)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BreedInfoPage;