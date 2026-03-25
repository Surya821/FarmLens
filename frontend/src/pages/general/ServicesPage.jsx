import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';

function ServicesPage({ isDark, language }) {
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen pb-20 pt-10 transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f9faf8]'}`}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </div>
          <span className="text-sm uppercase tracking-widest">{language === 'en' ? 'Back' : 'पीछे'}</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="section-label mb-4 inline-flex items-center gap-2 px-4 py-1.5 bg-[#16a34a1a] text-[#16a34a] rounded-full text-xs font-black uppercase tracking-widest">
            <i className="fa-solid fa-wand-magic-sparkles"></i> {t.ourServices}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-emerald-600">
            {t.powerfulAiTools}
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
            {t.aiServicesRevolutionize}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* Service 1 - Breed Prediction */}
          <div
            onClick={() => navigate('/predict')}
            className="service-card p-10 text-left h-full flex flex-col"
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
            <p className="text-[var(--muted)] text-sm font-medium leading-relaxed mb-10 flex-grow">
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
            className="service-card service-card-red p-10 text-left border-red-500/10 hover:border-red-500/30 h-full flex flex-col"
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
            <p className="text-[var(--muted)] text-sm font-medium leading-relaxed mb-10 flex-grow">
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

          {/* Service 3 - Symptom AI */}
          <div
            onClick={() => navigate('/disease')}
            className="service-card service-card-blue p-10 text-left h-full flex flex-col"
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
            <p className="text-[var(--muted)] text-sm font-medium leading-relaxed mb-10 flex-grow">
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

        {/* Call to Action */}
        <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">{t.needMoreSpecializedHelp}</h2>
              <p className="text-[var(--muted)] font-medium mb-8 max-w-xl mx-auto">
                {t.veterinaryCommunitySupport}
              </p>
              <button 
                onClick={() => navigate('/membership')}
                className="btn-primary-new px-10 py-4 text-lg"
              >
                {t.exploreMembership}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
