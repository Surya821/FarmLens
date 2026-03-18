import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

function AdminLogin({ isDark }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    // For demo purposes, using hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/20 rotate-12">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Admin Portal</h1>
          <p className="text-[var(--muted)] font-medium">Access your management dashboard</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/10 transition-all"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] ml-1">Username</label>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within/input:text-green-500 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-14 pr-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within/input:text-green-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              Authorize Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-[var(--muted)] text-sm font-medium">
          Secure encrypted connection <Shield size={12} className="inline ml-1" />
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
