import { Moon, Sun, Globe, LogIn, User, LogOut, Menu, X, Home, ChevronDown, Leaf, Layers, Info, BookOpen, Stethoscope, Camera, Tag, Microscope, Terminal, Book, Settings } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/farmlens-logo (1).png'
import { useState, useEffect, useRef } from 'react';
import { translations } from '../data/translations';

function Header({ isDark, setIsDark, language, setLanguage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const t = translations[language];

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (atDashboard) {
      navigate('/');
    } else {
      navigate(`/${user.username}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const atDashboard = user && location.pathname === `/${user.username}`;
  const atHome = location.pathname === '/';

  return (
    <nav className="navbar px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-5 w-full">
        {/* Logo */}
        <div
          onClick={handleHomeClick}
          className="flex items-center gap-3 flex-shrink-0 cursor-pointer group"
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-[var(--accent)] tracking-tighter leading-none">
              FarmLens
            </span>
            {user && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-70 mt-0.5">
                {user.membership || 'Free'}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-2">
          {/* Services Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              onClick={() => navigate('/services')}
              className={`nav-link px-4 py-2 rounded-xl transition-colors ${location.pathname === '/services' || isDropdownOpen ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Layers size={16} />
              <span className="font-bold">{t.services}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 min-w-[280px] z-[150]">
                <div className="dropdown-menu-new animate-fade-in shadow-xl">
                  <button
                    onClick={() => { navigate('/disease'); setIsDropdownOpen(false); }}
                    className="dropdown-item-new"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Stethoscope size={16} />
                    </div>
                    <span>{t.diseasePredict}</span>
                  </button>
                  <button
                    onClick={() => { navigate('/skin-disease'); setIsDropdownOpen(false); }}
                    className="dropdown-item-new"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                      <Microscope size={16} />
                    </div>
                    <span>{t.skinDiseasePredict}</span>
                  </button>
                  <button
                    onClick={() => { navigate('/predict'); setIsDropdownOpen(false); }}
                    className="dropdown-item-new"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                      <Camera size={16} />
                    </div>
                    <span>{t.goToPredict}</span>
                  </button>
                  <div className="h-[1px] bg-[var(--border)] my-1"></div>
                  <button
                    onClick={() => { navigate('/docs'); setIsDropdownOpen(false); }}
                    className="dropdown-item-new group/btn"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/5 flex items-center justify-center text-[var(--accent)] group-hover/btn:bg-[var(--accent)] group-hover/btn:text-white transition-all">
                      <Book size={14} />
                    </div>
                    <span className="font-bold text-[var(--accent)]">{language === 'en' ? 'Guides & Documentation' : 'दस्तावेज़ और गाइड'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/breeds')}
            className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname === '/breeds' ? 'text-[var(--accent)]' : ''}`}
          >
            <BookOpen size={16} />
            <span className="font-bold">{t.breeds}</span>
          </button>

          <button
            onClick={() => navigate('/diseases')}
            className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname === '/diseases' ? 'text-[var(--accent)]' : ''}`}
          >
            <Microscope size={16} />
            <span className="font-bold">{t.diseases}</span>
          </button>

          <button
            onClick={() => navigate('/about')}
            className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname === '/about' ? 'text-[var(--accent)]' : ''}`}
          >
            <Info size={16} />
            <span className="font-bold">{t.about}</span>
          </button>

          <button
            onClick={() => navigate('/membership')}
            className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname === '/membership' ? 'text-[var(--accent)]' : ''}`}
          >
            <Tag size={16} />
            <span className="font-bold">{t.pricing}</span>
          </button>

          {user && (
            <button
              onClick={() => navigate(`/${user.username}/developer`)}
              className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname.includes('/developer') ? 'text-[var(--accent)]' : ''}`}
            >
              <Terminal size={16} />
              <span className="font-bold">{language === 'en' ? 'API' : 'एपीआई'}</span>
            </button>
          )}
        </div>

        {/* Right Controls (Mobile & Desktop) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Desktop Only Theme/Lang */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="toggle-pill">
              <span
                className={`toggle-opt ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </span>
              <span
                className={`toggle-opt ${language === 'hi' ? 'active' : ''}`}
                onClick={() => setLanguage('hi')}
              >
                हिं
              </span>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="cursor-pointer w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
              title={t.toggleTheme}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* User Auth - Always Visible Outside Dropdown */}
          <div className="flex items-center gap-2 ">
            {user ? (
              <div className="flex items-center gap-2 ">
                <button
                  onClick={() => navigate(`/${user.username}/settings`)}
                  className="cursor-pointer w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--accent)] transition-all active:scale-95 overflow-hidden shadow-sm"
                  title={t.accountSettings || 'Account Settings'}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="btn-primary-new px-4 sm:px-6 py-2 text-sm rounded-xl flex items-center"
              >
                <LogIn size={16} className="" />
                <span className="max-sm:hidden">{t.login}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] active:scale-95 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[var(--card)] border-b border-[var(--border)] shadow-2xl animate-fade-in p-4 z-[200] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col gap-2 pb-20">
            <button
              onClick={() => { navigate('/services'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <Layers size={20} />
              </div>
              <span className="font-bold text-base">{t.services}</span>
            </button>

            <button
              onClick={() => { navigate('/docs'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <Book size={20} />
              </div>
              <span className="font-bold text-base">{language === 'en' ? 'Guide & API' : 'गाइड और एपीआई'}</span>
            </button>

            <button
              onClick={() => { navigate('/breeds'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <BookOpen size={20} />
              </div>
              <span className="font-bold text-base">{t.breedsLibrary}</span>
            </button>

            <button
              onClick={() => { navigate('/diseases'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Microscope size={20} />
              </div>
              <span className="font-bold text-base">{t.diseases}</span>
            </button>

            <button
              onClick={() => { navigate('/membership'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Tag size={20} />
              </div>
              <span className="font-bold text-base">{t.pricing}</span>
            </button>

            <button
              onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Info size={20} />
              </div>
              <span className="font-bold text-base">{t.about}</span>
            </button>

            {user && (
              <button
                onClick={() => { navigate(`/${user.username}/developer`); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Terminal size={20} />
                </div>
                <span className="font-bold text-base">Developer API</span>
              </button>
            )}

            {user && (
              <button
                onClick={() => { navigate(`/${user.username}/settings`); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Settings size={20} />
                </div>
                <span className="font-bold text-base">{t.settings}</span>
              </button>
            )}

            <div className="h-[1px] bg-[var(--border)] my-2"></div>

            <div className="flex items-center justify-between p-2">
              <span className="font-bold text-[var(--muted)] text-sm">{t.appearanceRegion}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="toggle-pill">
                  <span className={`toggle-opt ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</span>
                  <span className={`toggle-opt ${language === 'hi' ? 'active' : ''}`} onClick={() => setLanguage('hi')}>हिं</span>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:hidden">
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;