import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { breedData } from '../../data/breedData';
import BreedCard from '../../components/BreedCard';
import BreedWorldMap from '../../components/BreedWorldMap';

function BreedsPage({ isDark, language, setSelectedBreed }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('type'); // 'type' or 'region'
  const [typeFilter, setTypeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [tempTypeFilter, setTempTypeFilter] = useState('');
  const [tempRegionFilter, setTempRegionFilter] = useState('');
  const navigate = useNavigate();
  const t = translations[language];
  const [dynamicBreeds, setDynamicBreeds] = useState([]);

  // Build the full merged list: start with hardcoded, then add DB-only breeds (not already in hardcoded)
  const allBreedEntries = React.useMemo(() => {
    const staticEntries = Object.entries(breedData).map(([name, info]) => ({ name, info }));
    const cloudOnlyEntries = dynamicBreeds
      .filter(b => !breedData[b.name])
      .map(b => ({ name: b.name, info: b, id: b._id }));
    return [...staticEntries, ...cloudOnlyEntries];
  }, [dynamicBreeds]);

  const getBreedInfo = (name) => {
    const staticBreed = breedData[name];
    if (staticBreed) return staticBreed;
    return dynamicBreeds.find(b => b.name === name);
  };

  const getBreedType = (breed) => {
    if (breed.type) return breed.type;
    const desc = (breed.description?.en || '').toLowerCase();
    if (desc.includes('dairy')) return 'Dairy';
    if (desc.includes('beef')) return 'Beef';
    if (desc.includes('dual')) return 'Dual-Purpose';
    return 'Other';
  };

  const getBreedRegion = (breed) => {
    if (breed.region) return breed.region;
    const origin = (breed.origin?.en || '').toLowerCase();
    if (origin.includes('india') || origin.includes('pakistan') || origin.includes('asia')) return 'Asia';
    if (origin.includes('scotland') || origin.includes('uk') || origin.includes('jersey') || origin.includes('europe') || origin.includes('denmark') || origin.includes('switzerland') || origin.includes('netherlands') || origin.includes('france') || origin.includes('germany')) return 'Europe';
    if (origin.includes('brazil') || origin.includes('americas') || origin.includes('usa')) return 'Americas';
    if (origin.includes('africa')) return 'Africa';
    return 'Other';
  };

  useEffect(() => {
    setIsVisible(true);
    fetchDynamicBreeds();
  }, []);

  const fetchDynamicBreeds = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/breeds`);
      const data = await res.json();
      setDynamicBreeds(data);
    } catch (error) {
      console.error('Failed to fetch dynamic breeds:', error);
    }
  };

  const filteredBreeds = allBreedEntries.filter(({ name, info }) => {
    if (!info) return false;
    const searchTerm = searchQuery.toLowerCase();
    const originText = ((info.origin?.[language] || info.origin?.en || '')).toLowerCase();
    const matchesSearch = name.toLowerCase().includes(searchTerm) || originText.includes(searchTerm);
    const matchesType = !typeFilter || getBreedType(info) === typeFilter;
    const matchesRegion = !regionFilter || getBreedRegion(info) === regionFilter;
    return matchesSearch && matchesType && matchesRegion;
  });

  const handleBreedClick = (breedName) => {
    setSelectedBreed(breedName);
    navigate(`/breed/${encodeURIComponent(breedName)}`);
  };

  const openFilterModal = () => {
    setTempTypeFilter(typeFilter);
    setTempRegionFilter(regionFilter);
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setTypeFilter(tempTypeFilter);
    setRegionFilter(tempRegionFilter);
    setIsFilterModalOpen(false);
  };

  const cancelFilters = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f0faf3]'}`}>
      <style>{`
        .hero-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(22,163,74,0.08) 0%, transparent 70%), 
                      radial-gradient(ellipse at 10% 80%, rgba(22,163,74,0.05) 0%, transparent 60%);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease forwards;
        }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25rem;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
              <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
            </div>
            <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
          </button>
          <div className="text-[var(--accent)] font-black text-sm tracking-widest uppercase">
            <i className="fa-solid fa-cow mr-2"></i> {t.breeds}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-teal-500">
            {t.exploreBreeds}
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            {t.searchDatabaseDesc || "Discover our complete database of verified cattle breeds across the globe."}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <section className="pb-8 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-emerald-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
              <div className="relative flex items-center gap-4 px-6 py-4 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all shadow-sm">
                <i className="fa-solid fa-magnifying-glass text-[var(--muted)] text-lg"></i>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-lg font-bold placeholder:text-[var(--muted)]/30 text-[var(--text)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="w-8 h-8 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-md shadow-green-500/20"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Group - Desktop Only */}
            <div className="hidden lg:flex flex-wrap gap-4">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-6 pr-12 py-4 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl text-[var(--text)] font-black text-sm cursor-pointer outline-none hover:border-[var(--accent)] transition-all shadow-sm"
                >
                  <option value="">{language === 'en' ? 'All Types' : 'सभी प्रकार'}</option>
                  <option value="Dairy">{language === 'en' ? 'Dairy' : 'डेयरी'}</option>
                  <option value="Beef">{language === 'en' ? 'Beef' : 'बीफ'}</option>
                  <option value="Dual-Purpose">{language === 'en' ? 'Dual-Purpose' : 'दोहरे उद्देश्य'}</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="pl-6 pr-12 py-4 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl text-[var(--text)] font-black text-sm cursor-pointer outline-none hover:border-[var(--accent)] transition-all shadow-sm"
                >
                  <option value="">{language === 'en' ? 'All Regions' : 'सभी क्षेत्र'}</option>
                  <option value="Asia">{language === 'en' ? 'Asia' : 'एशिया'}</option>
                  <option value="Europe">{language === 'en' ? 'Europe' : 'यूरोप'}</option>
                  <option value="Americas">{language === 'en' ? 'Americas' : 'अमेरिका'}</option>
                  <option value="Africa">{language === 'en' ? 'Africa' : 'अफ्रीका'}</option>
                </select>
              </div>
            </div>

            {/* Filter Button - Mobile Only */}
            <div className="lg:hidden">
              <button
                onClick={openFilterModal}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all border-2 ${typeFilter || regionFilter
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                  : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)]'
                  }`}
              >
                <i className="fa-solid fa-sliders"></i>
                {language === 'en' ? 'Filter' : 'फ़िल्टर'}
                {(typeFilter || regionFilter) && (
                  <span className="w-5 h-5 rounded-full bg-white text-[var(--accent)] flex items-center justify-center text-[10px]">
                    {(typeFilter ? 1 : 0) + (regionFilter ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--muted)] text-sm font-black uppercase tracking-widest opacity-60">
              <i className="fa-solid fa-chart-simple"></i>
              <span>{t.showingBreeds} ({filteredBreeds.length})</span>
            </div>

            {(searchQuery || typeFilter || regionFilter) && (
              <button
                onClick={() => { setSearchQuery(''); setTypeFilter(''); setRegionFilter(''); }}
                className="text-[var(--accent)] text-xs font-black uppercase tracking-widest hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredBreeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBreeds.map(({ name, info, id }, index) => (
                <div key={id || name} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <BreedCard
                    breed={name}
                    breedInfo={info}
                    language={language}
                    isDark={isDark}
                    onClick={() => handleBreedClick(name)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center animate-fade-up">
              <div className="w-24 h-24 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                🔍
              </div>
              <h3 className="text-3xl font-black text-[var(--text)] mb-3 tracking-tight">
                {language === 'en' ? 'No Breeds Found' : 'कोई नस्ल नहीं मिली'}
              </h3>
              <p className="text-[var(--muted)] font-medium text-lg mb-10 max-w-md mx-auto">
                {language === 'en' ? 'We couldn\'t find any breeds matching your current search or filters.' : 'हमें आपकी वर्तमान खोज या फ़िल्टर से मेल खाने वाली कोई नस्ल नहीं मिली।'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setTypeFilter(''); setRegionFilter(''); }}
                className="px-10 py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 hover:scale-[1.05] active:scale-95 transition-all"
              >
                {t.resetSearch}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Global Map Integration */}
      <section className="py-24 px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-black text-[10px] uppercase tracking-widest mb-4">
              <i className="fa-solid fa-earth-asia"></i> {t.globalOriginMap}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-[var(--text)]">
              {t.whereBreedsComeFrom}
            </h2>
          </div>
          <div className="rounded-[3rem] overflow-hidden border-2 border-[var(--border)] shadow-2xl bg-[var(--card)] p-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="rounded-[2.5rem] overflow-hidden relative z-10">
              <BreedWorldMap isDark={isDark} language={language} />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Modal - Mobile Only */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--surface)] w-full sm:max-w-2xl sm:rounded-[2.5rem] h-[80vh] sm:h-auto overflow-hidden border-t sm:border border-[var(--border)] flex flex-col animate-fade-up">
            <div className="px-6 py-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
              <h3 className="text-xl font-black text-[var(--text)]">{language === 'en' ? 'Filter Breeds' : 'नस्ल फ़िल्टर'}</h3>
              <button 
                onClick={cancelFilters}
                className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all outline-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-1/3 border-r border-[var(--border)] bg-[var(--bg)]/30">
                <button
                  onClick={() => setActiveFilterTab('type')}
                  className={`w-full px-6 py-6 text-left font-black text-xs uppercase tracking-widest transition-all ${activeFilterTab === 'type' 
                    ? 'bg-[var(--card)] text-[var(--accent)] border-r-4 border-[var(--accent)]' 
                    : 'text-[var(--muted)] opacity-60'}`}
                >
                  {language === 'en' ? 'Types' : 'प्रकार'}
                </button>
                <button
                  onClick={() => setActiveFilterTab('region')}
                  className={`w-full px-6 py-6 text-left font-black text-xs uppercase tracking-widest transition-all ${activeFilterTab === 'region' 
                    ? 'bg-[var(--card)] text-[var(--accent)] border-r-4 border-[var(--accent)]' 
                    : 'text-[var(--muted)] opacity-60'}`}
                >
                  {language === 'en' ? 'Regions' : 'क्षेत्र'}
                </button>
              </div>

              {/* Selection Area */}
              <div className="w-2/3 p-6 bg-[var(--card)] overflow-y-auto custom-scrollbar">
                {activeFilterTab === 'type' ? (
                  <div className="space-y-3">
                    {['', 'Dairy', 'Beef', 'Dual-Purpose'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTempTypeFilter(type)}
                        className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between transition-all ${tempTypeFilter === type
                          ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)] font-black'
                          : 'border-transparent bg-[var(--bg)]/50 text-[var(--muted)]/60 font-bold hover:border-[var(--border)]'
                        }`}
                      >
                        <span>{type === '' ? (language === 'en' ? 'All Types' : 'सभी प्रकार') : (language === 'en' ? type : (type === 'Dairy' ? 'डेयरी' : type === 'Beef' ? 'बीफ' : 'दोहरे उद्देश्य'))}</span>
                        {tempTypeFilter === type && <i className="fa-solid fa-circle-check text-xs"></i>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {['', 'Asia', 'Europe', 'Americas', 'Africa'].map((region) => (
                      <button
                        key={region}
                        onClick={() => setTempRegionFilter(region)}
                        className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between transition-all ${tempRegionFilter === region
                          ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)] font-black'
                          : 'border-transparent bg-[var(--bg)]/50 text-[var(--muted)]/60 font-bold hover:border-[var(--border)]'
                        }`}
                      >
                        <span>{region === '' ? (language === 'en' ? 'All Regions' : 'सभी क्षेत्र') : (language === 'en' ? region : (region === 'Asia' ? 'एशिया' : region === 'Europe' ? 'यूरोप' : region === 'Americas' ? 'अमेरिका' : 'अफ्रीका'))}</span>
                        {tempRegionFilter === region && <i className="fa-solid fa-circle-check text-xs"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] flex gap-4">
              <button 
                onClick={cancelFilters}
                className="flex-1 py-4 bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] rounded-2xl font-black text-sm active:scale-95 transition-all"
              >
                {t.cancel || 'Cancel'}
              </button>
              <button 
                onClick={applyFilters}
                className="flex-1 py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-sm shadow-lg shadow-green-500/20 active:scale-95 transition-all"
              >
                {t.save || 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BreedsPage;