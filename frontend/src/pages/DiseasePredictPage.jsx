import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';
import { getSymptomName, getDiseaseName, symptomTranslations } from '../data/symptoms';

function DiseasePredictPage({ isDark, language }) {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSymptoms, setIsFetchingSymptoms] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const t = translations[language];

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://farmlens-backend.onrender.com';

  // Fallback symptoms from symptomTranslations
  const fallbackSymptoms = Object.keys(symptomTranslations).slice(0, 30); // First 30 symptoms

  // Fetch symptoms from backend on component mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        console.log('Fetching symptoms from:', `${API_URL}/symptoms`);
        const response = await fetch(`${API_URL}/symptoms`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        // Check if we got a valid response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Read response as text to see what we got
          const text = await response.text();
          console.warn('Non-JSON response received:', text.substring(0, 100));
          throw new Error('Received non-JSON response');
        }
        
        const data = await response.json();
        
        if (data && data.symptoms && Array.isArray(data.symptoms)) {
          console.log('Symptoms loaded from API:', data.symptoms.length);
          setSymptoms(data.symptoms);
        } else {
          console.warn('Invalid response format, using fallback symptoms');
          setSymptoms(fallbackSymptoms);
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        setError(`Failed to load symptoms: ${error.message}. Using fallback list.`);
        // Use fallback symptoms from local data
        setSymptoms(fallbackSymptoms);
      } finally {
        setIsFetchingSymptoms(false);
      }
    };

    fetchSymptoms();
  }, [API_URL]);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      alert(language === 'en' ? 'Please select at least one symptom' : 'कृपया कम से कम एक लक्षण चुनें');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending prediction request with symptoms:', selectedSymptoms);
      const response = await fetch(`${API_URL}/disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms
        })
      });
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to predict disease`);
      }
      
      if (data.error) {
        setError(data.error);
        alert(language === 'en' ? 'Error predicting disease. Please try again.' : 'रोग की भविष्यवाणी में त्रुटि। कृपया पुनः प्रयास करें।');
      } else {
        console.log('Prediction received:', data.predicted_disease);
        setPrediction(data.predicted_disease);
      }
    } catch (error) {
      console.error('Error predicting disease:', error);
      setError(error.message);
      alert(language === 'en' 
        ? `Error: ${error.message}. Please try again or check API connection.`
        : `त्रुटि: ${error.message}. कृपया पुनः प्रयास करें या API कनेक्शन जांचें।`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setPrediction(null);
    setError(null);
  };

  const handleViewPrescription = () => {
    if (prediction) {
      navigate(`/prescription?disease=${prediction}`);
    }
  };

  if (isFetchingSymptoms) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Loading symptoms...' : 'लक्षण लोड हो रहे हैं...'}
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 ${
            isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          } transition`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.backToHome}
        </button>

        <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {language === 'en' ? 'Cattle Disease Prediction' : 'पशु रोग भविष्यवाणी'}
        </h2>

        {/* API Connection Status */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-50 border border-yellow-300'}`}>
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  {language === 'en' ? 'API Connection Issue' : 'API कनेक्शन समस्या'}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={`rounded-lg p-8 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Select Symptoms:' : 'लक्षण चुनें:'}
          </h3>
          
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'en' 
              ? 'Select all symptoms that the animal is experiencing' 
              : 'उन सभी लक्षणों का चयन करें जो जानवर में दिख रहे हैं'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6 max-h-96 overflow-y-auto p-2">
            {symptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                className={`px-4 py-3 rounded-lg text-left transition ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-green-600 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                    selectedSymptoms.includes(symptom)
                      ? 'border-white bg-white'
                      : isDark
                      ? 'border-gray-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedSymptoms.includes(symptom) && (
                      <svg className="w-4 h-4 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{getSymptomName(symptom, language)}</span>
                </div>
              </button>
            ))}
          </div>

          <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>{language === 'en' ? 'Selected:' : 'चयनित:'}</strong> {selectedSymptoms.length} {language === 'en' ? 'symptom(s)' : 'लक्षण'}
            </p>
            {selectedSymptoms.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSymptoms.slice(0, 5).map(symptom => (
                  <span 
                    key={symptom}
                    className={`px-2 py-1 text-xs rounded ${
                      isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {getSymptomName(symptom, language)}
                  </span>
                ))}
                {selectedSymptoms.length > 5 && (
                  <span className={`px-2 py-1 text-xs rounded ${
                    isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-700'
                  }`}>
                    +{selectedSymptoms.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePredict}
              disabled={selectedSymptoms.length === 0 || isLoading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg font-semibold flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'en' ? 'Analyzing...' : 'विश्लेषण कर रहे हैं...'}
                </>
              ) : (
                language === 'en' ? 'Predict Disease' : 'रोग की भविष्यवाणी करें'
              )}
            </button>
            
            <button
              onClick={handleReset}
              className={`px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {language === 'en' ? 'Reset' : 'रीसेट करें'}
            </button>
          </div>
        </div>

        {prediction && (
          <div
            className={`rounded-lg p-8 shadow-lg mb-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center mb-6">
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {language === "en" ? "Predicted Disease:" : "अनुमानित रोग:"}
              </h3>
            
              <p
                className={`text-3xl mb-4 font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {getDiseaseName(prediction, language)}
              </p>
              
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? `Based on ${selectedSymptoms.length} symptom(s)` 
                  : `${selectedSymptoms.length} लक्षण के आधार पर`}
              </p>
            </div>

            {/* Prescription Button */}
            <div className="mb-6 text-center">
              <button
                onClick={handleViewPrescription}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center justify-center gap-3 mx-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {language === 'en' ? 'View Prescription & Treatment' : 'प्रिस्क्रिप्शन और उपचार देखें'}
              </button>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Get detailed treatment information, prevention tips, and recovery guidelines' 
                  : 'विस्तृत उपचार जानकारी, रोकथाम सुझाव और स्वास्थ्य लाभ दिशानिर्देश प्राप्त करें'}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-50 border border-yellow-300'}`}>
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    {language === 'en' ? '⚠️ Important Medical Disclaimer' : '⚠️ महत्वपूर्ण चिकित्सा अस्वीकरण'}
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                    {language === 'en' 
                      ? 'This is a preliminary diagnosis based on symptoms. Please consult a qualified veterinarian for proper examination, confirmation, and treatment plan.' 
                      : 'यह लक्षणों के आधार पर एक प्रारंभिक निदान है। उचित जांच, पुष्टि और उपचार योजना के लिए कृपया योग्य पशु चिकित्सक से परामर्श करें।'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseasePredictPage;