import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';
import { breedData } from '../data/breedData';
import BreedCard from '../components/BreedCard';

function HomePage({ isDark, language, setSelectedBreed }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const t = translations[language];
  const breeds = Object.keys(breedData);
  
  const filteredBreeds = breeds.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show only first 6 breeds on home page
  const displayedBreeds = filteredBreeds.slice(0, 6);
  const hasMoreBreeds = filteredBreeds.length > 6;

  const handleBreedClick = (breed) => {
    setSelectedBreed(breed);
    navigate(`/breed/${encodeURIComponent(breed)}`);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Welcome to FarmLens' : 'फार्मलेंस में आपका स्वागत है'}
          </h2>
          <div className="max-w-2xl mx-auto mb-6">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-4 rounded-lg border-2 text-lg ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              } focus:outline-none focus:border-green-500`}
            />
          </div>
          <button
            onClick={() => navigate('/predict')}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold"
          >
            {t.goToPredict}
          </button>
        </div>

        <div className="mb-8">
          <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Featured Cattle Breeds' : 'चुनिंदा मवेशी नस्लें'}
          </h3>
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
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/breeds')}
                className={`px-8 py-3 rounded-lg text-lg font-semibold transition ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {language === 'en' ? 'View All Breeds' : 'सभी नस्लें देखें'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;