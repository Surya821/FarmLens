import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';
import { breedData } from '../data/breedData';
import BreedCard from '../components/BreedCard';
import BreedWorldMap from '../components/BreedWorldMap';

function BreedsPage({ isDark, language, setSelectedBreed }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const t = translations[language];
  const breeds = Object.keys(breedData);
  
  const filteredBreeds = breeds.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBreedClick = (breed) => {
    setSelectedBreed(breed);
    navigate(`/breed/${encodeURIComponent(breed)}`);
  };

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

        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t.allBreeds}
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
        </div>

        <BreedWorldMap isDark={isDark} language={language} />

        <div className="mb-8">
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' 
              ? `Showing ${filteredBreeds.length} cattle breed${filteredBreeds.length !== 1 ? 's' : ''}`
              : `${filteredBreeds.length} मवेशी नस्लें दिखा रहे हैं`
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBreeds.map((breed) => (
              <BreedCard
                key={breed}
                breed={breed}
                isDark={isDark}
                onClick={() => handleBreedClick(breed)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreedsPage;