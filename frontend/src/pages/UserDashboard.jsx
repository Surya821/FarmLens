import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function UserDashboard({ isDark, language }) {
  const [cattleList, setCattleList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.username === username) {
      fetchCattle();
      fetchStats();
    } else {
      navigate('/login');
    }
  }, [user, username]);

  const fetchCattle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cattle/my-cattle', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCattleList(data);
      }
    } catch (error) {
      toast.error('Failed to fetch cattle');
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cattle/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const deleteCattle = async (cattleId) => {
    if (!window.confirm('Are you sure you want to delete this cattle?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cattle/${cattleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Cattle deleted successfully');
        fetchCattle();
        fetchStats();
      } else {
        toast.error('Failed to delete cattle');
      }
    } catch (error) {
      toast.error('Failed to delete cattle');
    }
  };

  const filteredAndSortedCattle = cattleList
    .filter(cattle => 
      cattle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cattle.breed.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'health':
          return a.healthStatus.localeCompare(b.healthStatus);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className={`rounded-2xl p-8 mb-8 shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500 cursor-pointer"
                onClick={() => navigate(`/${username}/profile`)}
              />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {user?.name}
            </h1>
            <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {user?.mobile}
            </p>
            
            <hr className={`my-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Cattles
              </h2>
              <button
                onClick={() => navigate(`/${username}/addcattle`)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Cattle
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`text-center p-4 rounded-xl ${
              isDark ? 'bg-gray-700' : 'bg-green-50'
            }`}>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-600'}`}>
                {stats.totalCattle || 0}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-green-800'}`}>
                Total Cattle
              </div>
            </div>
            {/* Add more stat cards as needed */}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search cattle by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date Added</option>
              <option value="health">Sort by Health Status</option>
            </select>
          </div>

          {/* Cattle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCattle.map((cattle) => (
              <div
                key={cattle._id}
                className={`rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={cattle.image || '/default-cattle.jpg'}
                    alt={cattle.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCattle(cattle._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cattle.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cattle.breed} • {cattle.gender} • {cattle.age} years
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
                    cattle.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                    cattle.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                    cattle.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cattle.healthStatus}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => navigate(`/${username}/cattleinfo/${cattle._id}`)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Updated: {new Date(cattle.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedCattle.length === 0 && (
            <div className="text-center py-12">
              <svg className={`w-24 h-24 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No cattle found. Add your first cattle to get started!
              </p>
              <button
                onClick={() => navigate(`/${username}/addcattle`)}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Your First Cattle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;