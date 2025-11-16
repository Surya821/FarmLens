import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { translations } from '../data/translations';
import { breedData } from '../data/breedData';

function BreedInfoPage({ isDark, language, selectedBreed, prediction }) {
  const navigate = useNavigate();
  const { breedName } = useParams();
  const t = translations[language];
  
  // Use the breed from URL params if selectedBreed is not set
  const currentBreed = selectedBreed || decodeURIComponent(breedName);
  const breed = breedData[currentBreed];
  
  useEffect(() => {
    // If breed doesn't exist, redirect to home
    if (!breed) {
      navigate('/');
    }
  }, [breed, navigate]);
  
  if (!breed) return null;

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(prediction ? '/predict' : '/')}
          className={`mb-6 px-4 py-2 rounded-lg ${
            isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } hover:opacity-80`}
        >
          {prediction ? t.backToPredict : t.backToHome}
        </button>

        <div className={`rounded-lg overflow-hidden shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <img src={breed.image} alt={currentBreed} className="w-full h-64 object-cover" />
          
          <div className="p-8">
            <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {currentBreed}
            </h2>

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {t.description}
              </h3>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {breed.description[language]}
              </p>
            </div>

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {t.characteristics}
              </h3>
              <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {breed.characteristics[language].map((char, idx) => (
                  <li key={idx}>{char}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {t.origin}
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{breed.origin[language]}</p>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {t.weight}
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{breed.weight[language]}</p>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {t.milkProduction}
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{breed.milkProduction[language]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreedInfoPage;