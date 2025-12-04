import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

function AuthPage({ isDark, language }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Password requirements check
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(req => req);

  // Set initial mode based on route
  React.useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!isLogin) {
      // Registration validation
      if (!formData.name || !formData.name.trim()) {
        toast.error('Name is required');
        return false;
      }
      if (!formData.mobile || !formData.mobile.trim()) {
        toast.error('Mobile number is required');
        return false;
      }
      if (!formData.address || !formData.address.trim()) {
        toast.error('Address is required');
        return false;
      }
      if (!formData.password) {
        toast.error('Password is required');
        return false;
      }
      if (!formData.confirmPassword) {
        toast.error('Please confirm your password');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      
      if (!isPasswordValid) {
        toast.error('Password does not meet requirements');
        return false;
      }
    } else {
      // Login validation
      if (!formData.mobile || !formData.mobile.trim()) {
        toast.error('Mobile number is required');
        return false;
      }
      if (!formData.password) {
        toast.error('Password is required');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const API_BASE = 'http://localhost:5000';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      // Prepare data for API - ensure all fields are strings
      const requestData = isLogin 
        ? { 
            mobile: String(formData.mobile).trim(), 
            password: String(formData.password)
          }
        : { 
            name: String(formData.name).trim(), 
            mobile: String(formData.mobile).trim(), 
            address: String(formData.address).trim(), 
            password: String(formData.password)
          };
      
      console.log('Sending request to:', `${API_BASE}${endpoint}`);
      console.log('Request data:', requestData);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        login(data.user, data.token);
        toast.success(isLogin ? 'Successfully logged in!' : 'Successfully registered!');
        navigate(`/${data.user.username}`);
      } else {
        toast.error(data.error || `Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      toast.error('Connection error. Please check if backend server is running on localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirementItem = ({ condition, text }) => (
    <div className="flex items-center space-x-2">
      {condition ? (
        <CheckCircleIcon className="w-4 h-4 text-green-500" />
      ) : (
        <XCircleIcon className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-xs ${condition ? 'text-green-500' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {isLogin ? 'Sign in to FarmLens' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="address" className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your address"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="mobile" className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Mobile Number *
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={formData.mobile}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter mobile number"
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password *
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className={`block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Password Requirements - Only show for registration */}
            {!isLogin && formData.password && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className={`text-xs font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password must contain:
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <PasswordRequirementItem 
                    condition={passwordRequirements.length}
                    text="At least 8 characters"
                  />
                  <PasswordRequirementItem 
                    condition={passwordRequirements.uppercase}
                    text="At least one uppercase letter (A-Z)"
                  />
                  <PasswordRequirementItem 
                    condition={passwordRequirements.lowercase}
                    text="At least one lowercase letter (a-z)"
                  />
                  <PasswordRequirementItem 
                    condition={passwordRequirements.number}
                    text="At least one number (0-9)"
                  />
                  <PasswordRequirementItem 
                    condition={passwordRequirements.special}
                    text="At least one special character (!@#$%^&*)"
                  />
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm Password *
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-xs text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-xs text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (!isLogin && !isPasswordValid)}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                loading || (!isLogin && !isPasswordValid)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                navigate(isLogin ? '/register' : '/login');
                // Reset form when switching modes
                setFormData({
                  name: '',
                  mobile: '',
                  address: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              className={`text-sm ${
                isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'
              }`}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;