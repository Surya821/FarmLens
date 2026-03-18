import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { breedData } from '../../data/breedData';
import BreedCard from '../../components/BreedCard';
import BreedWorldMap from '../../components/BreedWorldMap';
// import logo from '../../assets/logo.svg";

function HomePage({ isDark, language, setSelectedBreed }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const t = translations[language];
  const breeds = Object.keys(breedData);

  const filteredBreeds = breeds.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Always show first 6 breeds on home page (static)
  const displayedBreeds = breeds.slice(0, 3);
  const hasMoreBreeds = breeds.length > 6;

  const handleBreedClick = (breed) => {
    console.log('Navigating to breed:', breed);
    setSelectedBreed(breed);
    // Navigate to breed info page with properly encoded URL
    navigate(`/breed/${encodeURIComponent(breed)}`);
  };

  const handleSuggestionClick = (breed) => {
    console.log('Suggestion clicked:', breed);
    // Clear search and hide dropdown
    setSearchQuery('');
    setShowSuggestions(false);
    // Navigate to the breed page
    handleBreedClick(breed);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  // Helper function to get origin text
  const getOriginText = (breed) => {
    const origin = breedData[breed]?.origin;
    if (!origin) return '';
    return typeof origin === 'object' ? origin[language] || origin.en : origin;
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Hero Section */}
      <section className="hero-section py-10 px-4">
        <div className="hero-gradient"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column */}
            <div>
              <div className="hero-badge fade-up mb-5">
                <i className="fa-solid fa-circle text-[6px] text-[var(--accent)] mr-2"></i>
                {t.heroTitle}
              </div>
              <h1 className="fade-up delay-1 text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
                {t.smartFarmingStarts}<br />
                <span className="text-[var(--accent)]">FarmLens</span>
              </h1>
              <p className="fade-up delay-2 text-[var(--muted)] text-lg font-medium leading-relaxed mb-10 max-w-lg">
                {t.heroSubtitle}
              </p>

              <div className="fade-up delay-3 flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => navigate('/services')}
                  className="btn-primary-new text-base px-10"
                >
                  <i className="fa-solid fa-microscope mr-2"></i> {t.services || 'Services'}
                </button>
              </div>

              {/* Quick stats row */}
              <div className="fade-up delay-4 flex gap-8">
                <div>
                  <div className="text-2xl font-black text-[var(--accent)]">58+</div>
                  <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">{t.verifiedBreeds}</div>
                </div>
                <div className="w-[1px] bg-[var(--border)]"></div>
                <div>
                  <div className="text-2xl font-black text-[var(--accent)]">98%</div>
                  <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">{t.aiPrecision}</div>
                </div>
                <div className="w-[1px] bg-[var(--border)]"></div>
                <div>
                  <div className="text-2xl font-black text-[var(--accent)]">93+</div>
                  <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">{t.symptomNodes}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-[24px] p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[radial-gradient(circle,_rgba(22,163,74,0.15),_transparent)] rounded-full"></div>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#16a34a] to-[#4ade80] rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    🐄
                  </div>
                  <div>
                    <div className="font-extrabold text-xl">Holstein Friesian</div>
                    <div className="text-[var(--muted)] text-sm font-semibold">High-yield dairy breed</div>
                  </div>
                  <div className="ml-auto">
                    <span className="breed-tag">AI Match</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="breed-stat-new text-center p-3">
                    <div className="font-black text-[var(--accent)] text-lg">25–35L</div>
                    <div className="text-[var(--muted)] text-[10px] font-bold uppercase tracking-wider">Milk/Day</div>
                  </div>
                  <div className="breed-stat-new text-center p-3">
                    <div className="font-black text-[var(--accent)] text-lg">650kg</div>
                    <div className="text-[var(--muted)] text-[10px] font-bold uppercase tracking-wider">Avg Weight</div>
                  </div>
                  <div className="breed-stat-new text-center p-3">
                    <div className="font-black text-[var(--accent)] text-lg">🇳🇱 NL</div>
                    <div className="text-[var(--muted)] text-[10px] font-bold uppercase tracking-wider">Origin</div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm">AI Confidence Score</span>
                    <span className="font-black text-[var(--accent)]">97.4%</span>
                  </div>
                  <div className="h-2.5 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div className="h-full w-[97.4%] bg-gradient-to-r from-[#16a34a] to-[#4ade80] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-label mb-3">
            <i className="fa-solid fa-magnifying-glass mr-2"></i> {t.breedExplorer}
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            {t.findBreedInstantly}
          </h2>
          <p className="text-[var(--muted)] text-sm font-medium mb-8">
            {t.searchDatabaseDesc}
          </p>

          <div className="relative">
            <div className="search-wrap flex items-center gap-4 px-5 py-4 shadow-lg group">
              <i className="fa-solid fa-magnifying-glass text-[var(--muted)] text-lg transition-colors group-focus-within:text-[var(--accent)]"></i>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="flex-1 text-base font-semibold border-none bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                  className="p-1 px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-xmark text-[var(--muted)]"></i>
                </button>
              )}
              <button
                className="btn-primary-new py-2 px-6 rounded-lg text-sm"
                onClick={() => navigate('/breeds')}
              >
                <i className="fa-solid fa-magnifying-glass "></i>
                <div className="max-sm:hidden">{t.search}</div>
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredBreeds.length > 0 && (
              <div className="absolute z-50 w-full mt-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto transform origin-top animate-fade-in text-left">
                {filteredBreeds.slice(0, 10).map((breed) => (
                  <div
                    key={breed}
                    onMouseDown={() => handleSuggestionClick(breed)}
                    className="px-6 py-4 flex items-center justify-between hover:bg-[var(--accent)]/5 dark:hover:bg-white/5 cursor-pointer transition-all border-l-4 border-transparent hover:border-[var(--accent)] group"
                  >
                    <div className="flex items-center gap-4">
                      <i class="fa-solid fa-cow text-green-600"></i>
                      <div>
                        <span className="font-extrabold text-base block leading-tight">{breed}</span>
                        <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">{getOriginText(breed)}</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[var(--muted)] text-xs"></i>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['Holstein', 'Gir', 'Jersey', 'Sahiwal'].map((tag) => (
              <span
                key={tag}
                onClick={() => { setSearchQuery(tag); setShowSuggestions(true); }}
                className="bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] text-[11px] font-bold px-4 py-1.5 rounded-full cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Breeds Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between mb-10 gap-6">
            <div>
              <div className="section-label">
                <i className="fa-solid fa-cow mr-2"></i> {t.featuredBreeds}
              </div>
              <h2 className="text-3xl font-black tracking-tight mt-1">{t.featuredBreedsDesc}</h2>
            </div>
            <button
              onClick={() => navigate('/breeds')}
              className="btn-outline-new py-2 px-6 text-sm"
            >
              {t.viewAllBreeds} <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBreeds.map((breed) => (
              <BreedCard
                key={breed}
                breed={breed}
                isDark={isDark}
                language={language}
                onClick={() => handleBreedClick(breed)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="section-label mb-3">
            <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> {t.ourServices}
          </div>
          <h2 className="text-3xl font-black">{t.powerfulAiTools}</h2>
          <p className="text-[var(--muted)] text-sm font-medium mt-3 mb-8">{t.aiServicesRevolutionize}</p>

          <div className="flex justify-center mb-12">
            <button
              onClick={() => navigate('/services')}
              className="btn-primary-new px-10 py-4 shadow-xl shadow-green-500/20"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> {t.exploreAllServices}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Service 1 */}
            <div
              onClick={() => navigate('/predict')}
              className="service-card p-10 text-left"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="service-icon-wrap shadow-lg">
                  <i className="fa-solid fa-camera"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1.5">{t.goToPredict}</h3>
                  <div className="breed-tag">{t.aiVisionModel}</div>
                </div>
              </div>
              <p className="text-[var(--muted)] text-sm font-medium leading-relaxed mb-10">
                {t.breedPredictionDesc}
              </p>
              <ul className="mb-10 space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-[var(--accent)]"></i> {t.instantPhotoAnalysis}</li>
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-[var(--accent)]"></i> {t.breedDatabase58}</li>
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-[var(--accent)]"></i> {t.detailedBreedReport}</li>
              </ul>
              <button className="btn-primary-new w-full justify-center">
                <i className="fa-solid fa-camera mr-2"></i> {t.goToPredict}
              </button>
            </div>

            {/* Service 2 - Skin Disease AI */}
            <div
              onClick={() => navigate('/skin-disease')}
              className="service-card service-card-red p-10 text-left border-red-500/10 hover:border-red-500/30"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="service-icon-wrap-red shadow-lg from-red-500 to-orange-600">
                  <i className="fa-solid fa-microscope"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1.5">{t.skinDiseasePredict}</h3>
                  <div className="breed-tag-red bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400">{t.skinVision}</div>
                </div>
              </div>
              <p className="text-[var(--muted)] text-sm font-medium leading-relaxed mb-10">
                {t.skinAnalysisDescRecentRecent}
              </p>
              <ul className="mb-10 space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-red-500"></i> {t.lumpySkinDetection}</li>
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-red-500"></i> {t.fmdInfectionScanning}</li>
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-red-500"></i> {t.instantDiagnosticResult}</li>
              </ul>
              <button className="btn-primary-new-red w-full justify-center">
                <i className="fa-solid fa-bolt-lightning mr-2"></i> {t.detectSkinDisease}
              </button>
            </div>

            {/* Service 3 */}
            <div
              onClick={() => navigate('/disease')}
              className="service-card service-card-blue p-10 text-left"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="service-icon-wrap-blue shadow-lg from-blue-500 to-indigo-600 bg-gradient-to-br">
                  <i className="fa-solid fa-stethoscope"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1.5">{t.diseasePredict}</h3>
                  <div className="breed-tag-blue bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400">{t.symptomAi}</div>
                </div>
              </div>
              <p className="text-[var(--muted)] text-sm font-medium leading-relaxed mb-10">
                {t.symptomAiDesc}
              </p>
              <ul className="mb-10 space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-blue-500"></i> {t.symptomNodes93}</li>
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-blue-500"></i> {t.diagnosticRules26}</li>
                <li className="flex items-center gap-3 text-sm font-bold"><i className="fa-solid fa-check-circle text-blue-500"></i> {t.treatmentGuidance}</li>
              </ul>
              <button className="btn-primary-new-blue w-full justify-center bg-blue-600 hover:bg-blue-700">
                <i className="fa-solid fa-stethoscope mr-2"></i> {t.diseasePredict}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;