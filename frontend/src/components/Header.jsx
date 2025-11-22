import { Moon, Sun, Globe, LogIn, User, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/farmlens-logo (1).png'
import { useState } from 'react';

function Header({ isDark, setIsDark, language, setLanguage }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate(`/${user.username}`);
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1
          onClick={handleHomeClick}
          className={`flex items-center gap-2 text-xl md:text-3xl font-bold cursor-pointer ${
            isDark ? "text-green-400" : "text-green-600"
          }`}
        >
          <img src={logo} alt="logo" className="w-8 h-8 md:w-12 md:h-12" />
          <span className="hidden sm:inline">FarmLens</span>
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
            } hover:opacity-80 transition`}
            title="Change Language"
          >
            <Globe size={20} />
            <span className="text-sm">{language === "en" ? "EN" : "हिं"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${
              isDark
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-200 text-gray-800"
            } hover:opacity-80 transition`}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Dashboard Button (only when logged in) */}
          {user && (
            <button
              onClick={handleDashboardClick}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                isDark 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition`}
              title="Go to Dashboard"
            >
              <User size={20} />
              <span className="text-sm">Dashboard</span>
            </button>
          )}

          {/* Auth Button */}
          <button
            onClick={handleAuthClick}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isDark 
                ? user 
                  ? "bg-red-600 text-white hover:bg-red-700" 
                  : "bg-green-600 text-white hover:bg-green-700"
                : user 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-green-500 text-white hover:bg-green-600"
            } transition`}
            title={user ? "Logout" : "Login/Register"}
          >
            {user ? <LogOut size={20} /> : <LogIn size={20} />}
            <span className="text-sm">{user ? "Logout" : "Login"}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className={isDark ? "text-white" : "text-gray-800"} />
          ) : (
            <Menu size={24} className={isDark ? "text-white" : "text-gray-800"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden px-4 pb-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className={`p-3 rounded-lg flex items-center justify-between ${
                isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
              } hover:opacity-80 transition`}
            >
              <div className="flex items-center gap-2">
                <Globe size={20} />
                <span>Language</span>
              </div>
              <span>{language === "en" ? "EN" : "हिं"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-lg flex items-center justify-between ${
                isDark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:opacity-80 transition`}
            >
              <div className="flex items-center gap-2">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                <span>Theme</span>
              </div>
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>

            {/* Dashboard Button (only when logged in) */}
            {user && (
              <button
                onClick={handleDashboardClick}
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  isDark 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition`}
              >
                <User size={20} />
                <span>Dashboard</span>
              </button>
            )}

            {/* Auth Button */}
            <button
              onClick={handleAuthClick}
              className={`p-3 rounded-lg flex items-center gap-2 ${
                isDark 
                  ? user 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : "bg-green-600 text-white hover:bg-green-700"
                  : user 
                    ? "bg-red-500 text-white hover:bg-red-600" 
                    : "bg-green-500 text-white hover:bg-green-600"
              } transition`}
            >
              {user ? <LogOut size={20} /> : <LogIn size={20} />}
              <span>{user ? "Logout" : "Login"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;