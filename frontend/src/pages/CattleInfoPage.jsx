import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { breedData } from '../data/breedData';
import { toast } from 'react-toastify';
import { Camera, Stethoscope } from 'lucide-react';

function CattleInfoPage({ isDark, language }) {
  const [cattle, setCattle] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { username, cattleId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.username !== username) {
      navigate('/login');
      return;
    }
    fetchCattle();
  }, [user, username, cattleId]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://farmlens-backend-node.onrender.com';

  const fetchCattle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/cattle/my-cattle`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const cattleList = await response.json();
        const currentCattle = cattleList.find(c => c._id === cattleId);
        if (currentCattle) {
          setCattle(currentCattle);
          setFormData(currentCattle);
        } else {
          toast.error('Cattle not found');
          navigate(`/${username}`);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch cattle details');
    }
    setLoading(false);
  };

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/cattle/${cattleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedCattle = await response.json();
        setCattle(updatedCattle);
        setIsEditing(false);
        toast.success('Cattle updated successfully!');
      } else {
        toast.error('Failed to update cattle');
      }
    } catch (error) {
      toast.error('Failed to update cattle');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this cattle?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/cattle/${cattleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Cattle deleted successfully');
        navigate(`/${username}`);
      } else {
        toast.error('Failed to delete cattle');
      }
    } catch (error) {
      toast.error('Failed to delete cattle');
    }
  };

  const handlePredictBreed = () => {
    // Store current cattle data for prediction context
    localStorage.setItem('predictionContext', JSON.stringify({
      fromPage: 'edit-cattle',
      cattleId: cattleId,
      currentData: formData
    }));
    navigate('/predict');
  };

  const handlePredictDisease = () => {
    // Store current cattle data for disease prediction context
    localStorage.setItem('diseasePredictionContext', JSON.stringify({
      fromPage: 'edit-cattle',
      cattleId: cattleId,
      currentData: formData
    }));
    navigate('/disease');
  };

  const breeds = Object.keys(breedData);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading cattle details...</p>
        </div>
      </div>
    );
  }

  if (!cattle) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Cattle not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-8 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cattle Information
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/breeds')}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Cattle Breeds
              </button>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(cattle);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <form className="space-y-6">
            {/* Cattle Image */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={formData.image || '/default-cattle.jpg'}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500 mx-auto"
                />
                {isEditing && (
                  <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer">
                    <Camera size={16} className="text-white" />
                  </label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={!isEditing}
                  className="hidden"
                />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`text-2xl font-bold text-center mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <h2 className={`text-2xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {cattle.name}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cattle ID */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cattle ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cattleId"
                    value={formData.cattleId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.cattleId}
                  </p>
                )}
              </div>

              {/* Breed */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Breed
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handlePredictBreed}
                      className="ml-2 text-green-600 hover:text-green-700 text-xs flex items-center gap-1"
                    >
                      <Camera size={12} />
                      (Don't know? Predict breed)
                    </button>
                  )}
                </label>
                {isEditing ? (
                  <select
                    name="breed"
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
                ) : (
                  <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.breed}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Age (years)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.age} years
                  </p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Weight (kg)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.weight} kg
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Bull">Bull</option>
                    <option value="Cow">Cow</option>
                    <option value="Heifer">Heifer</option>
                    <option value="Calf">Calf</option>
                  </select>
                ) : (
                  <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.gender}
                  </p>
                )}
              </div>

              {/* Milk Production */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Milk Production (L/day)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="milkProduction"
                    value={formData.milkProduction}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.milkProduction || 0} L/day
                  </p>
                )}
              </div>
            </div>

            {/* Disease */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Disease
                {isEditing && (
                  <button
                    type="button"
                    onClick={handlePredictDisease}
                    className="ml-2 text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Stethoscope size={12} />
                    (Don't know? Predict disease)
                  </button>
                )}
              </label>
              {isEditing ? (
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
              ) : (
                <p className={`px-3 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {cattle.disease || 'None'}
                </p>
              )}
            </div>

            {/* Health Status */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Health Status
              </label>
              {isEditing ? (
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              ) : (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  cattle.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                  cattle.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                  cattle.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {cattle.healthStatus}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} border-t pt-4`}>
              <p>Added: {new Date(cattle.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(cattle.updatedAt).toLocaleString()}</p>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 mx-auto ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CattleInfoPage;