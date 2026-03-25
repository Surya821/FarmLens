import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { Activity, Clock, ShieldAlert, Heart, Sparkles, ShieldCheck, ChevronLeft, Share2, AlertTriangle } from 'lucide-react';

function DiseaseInfoPage({ isDark, language }) {
  const { diseaseId } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    fetchDiseaseDetails();
    window.scrollTo(0, 0);
  }, [diseaseId]);

  const fetchDiseaseDetails = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/diseases`);
      const data = await res.json();
      const found = data.find(d => d._id === diseaseId);
      if (found) {
        setDisease(found);
      }
    } catch (error) {
      console.error('Failed to fetch disease details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
        <div className="w-16 h-16 border-4 border-red-500/10 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!disease) {
    return (
      <div className={`min-h-screen pt-32 px-6 text-center ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
        <h2 className="text-3xl font-black mb-4">Resource Not Found</h2>
        <button onClick={() => navigate('/diseases')} className="px-8 py-3 bg-red-500 text-white rounded-2xl font-black uppercase">Back to Registry</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'dark bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      {/* Immersive Dynamic Header */}
      <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
        {disease.image ? (
          <img src={disease.image} alt={disease.name?.en} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-rose-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/20 to-transparent" />
        
        {/* Navigation Actions - Full Width */}
        <div className="absolute top-24 left-6 right-6 md:left-10 md:right-10 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)}
            className="hidden sm:flex w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-red-500 transition-all shadow-2xl"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
             <button className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-red-500 transition-all">
                <Share2 size={20} />
             </button>
          </div>
        </div>

        {/* Immersive Title Block - Full Width */}
        <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10 z-20">
           <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 font-black uppercase tracking-widest text-[10px] shadow-lg ${getSeverityStyles(disease.severity)}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {disease.severity} Severity Profile
           </div>
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-[var(--text)] leading-[0.8] drop-shadow-2xl">
              {disease.name?.[language] || disease.name?.en}
           </h1>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 mt-8 space-y-8">
         {/* Panoramic Data Bar */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatItem 
              icon={<Clock size={20} />} 
              label={language === 'en' ? 'Recovery Time' : 'रिकवरी समय'}
              value={disease.recoveryTime?.[language] || disease.recoveryTime?.en} 
            />
            <StatItem 
              icon={<ShieldAlert size={20} />} 
              label={language === 'en' ? 'Threat Level' : 'खतरे का स्तर'}
              value={disease.severity} 
              highlight 
            />
            <StatItem 
              icon={<Heart size={20} />} 
              label={language === 'en' ? 'Care Urgency' : 'देखभाल की तत्परता'}
              value={disease.severity === 'Critical' ? (language === 'en' ? 'Immediate Vet' : 'तत्काल पशु चिकित्सक') : (language === 'en' ? 'Professional Monitor' : 'प्रोफेशनल मॉनिटर')} 
            />
         </div>

         {/* Full-Width Overview Card */}
         <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden group hover:border-red-500/20 transition-all">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                     <Activity size={24} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.3em]">{language === 'en' ? 'Clinical Overview' : 'नैदानिक विवरण'}</h2>
               </div>
               <p className="text-xl md:text-2xl font-bold leading-normal text-[var(--text)]/90">
                 {disease.overview?.[language] || disease.overview?.en}
               </p>
            </div>
         </div>

         {/* Wide Matrix Grid: Symptoms, Causes, Treatment, Prevention */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard 
               title={language === 'en' ? 'Symptoms' : 'लक्षण'}
               icon={<Activity size={20} />}
               items={disease.symptoms}
               language={language}
               color="red"
            />
            <InfoCard 
               title={language === 'en' ? 'Causes' : 'कारण'}
               icon={<AlertTriangle size={20} />}
               items={disease.causes}
               language={language}
               color="amber"
            />
            <InfoCard 
                title={language === 'en' ? 'Treatment' : 'उपचार'}
               icon={<Sparkles size={20} />}
               items={disease.treatment}
               language={language}
               color="blue"
            />
            <InfoCard 
               title={language === 'en' ? 'Prevention' : 'रोकथाम'}
               icon={<ShieldCheck size={20} />}
               items={disease.prevention}
               language={language}
               color="green"
            />
         </div>

         {/* Emergency Response Dashboard Strip */}
         <div className="w-full bg-red-500/5 border-2 border-dashed border-red-500/20 rounded-[3rem] p-8 md:p-14 flex flex-col xl:flex-row items-center justify-between gap-10 group">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 rounded-3xl bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/30 scale-110">
                  <AlertTriangle size={40} />
               </div>
               <div>
                  <h4 className="text-3xl font-black mb-2 tracking-tighter italic">CRITICAL RESPONSE PROTOCOL</h4>
                  <p className="text-lg font-medium text-[var(--muted)] max-w-2xl leading-relaxed">
                    {disease.severity === 'Critical' || disease.severity === 'High'
                      ? 'Biosecurity alert triggered. This condition requires immediate qualified veterinary intervention. Lockdown premises and isolate affected livestock immediately.'
                      : 'Maintain strict monitoring. If secondary symptoms manifest or recovery markers are not met within 48 hours, escalate to professional veterinary services.'}
                  </p>
               </div>
            </div>
            <button className="px-12 py-6 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-xl shadow-red-600/30 shrink-0 hover:scale-105 active:scale-95">
               Contact Emergency Vet
            </button>
         </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, items, language, color }) {
  const colorMap = {
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20'
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 hover:border-[var(--muted)]/20 transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">{title}</h3>
      </div>

      <div className="space-y-6">
        {items?.map((item, i) => (
          <div key={i} className="group/item">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1" />
               <h4 className="font-extrabold text-[var(--text)] leading-tight group-hover/item:text-red-500 transition-colors">
                  {item.title?.[language] || item.title?.en}
               </h4>
            </div>
            <p className="text-xs font-medium text-[var(--muted)] leading-relaxed pl-[1.125rem]">
               {item.description?.[language] || item.description?.en}
            </p>
          </div>
        ))}
        {(!items || items.length === 0) && <p className="text-xs italic text-[var(--muted)]">No data available for this section.</p>}
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--border)] shadow-sm ${highlight ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50 mb-1">{label}</p>
        <p className="text-sm font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export default DiseaseInfoPage;
