import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { prescriptionData } from '../../data/prescription';
import { Search, Activity, ShieldAlert, Heart, Info, ChevronRight, AlertCircle } from 'lucide-react';

function DiseasesPage({ isDark, language }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [dynamicDiseases, setDynamicDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    fetchDynamicDiseases();
    window.scrollTo(0, 0);
  }, []);

  const fetchDynamicDiseases = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/diseases`);
      const data = await res.json();
      setDynamicDiseases(data);
    } catch (error) {
      console.error('Failed to fetch dynamic diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  const allDiseases = useMemo(() => {
    // Transform static data to match dynamic structure for consistent UI
    const staticEntries = Object.entries(prescriptionData).map(([key, data]) => ({
      _id: `static-${key}`,
      slug: key,
      name: data.diseaseName,
      severity: data.severity,
      overview: data.overview,
      recoveryTime: data.recoveryTime,
      isStatic: true
    }));

    // Filter out dynamic diseases that already exist as static slugs (to avoid duplicates)
    // In a real scenario, we might want to merge them, but for now, duplicates are unlikely.
    return [...staticEntries, ...dynamicDiseases];
  }, [dynamicDiseases]);

  const filteredDiseases = allDiseases.filter(disease => {
    const searchTerm = searchQuery.toLowerCase();
    const nameEn = (disease.name?.en || '').toLowerCase();
    const nameHi = (disease.name?.hi || '');

    const matchesSearch = nameEn.includes(searchTerm) || nameHi.includes(searchTerm);
    const matchesSeverity = !severityFilter || disease.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500 text-white shadow-red-500/20';
      case 'high': return 'bg-orange-500 text-white shadow-orange-500/20';
      case 'medium': return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'low': return 'bg-green-500 text-white shadow-green-500/20';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
              <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
            </div>
            <span className="text-sm uppercase tracking-widest">{t?.back || 'Back'}</span>
          </button>
          <div className="text-[var(--accent)] font-black text-sm tracking-widest uppercase">
            <i className="fa-solid fa-book-medical mr-2"></i> {language === 'en' ? 'Veterinary Registry' : 'पशु चिकित्सा रजिस्ट्री'}
          </div>
        </div>

        {/* Hero Section Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-teal-500">
            {language === 'en' ? 'Explore Diseases' : 'रोगों का अन्वेषण करें'}
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Explore our comprehensive database of livestock diseases, clinical symptoms, and prevention protocols.'
              : 'पशु रोगों, नैदानिक ​​लक्षणों और रोकथाम प्रोटोकॉल के हमारे व्यापक डेटाबेस का पता लगाएं।'}
          </p>
        </div>
      </div>

      <section className="py-6 px-6 relative z-40 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            {/* Search */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-6 flex items-center text-[var(--muted)] group-focus-within:text-red-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={language === 'en' ? 'Search diseases...' : 'रोग खोजें...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-4 bg-[var(--card)] border-2 border-[var(--border)] rounded-[2rem] outline-none focus:border-red-500 transition-all font-bold text-[var(--text)] shadow-sm"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex flex-wrap gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(severityFilter === sev ? '' : sev)}
                  className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${severityFilter === sev
                    ? 'bg-red-500 text-white shadow-xl shadow-red-500/20'
                    : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:border-red-500/30'
                    }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-500/10 border-t-red-500 rounded-full animate-spin mb-6" />
              <p className="text-[var(--muted)] font-black uppercase tracking-widest text-xs">Synchronizing Database...</p>
            </div>
          ) : filteredDiseases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDiseases.map((disease, index) => (
                <div
                  key={disease._id}
                  onClick={() => navigate(disease.isStatic ? `/prescription?disease=${disease.slug}` : `/disease-info/${disease._id}`)}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 hover:border-red-500/30 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-colors" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Severity Badge */}
                    <div className={`self-start px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 shadow-lg ${getSeverityColor(disease.severity)}`}>
                      {disease.severity} Severity
                    </div>

                    <h3 className="text-2xl font-black tracking-tight mb-3 line-clamp-1 group-hover:text-red-500 transition-colors">
                      {disease.name?.[language] || disease.name?.en}
                    </h3>

                    <p className="text-sm font-medium text-[var(--muted)] line-clamp-2 mb-6 leading-relaxed">
                      {disease.overview?.[language] || disease.overview?.en}
                    </p>

                    <div className="mt-auto pt-6 border-t border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">
                        <AlertCircle size={14} className="text-amber-500" />
                        {disease.recoveryTime?.[language] || disease.recoveryTime?.en || 'N/A'}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-5xl mx-auto mb-8 grayscale opacity-50">
                🏥
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-2">No Profiles Found</h3>
              <p className="text-[var(--muted)] font-medium max-w-md mx-auto">Try refining your search or filter criteria to discover specific livestock medical entries.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DiseasesPage;
