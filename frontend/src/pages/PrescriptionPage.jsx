import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';
import { getDiseaseName } from '../data/symptoms';
import { getPrescription } from '../data/prescription';

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
          text: `${language === 'en' ? 'Cattle Disease Prescription for:' : 'पशु रोग प्रिस्क्रिप्शन:'} ${prescription.diseaseName[language]}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `${prescription.diseaseName[language]}\n\n${prescription.overview[language]}\n\n${window.location.href}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert(language === 'en' ? 'Link copied to clipboard!' : 'लिंक क्लिपबोर्ड पर कॉपी हो गया!');
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Loading prescription...' : 'प्रिस्क्रिप्शन लोड हो रहा है...'}
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
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 ${
              isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Go Back' : 'वापस जाएं'}
          </button>

          <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {language === 'en' ? 'No Disease Selected' : 'कोई रोग चयनित नहीं है'}
            </h3>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'en' 
                ? 'Please go back and predict a disease first.' 
                : 'कृपया वापस जाएं और पहले एक रोग की भविष्यवाणी करें।'}
            </p>
            <button
              onClick={() => navigate('/disease')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              {language === 'en' ? 'Predict Disease' : 'रोग की भविष्यवाणी करें'}
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
    <div className="min-h-screen pb-20 print:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-12 print:py-4">
        {/* Header with actions */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Go Back' : 'वापस जाएं'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDark ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              } transition`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {language === 'en' ? 'Share' : 'शेयर करें'}
            </button>
            
            <button
              onClick={handlePrint}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDark ? 'bg-purple-700 text-white hover:bg-purple-600' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              } transition`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {language === 'en' ? 'Print' : 'प्रिंट करें'}
            </button>
          </div>
        </div>

        {/* Prescription Header */}
        <div className={`rounded-lg p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg print:shadow-none`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {prescription.diseaseName[language]}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColor} ${isDark ? severityColor.replace('bg-', 'dark:bg-') : ''}`}>
                  {language === 'en' ? 'Severity:' : 'गंभीरता:'} {prescription.severity}
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Veterinarian Required:' : 'पशु चिकित्सक आवश्यक:'} 
                  <span className={`ml-1 font-semibold ${prescription.veterinarianRequired ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-green-400' : 'text-green-600')}`}>
                    {prescription.veterinarianRequired ? (language === 'en' ? 'Yes' : 'हाँ') : (language === 'en' ? 'No' : 'नहीं')}
                  </span>
                </span>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
              <p className="font-semibold">
                {language === 'en' ? 'Recovery Time:' : 'स्वास्थ्य लाभ समय:'}
              </p>
              <p>{prescription.recoveryTime[language]}</p>
            </div>
          </div>

          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/30 border border-blue-600' : 'bg-blue-50 border border-blue-300'}`}>
            <h4 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'en' ? 'Disease Overview' : 'रोग अवलोकन'}
            </h4>
            <p className={`${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              {prescription.overview[language]}
            </p>
          </div>
        </div>

        {/* Main Prescription Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Symptoms */}
          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h4 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'en' ? 'Common Symptoms' : 'सामान्य लक्षण'}
            </h4>
            <ul className="space-y-3">
              {prescription.symptoms[language]?.map((symptom, index) => (
                <li key={index} className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                    isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {index + 1}
                  </span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h4 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {language === 'en' ? 'Causes' : 'कारण'}
            </h4>
            <ul className="space-y-3">
              {prescription.causes[language]?.map((cause, index) => (
                <li key={index} className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                    isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {index + 1}
                  </span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment */}
          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h4 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {language === 'en' ? 'Treatment' : 'उपचार'}
            </h4>
            <ul className="space-y-3">
              {prescription.treatment[language]?.map((treatment, index) => (
                <li key={index} className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                    isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    ✓
                  </span>
                  <span>{treatment}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h4 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
              </svg>
              {language === 'en' ? 'Prevention' : 'रोकथाम'}
            </h4>
            <ul className="space-y-3">
              {prescription.prevention[language]?.map((prevention, index) => (
                <li key={index} className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                    isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    🛡️
                  </span>
                  <span>{prevention}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Warning */}
        <div className={`mb-8 rounded-lg p-6 ${isDark ? 'bg-red-900/30 border border-red-600' : 'bg-red-50 border border-red-300'} shadow-lg`}>
          <div className="flex items-start">
            <svg className="w-8 h-8 text-red-500 mt-0.5 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                {language === 'en' ? '⚠️ Emergency Instructions' : '⚠️ आपातकालीन निर्देश'}
              </h4>
              <p className={`text-lg mb-3 ${isDark ? 'text-red-200' : 'text-red-800'}`}>
                {prescription.emergency[language]}
              </p>
              <div className="mt-4 p-4 rounded-lg bg-black/20">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {language === 'en' 
                    ? 'Remember: This information is for educational purposes. Always consult with a qualified veterinarian for proper diagnosis and treatment.' 
                    : 'याद रखें: यह जानकारी शैक्षिक उद्देश्यों के लिए है। उचित निदान और उपचार के लिए हमेशा योग्य पशु चिकित्सक से परामर्श करें।'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'en' 
              ? 'This prescription was generated based on your symptom selection. Last updated: ' + new Date().toLocaleDateString() 
              : 'यह प्रिस्क्रिप्शन आपके लक्षण चयन के आधार पर तैयार की गई है। अंतिम अपडेट: ' + new Date().toLocaleDateString('hi-IN')}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:py-4 {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          .border {
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PrescriptionPage;