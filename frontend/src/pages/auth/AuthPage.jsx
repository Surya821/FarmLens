import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { translations } from '../../data/translations';
import { ForgotPasswordModal } from '../../components/PasswordModals';

function AuthPage({ isDark, language }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const t = translations[language];

  // Set initial mode based on route and handle session redirection
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (user) {
      navigate(`/${user.username}`, { replace: true });
      return;
    } 
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname, user, navigate]);

  // Password requirements check
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(req => req);



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
        toast.error(t.nameRequired);
        return false;
      }
      if (!formData.mobile || !formData.mobile.trim()) {
        toast.error(t.mobileRequired);
        return false;
      }
      if (!formData.address || !formData.address.trim()) {
        toast.error(t.addressRequired);
        return false;
      }
      if (!formData.password) {
        toast.error(t.passwordRequired);
        return false;
      }
      if (!formData.confirmPassword) {
        toast.error(t.confirmPasswordRequired);
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error(t.passwordsDoNotMatch);
        return false;
      }

      if (!isPasswordValid) {
        toast.error(t.passwordInvalid);
        return false;
      }
    } else {
      // Login validation
      if (!formData.mobile || !formData.mobile.trim()) {
        toast.error(t.mobileRequired);
        return false;
      }
      if (!formData.password) {
        toast.error(t.passwordRequired);
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
          email: formData.email ? String(formData.email).trim() : undefined,
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
        localStorage.removeItem('isAdmin'); // Clear admin session
        login(data.user, data.token);
        toast.success(isLogin ? t.loginSuccess : t.registerSuccess);
        navigate(`/${data.user.username}`, { replace: true });
      } else {
        toast.error(data.error || `Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      toast.error(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('isAdmin'); // Clear admin session
        login(data.user, data.token);
        toast.success(t.loginSuccess);
        navigate(`/${data.user.username}`, { replace: true });
      } else {
        toast.error(data.error || 'Google Login failed');
      }
    } catch (error) {
      console.error('Google Login error:', error);
      toast.error(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login Failed. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 p-6 rounded-2xl shadow-xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate('/')}
            className="self-start flex items-center mb-6 text-sm font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            {t.backToHome}
          </button>
          <h2 className="text-center text-3xl font-black text-[var(--text)] tracking-tight">
            {isLogin ? t.signInTitle : t.createAccountTitle}
          </h2>
        </div>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--muted)]">
                  {t.fullName} *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
                  placeholder={t.fullNamePlaceholder || (language === 'en' ? "Enter your full name" : "अपना पूरा नाम दर्ज करें")}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--muted)]">
                  {language === 'en' ? 'Email (optional)' : 'ईमेल (वैकल्पिक)'}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
                  placeholder={language === 'en' ? "Enter email" : "ईमेल दर्ज करें (पासवर्ड रीसेट के लिए)"}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[var(--muted)]">
                  {t.address} *
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
                  placeholder={t.addressPlaceholder || (language === 'en' ? "Enter your address" : "अपना पता दर्ज करें")}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-[var(--muted)]">
              {t.mobileNumber} *
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
              placeholder={t.mobilePlaceholder || (language === 'en' ? "Enter mobile number" : "मोबाइल नंबर दर्ज करें")}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--muted)]">
              {t.password} *
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
                placeholder={t.passwordPlaceholder || (language === 'en' ? "Enter password" : "पासवर्ड दर्ज करें")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted)] hover:text-[var(--text)]"
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
              <div className="mt-2 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                <p className="text-xs font-medium mb-2 text-[var(--muted)]">
                  {t.passwordRequirements}
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <PasswordRequirementItem
                    condition={passwordRequirements.length}
                    text={t.requirementLength}
                  />
                  <PasswordRequirementItem
                    condition={passwordRequirements.uppercase}
                    text={t.requirementUppercase}
                  />
                  <PasswordRequirementItem
                    condition={passwordRequirements.lowercase}
                    text={t.requirementLowercase}
                  />
                  <PasswordRequirementItem
                    condition={passwordRequirements.number}
                    text={t.requirementNumber}
                  />
                  <PasswordRequirementItem
                    condition={passwordRequirements.special}
                    text={t.requirementSpecial}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--muted)]">
                {t.confirmPassword} *
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
                  placeholder={t.confirmPasswordPlaceholder || (language === 'en' ? "Confirm password" : "पासवर्ड की पुष्टि करें")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted)] hover:text-[var(--text)]"
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
                      <span className="text-xs text-green-500">{t.passwordsMatch}</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-xs text-red-500">{t.passwordsDoNotMatch}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Forgot Password - Login only */}
          {isLogin && (
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors"
              >
                {language === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (!isLogin && !isPasswordValid)}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] ${loading || (!isLogin && !isPasswordValid)
                ? 'bg-[var(--muted)] opacity-50 cursor-not-allowed'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
                }`}
            >
              {loading ? t.processing : (isLogin ? t.signIn : t.register)}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--card)] text-[var(--muted)]">
                {language === 'en' ? 'Or continue with' : 'या इसके साथ जारी रखें'}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme={isDark ? 'filled_blue' : 'outline'}
              size="large"
              shape="pill"
              width="100%"
            />
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
              className="text-sm text-[var(--accent)] hover:underline font-bold"
            >
              {isLogin ? t.noAccountRegister : t.haveAccountSignIn}
            </button>
          </div>
        </form>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal
          language={language}
          onClose={() => setShowForgotModal(false)}
        />
      )}
    </div>
  );
}

export default AuthPage;