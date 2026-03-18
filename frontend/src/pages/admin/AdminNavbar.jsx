import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, Users, Database, Layers,
  LogOut, Menu, X, Leaf, ChevronRight, Sun, Moon, Activity, ShieldAlert
} from 'lucide-react';
import logo from '../../assets/farmlens-logo (1).png'

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/manage-breeds', label: 'Manage Breeds', icon: Layers },
  // { to: '/admin/diseases', label: 'Add Disease', icon: Activity },
  { to: '/admin/manage-diseases', label: 'Manage Diseases', icon: ShieldAlert },
];

function AdminNavbar({ isDark, setIsDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between ${
        isDark 
          ? 'bg-[#0a0f0d]/90 border-white/10' 
          : 'bg-white/90 border-green-500/10'
      }`}>
        {/* Logo / Brand */}
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <img src={logo} alt="Logo" className="w-9 h-9 rounded-xl" />
          <div>
            <span className="text-lg font-black text-green-500 tracking-tighter leading-none">
              FarmLens
            </span>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] leading-none">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'text-[var(--muted)] hover:text-green-500 hover:bg-green-500/10'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Logout + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark && setIsDark(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/10 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className={`fixed top-[68px] left-0 right-0 z-40 border-b shadow-2xl px-4 py-4 space-y-1 md:hidden ${
          isDark ? 'bg-[#0a0f0d] border-white/10' : 'bg-white border-green-500/10'
        }`}>
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-green-500 text-white' 
                    : 'text-[var(--muted)] hover:bg-green-500/10 hover:text-green-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} /> {label}
                </div>
                <ChevronRight size={16} />
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </>
  );
}

export default AdminNavbar;
