import { Moon, Sun, Globe, LogIn, User, LogOut, Mail, Menu, X, Home, ChevronDown, Leaf, Layers, Info, BookOpen, Stethoscope, Camera, Tag, Microscope, Terminal, Book, Settings, LifeBuoy, FileText } from "lucide-react";
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
  const [activeDropdown, setActiveDropdown] = useState(null); // 'services', 'encyclopedia', 'resources', 'company'
  const dropdownRef = useRef(null);
  const t = translations[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const atHome = location.pathname === '/';

  return (
    <nav className="farmlens-header px-4 py-5">
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
        <div className="hidden lg:flex flex-1 items-center justify-center gap-2" ref={dropdownRef}>
          
          {/* 1. Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`nav-link px-4 py-2 rounded-xl transition-colors ${activeDropdown === 'services' ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Layers size={16} />
              <span className="font-bold">{language === 'en' ? 'Services' : 'सेवाएं'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'services' && (
              <div className="absolute top-full left-0 pt-2 min-w-[280px] z-[150]">
                <div className="dropdown-menu-new animate-fade-in shadow-xl">
                  <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">Analysis Tools</p>
                  <button onClick={() => { navigate('/disease'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Stethoscope size={16} /></div>
                    <span>{t.diseasePredict}</span>
                  </button>
                  <button onClick={() => { navigate('/skin-disease'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"><Microscope size={16} /></div>
                    <span>{t.skinDiseasePredict}</span>
                  </button>
                  <button onClick={() => { navigate('/predict'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><Camera size={16} /></div>
                    <span>{t.goToPredict}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 1.5. Encyclopedia Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('encyclopedia')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`nav-link px-4 py-2 rounded-xl transition-colors ${activeDropdown === 'encyclopedia' ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <BookOpen size={16} />
              <span className="font-bold">{language === 'en' ? 'Encyclopedia' : 'कोश'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'encyclopedia' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'encyclopedia' && (
              <div className="absolute top-full left-0 pt-2 min-w-[200px] z-[150]">
                <div className="dropdown-menu-new animate-fade-in shadow-xl">
                  <button onClick={() => { navigate('/breeds'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500"><BookOpen size={16} /></div>
                    <span>{t.breeds}</span>
                  </button>
                  <button onClick={() => { navigate('/diseases'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500"><Microscope size={16} /></div>
                    <span>{t.diseases}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Pricing - Direct Link */}
          <button
            onClick={() => navigate('/membership')}
            className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname === '/membership' ? 'text-[var(--accent)]' : ''}`}
          >
            <Tag size={16} />
            <span className="font-bold">{t.pricing}</span>
          </button>

          {/* 3. Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`nav-link px-4 py-2 rounded-xl transition-colors ${activeDropdown === 'resources' ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Book size={16} />
              <span className="font-bold">{language === 'en' ? 'Resources' : 'संसाधन'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'resources' && (
              <div className="absolute top-full left-0 pt-2 min-w-[240px] z-[150]">
                <div className="dropdown-menu-new animate-fade-in shadow-xl">
                  <button onClick={() => { navigate('/docs'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Book size={16} /></div>
                    <span>{language === 'en' ? 'Documentation' : 'दस्तावेज़'}</span>
                  </button>
                  {user && (
                    <button onClick={() => { navigate(`/${user.username}/developer`); setActiveDropdown(null); }} className="dropdown-item-new">
                      <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-500"><Terminal size={16} /></div>
                      <span>{language === 'en' ? 'Developer API' : 'एपीआई'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('company')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`nav-link px-4 py-2 rounded-xl transition-colors ${activeDropdown === 'company' ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Info size={16} />
              <span className="font-bold">{language === 'en' ? 'Company' : 'कंपनी'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'company' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'company' && (
              <div className="absolute top-full left-0 pt-2 min-w-[200px] z-[150]">
                <div className="dropdown-menu-new animate-fade-in shadow-xl">
                  <button onClick={() => { navigate('/about'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500"><Info size={16} /></div>
                    <span>{t.about}</span>
                  </button>
                  <button onClick={() => { navigate('/contact'); setActiveDropdown(null); }} className="dropdown-item-new">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500"><Mail size={16} /></div>
                    <span>{language === 'en' ? 'Contact' : 'संपर्क'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Settings (Desktop) */}
          {user && (
            <button
              onClick={() => navigate(`/${user.username}/settings`)}
              className={`nav-link px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${location.pathname.includes('/settings') ? 'text-[var(--accent)]' : ''}`}
            >
              <Settings size={16} />
              <span className="font-bold">{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
            </button>
          )}

        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-3">
            <div className="toggle-pill">
              <span className={`toggle-opt ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</span>
              <span className={`toggle-opt ${language === 'hi' ? 'active' : ''}`} onClick={() => setLanguage('hi')}>हिं</span>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="cursor-pointer w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2 ">
            {user ? (
              <button
                onClick={() => navigate(`/${user.username}/settings`)}
                className="cursor-pointer w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--accent)] transition-all active:scale-95 overflow-hidden shadow-sm"
              >
                {user?.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <User size={18} />}
              </button>
            ) : (
              <button onClick={handleAuthClick} className="btn-primary-new px-4 sm:px-6 py-2 text-sm rounded-xl flex items-center gap-2">
                <LogIn size={16} />
                <span className="max-sm:hidden">{t.login}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)]"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <div 
        className={`lg:hidden fixed inset-0 z-[6000] bg-black/60 backdrop-blur-md transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-[var(--card)] p-6 shadow-2xl overflow-y-auto transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-black text-[var(--accent)]">FarmLens Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center border border-[var(--border)]"><X size={20} /></button>
          </div>

          <div className="space-y-1">
             <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">Exploration</p>
             <button onClick={() => { navigate('/disease'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Stethoscope size={20} /> {t.diseasePredict}</button>
             <button onClick={() => { navigate('/skin-disease'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Microscope size={20} /> {t.skinDiseasePredict}</button>
             <button onClick={() => { navigate('/predict'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Camera size={20} /> {t.goToPredict}</button>
             <button onClick={() => { navigate('/breeds'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><BookOpen size={20} /> {t.breeds}</button>
             <button onClick={() => { navigate('/diseases'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Layers size={20} /> {t.diseases}</button>

             <div className="h-[1px] bg-[var(--border)] my-4 mx-4"></div>
             <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">Main Links</p>
             <button onClick={() => { navigate('/membership'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Tag size={20} /> {t.pricing}</button>
             <button onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Info size={20} /> {t.about}</button>
             <button onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }} className="mobile-nav-item"><Mail size={20} /> {language === 'en' ? 'Contact Us' : 'संपर्क करें'}</button>

             <div className="h-[1px] bg-[var(--border)] my-4 mx-4"></div>
             <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">Settings & Language</p>
             <div className="flex gap-2 p-2">
                <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${language === 'en' ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg shadow-green-500/20' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]'}`}>EN</button>
                <button onClick={() => setLanguage('hi')} className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${language === 'hi' ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg shadow-green-500/20' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]'}`}>हिं</button>
             </div>
                <button onClick={() => { setIsDark(!isDark); setIsMobileMenuOpen(false); }} className="mobile-nav-item mt-2 w-full justify-center bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                   {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />} 
                   <span className="font-black ml-2">{t.toggleTheme}</span>
                </button>

                {user && (
                  <>
                    <div className="h-[1px] bg-[var(--border)] my-4 mx-4"></div>
                    <button onClick={() => { navigate(`/${user.username}/settings`); setIsMobileMenuOpen(false); }} className="mobile-nav-item">
                       <Settings size={20} className="text-slate-500" /> 
                       <span>{language === 'en' ? 'Account Settings' : 'खाता सेटिंग्स'}</span>
                    </button>
                    <button onClick={() => { logout(); navigate('/'); setIsMobileMenuOpen(false); }} className="mobile-nav-item text-red-500 hover:bg-red-500/10">
                       <LogOut size={20} /> 
                       <span>{language === 'en' ? 'Log Out' : 'लॉग आउट'}</span>
                    </button>
                  </>
                )}
             </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;