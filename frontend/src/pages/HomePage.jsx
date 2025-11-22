import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';
import { breedData } from '../data/breedData';
import BreedCard from '../components/BreedCard';
import BreedWorldMap from '../components/BreedWorldMap';

function HomePage({ isDark, language, setSelectedBreed }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const t = translations[language];
  const breeds = Object.keys(breedData);
  
  const filteredBreeds = breeds.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Always show first 6 breeds on home page (static)
  const displayedBreeds = breeds.slice(0, 6);
  const hasMoreBreeds = breeds.length > 6;

  const handleBreedClick = (breed) => {
    console.log('Navigating to breed:', breed);
    setSelectedBreed(breed);
    // Navigate to breed info page with properly encoded URL
    navigate(`/breed/${encodeURIComponent(breed)}`);
  };

  const handleSuggestionClick = (breed) => {
    console.log('Suggestion clicked:', breed);
    // Clear search and hide dropdown
    setSearchQuery('');
    setShowSuggestions(false);
    // Navigate to the breed page
    handleBreedClick(breed);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  // Helper function to get origin text
  const getOriginText = (breed) => {
    const origin = breedData[breed]?.origin;
    if (!origin) return '';
    return typeof origin === 'object' ? origin[language] || origin.en : origin;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className={`${isDark ? 'bg-gradient-to-br from-green-900 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 via-blue-50 to-white'} py-16 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            {/* Logo/Icon */}
            <div className="mb-6 flex justify-center">
              <div className={`p-4 rounded-full ${isDark ? 'bg-green-800/50' : 'bg-green-100'} inline-block`}>
                <svg className={`w-16 h-16 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <h1 className={`text-5xl md:text-6xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'FarmLens' : 'फार्मलेंस'}
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
              {language === 'en' 
                ? 'AI-Powered Cattle Management & Health Monitoring System' 
                : 'एआई-संचालित पशु प्रबंधन और स्वास्थ्य निगरानी प्रणाली'}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  className={`w-full px-6 py-5 rounded-2xl border-2 text-lg shadow-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500'
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-green-500'
                  } focus:outline-none transition-all duration-300`}
                />
                <svg className={`absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredBreeds.length > 0 && (
                  <div className={`absolute z-10 w-full mt-2 rounded-xl shadow-2xl border-2 max-h-96 overflow-y-auto ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {filteredBreeds.slice(0, 10).map((breed, index) => {
                      const originText = getOriginText(breed);
                      return (
                        <div
                          key={breed}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(breed);
                          }}
                          className={`px-6 py-4 cursor-pointer transition-all duration-200 ${
                            index !== 0 ? (isDark ? 'border-t border-gray-700' : 'border-t border-gray-100') : ''
                          } ${
                            isDark 
                              ? 'hover:bg-gray-700 text-white' 
                              : 'hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <svg className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="font-medium">{breed}</span>
                          </div>
                          {originText && (
                            <div className={`text-sm mt-1 ml-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {originText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filteredBreeds.length > 10 && (
                      <div className={`px-6 py-3 text-center text-sm ${isDark ? 'text-gray-500 border-t border-gray-700' : 'text-gray-400 border-t border-gray-100'}`}>
                        {filteredBreeds.length - 10} {language === 'en' ? 'more breeds...' : 'और नस्लें...'}
                      </div>
                    )}
                  </div>
                )}
                
                {/* No Results Message */}
                {showSuggestions && searchQuery && filteredBreeds.length === 0 && (
                  <div className={`absolute z-10 w-full mt-2 rounded-xl shadow-2xl border-2 px-6 py-4 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-gray-400' 
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{language === 'en' ? 'No breeds found' : 'कोई नस्ल नहीं मिली'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => navigate('/predict')}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t.goToPredict}</span>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/disease')}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{language === 'en' ? 'Predict Disease' : 'रोग की भविष्यवाणी'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} shadow-lg transition-all duration-300 transform hover:-translate-y-2`}>
              <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Instant Recognition' : 'तत्काल पहचान'}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Upload a photo and get breed identification in seconds using advanced AI' 
                  : 'उन्नत एआई का उपयोग करके फोटो अपलोड करें और सेकंड में नस्ल की पहचान करें'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} shadow-lg transition-all duration-300 transform hover:-translate-y-2`}>
              <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-green-900/50' : 'bg-green-100'} flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Health Monitoring' : 'स्वास्थ्य निगरानी'}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Track symptoms and predict potential diseases before they become serious' 
                  : 'लक्षणों को ट्रैक करें और गंभीर होने से पहले संभावित रोगों की भविष्यवाणी करें'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} shadow-lg transition-all duration-300 transform hover:-translate-y-2`}>
              <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'} flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Breed Database' : 'नस्ल डेटाबेस'}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Comprehensive information about cattle breeds, characteristics, and care' 
                  : 'मवेशी नस्लों, विशेषताओं और देखभाल के बारे में व्यापक जानकारी'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breeds Section */}
      <div className={`py-12 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Featured Cattle Breeds' : 'चुनिंदा मवेशी नस्लें'}
              </h3>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Explore our comprehensive database of cattle breeds' 
                  : 'मवेशी नस्लों के हमारे व्यापक डेटाबेस का अन्वेषण करें'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBreeds.map((breed) => (
              <BreedCard
                key={breed}
                breed={breed}
                isDark={isDark}
                onClick={() => handleBreedClick(breed)}
              />
            ))}
          </div>
          
          {hasMoreBreeds && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/breeds')}
                className={`px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{language === 'en' ? 'View All Breeds' : 'सभी नस्लें देखें'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-r from-green-600 to-green-500'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-white'}`}>
                {breeds.length}+
              </div>
              <div className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-green-100'}`}>
                {language === 'en' ? 'Cattle Breeds' : 'मवेशी नस्लें'}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-white'}`}>
                26+
              </div>
              <div className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-green-100'}`}>
                {language === 'en' ? 'Diseases Detected' : 'रोग का पता लगाया'}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-white'}`}>
                93+
              </div>
              <div className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-green-100'}`}>
                {language === 'en' ? 'Symptoms Tracked' : 'लक्षण ट्रैक किए गए'}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-white'}`}>
                AI
              </div>
              <div className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-green-100'}`}>
                {language === 'en' ? 'Powered System' : 'संचालित प्रणाली'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <BreedWorldMap isDark={isDark} language={language} />
    </div>
  );
}

export default HomePage;