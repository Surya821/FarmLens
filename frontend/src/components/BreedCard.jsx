import { breedData } from '../data/breedData';

function BreedCard({ breed, isDark, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <img
        src={breedData[breed].image}
        alt={breed}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {breed}
        </h4>
      </div>
    </div>
  );
}

export default BreedCard;