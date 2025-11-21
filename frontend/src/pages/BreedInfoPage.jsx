import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {breedData} from '../data/breedData';

function BreedInfoPage({ isDark, language, selectedBreed, prediction }) {
  const { breedName } = useParams();
  const navigate = useNavigate();

  // Determine final breed name
  const finalBreedRaw = selectedBreed || prediction || breedName;
  const finalBreed = decodeURIComponent(finalBreedRaw);

  // Fetch breed info safely
  const breedInfo = breedData[finalBreed] || breedData[finalBreedRaw];

  if (!breedInfo) {
    return (
      <div className="p-6 text-center text-red-500 text-xl">
        Breed information not found.
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back
      </button>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">{finalBreed}</h1>

        <img
          src={breedInfo.image}
          alt={finalBreed}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p className="mb-4">{breedInfo.description[language]}</p>

        <h2 className="text-2xl font-semibold mb-2">Characteristics</h2>
        <ul className="list-disc pl-6 mb-4">
          {breedInfo.characteristics[language].map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-2">Additional Info</h2>
        <p><strong>Origin:</strong> {breedInfo.origin[language]}</p>
        <p><strong>Weight:</strong> {breedInfo.weight[language]}</p>
        <p><strong>Milk Production:</strong> {breedInfo.milkProduction[language]}</p>
      </div>
    </div>
  );
}

export default BreedInfoPage;
