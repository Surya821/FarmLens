import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';

function PredictPage({ isDark, language, setSelectedBreed, prediction, setPrediction}) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const t = translations[language];

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://farmlens-backend.onrender.com';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setPrediction(data.predicted_class);
    } catch (error) {
      console.error('Error:', error);
      alert('Error predicting breed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = () => {
    setSelectedBreed(prediction);
    navigate(`/breed/${encodeURIComponent(prediction)}`);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className={`mb-6 px-4 py-2 rounded-lg ${
            isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } hover:opacity-80`}
        >
          {t.backToHome}
        </button>

        <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {t.uploadImage}
        </h2>

        <div className={`rounded-lg p-8 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="text-center mb-6">
            <label className="cursor-pointer">
              <div className={`border-2 border-dashed rounded-lg p-8 ${
                isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
              }`}>
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Uploaded" className="max-h-64 mx-auto rounded" />
                ) : (
                  <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-lg mb-2">{t.uploadInstruction}</p>
                    <p className="text-sm">{t.chooseFile}</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handlePredict}
            disabled={!selectedFile || isLoading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg font-semibold"
          >
            {isLoading ? t.predicting : t.predictBtn}
          </button>
        </div>

        {prediction && (
          <div
            className={`rounded-lg p-8 shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            } flex flex-col items-center text-center`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              {language === "en" ? "Predicted Breed:" : "भविष्यवाणी की गई नस्ल:"}
            </h3>
          
            <p
              className={`text-xl mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {prediction}
            </p>
          
            <button
              onClick={handleLearnMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t.learnMore}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictPage;