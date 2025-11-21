import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';
import { getSymptomName, getDiseaseName } from '../data/symptoms';

function DiseasePredictPage({ isDark, language }) {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSymptoms, setIsFetchingSymptoms] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const navigate = useNavigate();
  const t = translations[language];

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://farmlens-backend.onrender.com';

  // Fetch symptoms from backend on component mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_URL}/symptoms`);
        const data = await response.json();
        setSymptoms(data.symptoms || []);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        alert('Error loading symptoms. Please refresh the page.');
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

    try {
      const response = await fetch(`${API_URL}/disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert(language === 'en' ? 'Error predicting disease. Please try again.' : 'रोग की भविष्यवाणी में त्रुटि। कृपया पुनः प्रयास करें।');
        console.error('API Error:', data.error);
      } else {
        setPrediction(data.predicted_disease);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'en' ? 'Error predicting disease. Please try again.' : 'रोग की भविष्यवाणी में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setPrediction(null);
  };

  if (isFetchingSymptoms) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {language === 'en' ? 'Loading symptoms...' : 'लक्षण लोड हो रहे हैं...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className={`mb-6 px-4 py-2 rounded-lg ${
            isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } hover:opacity-80`}
        >
          {t.backToHome}
        </button>

        <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {language === 'en' ? 'Cattle Disease Prediction' : 'पशु रोग भविष्यवाणी'}
        </h2>

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
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePredict}
              disabled={selectedSymptoms.length === 0 || isLoading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg font-semibold"
            >
              {isLoading 
                ? (language === 'en' ? 'Analyzing...' : 'विश्लेषण कर रहे हैं...') 
                : (language === 'en' ? 'Predict Disease' : 'रोग की भविष्यवाणी करें')}
            </button>
            
            <button
              onClick={handleReset}
              className={`px-6 py-3 rounded-lg transition ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {language === 'en' ? 'Reset' : 'रीसेट करें'}
            </button>
          </div>
        </div>

        {prediction && (
          <div
            className={`rounded-lg p-8 shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            } text-center`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              {language === "en" ? "Predicted Disease:" : "अनुमानित रोग:"}
            </h3>
          
            <p
              className={`text-xl mb-4 font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {getDiseaseName(prediction, language)}
            </p>

            <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-50 border border-yellow-300'}`}>
              <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                {language === 'en' 
                  ? '⚠️ This is a preliminary diagnosis. Please consult a veterinarian for proper treatment and confirmation.' 
                  : '⚠️ यह एक प्रारंभिक निदान है। उचित उपचार और पुष्टि के लिए कृपया पशु चिकित्सक से परामर्श करें।'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseasePredictPage;