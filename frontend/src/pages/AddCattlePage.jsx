import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { breedData } from '../data/breedData';
import { toast } from 'react-toastify';

function AddCattlePage({ isDark, language }) {
  const [formData, setFormData] = useState({
    name: '',
    cattleId: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    milkProduction: '',
    disease: 'None',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useAuth();

  // Use environment variable or fallback to Render URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://farmlens-backend-node.onrender.com';

  useEffect(() => {
    if (!user || user.username !== username) {
      navigate('/login');
    }
  }, [user, username]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/cattle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Cattle added successfully!');
        navigate(`/${username}`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add cattle');
      }
    } catch (error) {
      toast.error('Failed to add cattle');
    }
    setLoading(false);
  };

  const breeds = Object.keys(breedData);

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-8 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add New Cattle
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cattle Image */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={formData.image || '/default-cattle.jpg'}
                  alt="Cattle"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500 mx-auto"
                />
                <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Cattle Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Cattle Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Cattle ID */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Cattle ID *
              </label>
              <input
                type="text"
                name="cattleId"
                required
                value={formData.cattleId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Breed */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Breed *
                <button
                  type="button"
                  onClick={() => navigate('/predict')}
                  className="ml-2 text-green-600 hover:text-green-700 text-xs"
                >
                  (Don't know? Identify breed)
                </button>
              </label>
              <select
                name="breed"
                required
                value={formData.breed}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select Breed</option>
                {breeds.map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Age (years) *
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="0"
                  step="0.1"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Weight */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  required
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Bull">Bull</option>
                  <option value="Cow">Cow</option>
                  <option value="Heifer">Heifer</option>
                  <option value="Calf">Calf</option>
                </select>
              </div>

              {/* Milk Production */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Milk Production (L/day)
                </label>
                <input
                  type="number"
                  name="milkProduction"
                  min="0"
                  step="0.1"
                  value={formData.milkProduction}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Disease */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Disease
                <button
                  type="button"
                  onClick={() => navigate('/disease')}
                  className="ml-2 text-green-600 hover:text-green-700 text-xs"
                >
                  (Don't know? Predict disease)
                </button>
              </label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter disease if any"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Cattle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCattlePage;