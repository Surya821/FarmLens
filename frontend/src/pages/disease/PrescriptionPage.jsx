import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { getDiseaseName } from '../../data/symptoms';
import { getPrescription } from '../../data/prescription';

function PrescriptionPage({ isDark, language }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [disease, setDisease] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const diseaseParam = searchParams.get('disease');

    if (diseaseParam) {
      setDisease(diseaseParam);

      // Get prescription data
      const diseasePrescription = getPrescription(diseaseParam, language);
      setPrescription(diseasePrescription);
    }

    setIsLoading(false);
  }, [location.search, language]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && prescription) {
      try {
        await navigator.share({
          title: prescription.diseaseName[language],
          text: `${t.sharingTitle} ${prescription.diseaseName[language]}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `${prescription.diseaseName[language]}\n\n${prescription.overview[language]}\n\n${window.location.href}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert(t.linkCopied);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t.loadingPrescription}
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen pb-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate(-1)}
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.goBack}
          </button>

          <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {t.noDiseaseSelected}
            </h3>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.predictDiseaseFirst}
            </p>
            <button
              onClick={() => navigate('/disease')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              {t.predictDisease}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Severity color mapping
  const severityColors = {
    'Very High': 'bg-red-100 text-red-800 border-red-300',
    'High': 'bg-orange-100 text-orange-800 border-orange-300',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Low': 'bg-green-100 text-green-800 border-green-300',
    'Unknown': 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const severityColor = severityColors[prescription.severity] || severityColors['Unknown'];

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f0faf3]'}`}>
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
              <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
            </div>
            <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 w-10 h-10 rounded-xl transition-all hover:scale-110 active:scale-95 bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] flex items-center justify-center shadow-sm"
            >
              <i className="fa-solid fa-share-nodes"></i>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-black bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-lg shadow-green-500/20"
            >
              <i className="fa-solid fa-print"></i>
              {t.printReport}
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-black text-[10px] uppercase tracking-widest mb-4">
            <i className="fa-solid fa-file-medical"></i> {t.diagnosticReport}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
            {prescription.diseaseName[language]}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-[var(--muted)]">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${prescription.severity === 'Very High' || prescription.severity === 'High'
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : 'bg-green-500/10 text-green-500 border-green-500/20'
              }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {t.severity}: {
                prescription.severity === 'Very High' ? t.veryHigh :
                  prescription.severity === 'High' ? t.high :
                    prescription.severity === 'Medium' ? t.medium :
                      prescription.severity === 'Low' ? t.low :
                        prescription.severity
              }
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-clock opacity-60"></i>
              {prescription.recoveryTime[language]}
            </div>
          </div>
        </div>

        {/* Diagnostic Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up delay-1">
          {/* Main Info Box */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-circle-info"></i> {t.quickOverview}
                  </h4>
                  <p className="text-xl font-bold leading-relaxed text-[var(--text)]">
                    {prescription.overview[language]}
                  </p>
                </div>

                <div className={`shrink-0 p-6 rounded-[2rem] border min-w-[240px] ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50 mb-4">{t.veterinaryRequirement}</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${prescription.veterinarianRequired ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      <i className={`fa-solid ${prescription.veterinarianRequired ? 'fa-user-doctor' : 'fa-house-chimney-medical'} text-xl`}></i>
                    </div>
                    <div>
                      <p className="font-black text-sm">{prescription.veterinarianRequired ? t.immediateCare : t.homeObservation}</p>
                      <p className="text-[10px] text-[var(--muted)] font-bold">{prescription.veterinarianRequired ? t.professionalDoctorRequired : t.monitorAnimalCarefully}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Treatment */}
              <div className="bg-green-500/5 border border-green-500/10 rounded-[2.5rem] p-8 shadow-sm">
                <h4 className="text-lg font-black mb-6 flex items-center gap-3 text-green-600 dark:text-green-400">
                  <i className="fa-solid fa-hand-holding-medical"></i> {t.recommendedTreatment}
                </h4>
                <div className="space-y-4">
                  {prescription.treatment[language]?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                      <div className="w-6 h-6 rounded-lg bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-[10px]"></i>
                      </div>
                      <span className="text-sm font-bold text-[var(--text)] leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-[2.5rem] p-8 shadow-sm">
                <h4 className="text-lg font-black mb-6 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                  <i className="fa-solid fa-shield-virus"></i> {t.preventionProtocol}
                </h4>
                <div className="space-y-4">
                  {prescription.prevention[language]?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                      <div className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fa-solid fa-shield text-[10px]"></i>
                      </div>
                      <span className="text-sm font-bold text-[var(--text)] leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Symptoms Card */}
            <div className="bg-[var(--surface)] border-2 border-dashed border-[var(--border)] rounded-[2.5rem] p-8">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] opacity-60 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-list-ul"></i> {t.clinicalSymptoms}
              </h4>
              <div className="space-y-3">
                {prescription.symptoms[language]?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl group transition-all hover:border-yellow-500">
                    <span className="w-5 h-5 rounded-full bg-yellow-500/10 text-yellow-600 flex items-center justify-center shrink-0 font-black text-[10px] group-hover:bg-yellow-500 group-hover:text-white transition-colors">{index + 1}</span>
                    <span className="text-xs font-black text-[var(--text)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Causes Card */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-lg">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] opacity-60 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-flask-vial"></i> {t.probableCauses}
              </h4>
              <div className="space-y-3">
                {prescription.causes[language]?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl group transition-all hover:border-orange-500">
                    <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 font-black text-[10px] group-hover:bg-orange-500 group-hover:text-white transition-colors">{index + 1}</span>
                    <span className="text-xs font-black text-[var(--text)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Floating Box */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-xl shadow-red-500/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl rounded-full"></div>
              <h4 className="text-sm font-black text-red-500 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation animate-pulse"></i> {t.emergencyProtocol}
              </h4>
              <p className="text-sm font-black leading-relaxed text-red-900/70 dark:text-red-300">
                {prescription.emergency[language]}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="max-w-4xl mx-auto text-center opacity-30 font-black uppercase tracking-[0.2em] text-[10px] space-y-2 mt-16 print:text-black print:opacity-100">
          <p>{t.reportGeneratedOn} {new Date().toLocaleString()}</p>
          <p className="max-w-xl mx-auto italic">{t.prescriptionDisclaimer}</p>
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:py-4 { padding: 1rem !important; }
          body { background: white !important; color: black !important; }
          .glass, .glass-dark { background: white !important; border: 1px solid #ddd !important; box-shadow: none !important; }
          h1, h2, h3, h4 { color: black !important; }
          svg { stroke: black !important; }
          .print\\:text-black { color: black !important; }
          .rounded-[2.5rem], .rounded-[3rem], .rounded-3xl { border-radius: 0 !important; }
        }
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default PrescriptionPage;