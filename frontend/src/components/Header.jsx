import { Moon, Sun, Globe, LogIn, User, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/farmlens-logo (1).png'

function Header({ isDark, setIsDark, language, setLanguage }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const handleDashboardClick = () => {
    navigate(`/${user.username}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1
          onClick={() => navigate("/")}
          className={`flex items-center gap-2 text-3xl font-bold cursor-pointer ${
            isDark ? "text-green-400" : "text-green-600"
          }`}
        >
          <img src={logo} alt="logo" width="50px" />
          FarmLens
        </h1>

        <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
}

export default Header;