import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { breedData } from '../data/breedData';

function BreedInfoPage({ isDark, language, selectedBreed, prediction }) {
  const { breedName } = useParams();
  const navigate = useNavigate();

  // Determine final breed name - decode URL encoding
  const finalBreedRaw = selectedBreed || prediction || decodeURIComponent(breedName);
  const finalBreed = finalBreedRaw;

  // Fetch breed info safely
  const breedInfo = breedData[finalBreed];

  if (!breedInfo) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <svg className={`w-24 h-24 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'en' ? 'Breed Not Found' : 'नस्ल नहीं मिली'}
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'en' 
              ? 'The breed information you are looking for could not be found.' 
              : 'आप जिस नस्ल की जानकारी खोज रहे हैं वह नहीं मिली।'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg"
          >
            {language === 'en' ? 'Go to Home' : 'होम पर जाएं'}
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get text based on language
  const getText = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[language] || field.en : field;
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header Section */}
      <div className={`${isDark ? 'bg-gradient-to-br from-green-900 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 via-blue-50 to-white'} py-8 px-4`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className={`mb-4 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{language === 'en' ? 'Back' : 'वापस'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Breed Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={breedInfo.image}
              alt={finalBreed}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h1 className="absolute bottom-6 left-6 text-5xl font-extrabold text-white drop-shadow-lg">
              {finalBreed}
            </h1>
          </div>

          {/* Content Grid */}
          <div className="p-8 md:p-12">
            {/* Description */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-green-900/50' : 'bg-green-100'} flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Description' : 'विवरण'}
                </h2>
              </div>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {getText(breedInfo.description)}
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Origin Card */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <svg className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Origin' : 'मूल'}
                  </h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {getText(breedInfo.origin)}
                </p>
              </div>

              {/* Weight Card */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <svg className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Weight' : 'वजन'}
                  </h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {getText(breedInfo.weight)}
                </p>
              </div>

              {/* Milk Production Card */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <svg className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Milk Production' : 'दूध उत्पादन'}
                  </h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {getText(breedInfo.milkProduction)}
                </p>
              </div>
            </div>

            {/* Characteristics */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Characteristics' : 'विशेषताएं'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getText(breedInfo.characteristics) && 
                  (Array.isArray(getText(breedInfo.characteristics)) 
                    ? getText(breedInfo.characteristics) 
                    : []
                  ).map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg ${
                        isDark ? 'bg-gray-700/30' : 'bg-gray-50'
                      }`}
                    >
                      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => navigate('/predict')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{language === 'en' ? 'Identify Another Breed' : 'दूसरी नस्ल की पहचान करें'}</span>
              </button>
              
              <button
                onClick={() => navigate('/breeds')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{language === 'en' ? 'Browse All Breeds' : 'सभी नस्लें देखें'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreedInfoPage;