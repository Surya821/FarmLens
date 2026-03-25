import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

/* ─────────────────────────────────────────
   FORGOT PASSWORD MODAL  (3 internal steps)
   Step 1 → enter email
   Step 2 → enter OTP
   Step 3 → enter new password + confirm
───────────────────────────────────────── */
export function ForgotPasswordModal({ onClose, language }) {
  const [step, setStep] = useState(1); // 1 | 2 | 3
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);

  const hi = language === 'hi';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error(hi ? 'ईमेल आवश्यक है' : 'Email is required');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(hi ? 'OTP आपकी ईमेल पर भेजा गया' : 'OTP sent to your email. Check your inbox!');
        setStep(2);
      } else {
        toast.error(data.error || (hi ? 'विफल' : 'Failed'));
      }
    } catch {
      toast.error(hi ? 'नेटवर्क त्रुटि' : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) return toast.error(hi ? '6 अंकों का OTP दर्ज करें' : 'Enter the 6-digit OTP');
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error(hi ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
    if (newPassword.length < 8) return toast.error(hi ? 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए' : 'Password must be at least 8 characters');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(hi ? 'पासवर्ड सफलतापूर्वक रीसेट हुआ' : 'Password reset successfully!');
        onClose();
      } else {
        toast.error(data.error || (hi ? 'विफल' : 'Reset failed'));
      }
    } catch {
      toast.error(hi ? 'नेटवर्क त्रुटि' : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    hi ? 'ईमेल दर्ज करें' : 'Enter Your Email',
    hi ? 'OTP सत्यापित करें' : 'Verify OTP',
    hi ? 'नया पासवर्ड' : 'Set New Password'
  ];

  return (
    <ModalShell onClose={onClose} title={stepTitles[step - 1]} icon={<KeyRound size={22} className="text-[var(--accent)]" />}>
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === s ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 scale-110' :
                step > s ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                  'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'
              }`}>{s}</div>
            {s < 3 && <div className={`h-0.5 flex-1 w-8 rounded-full transition-all ${step > s ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Email */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <p className="text-sm text-[var(--muted)] font-medium">
            {hi ? 'आपके रजिस्टर्ड ईमेल पर OTP भेजा जाएगा' : 'An OTP will be sent to your registered email'}
          </p>
          <ModalInput
            icon={<Mail size={16} />}
            type="email"
            placeholder={hi ? 'ईमेल पता' : 'Email address'}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <ModalButton loading={loading} label={hi ? 'OTP भेजें' : 'Send OTP'} />
        </form>
      )}

      {/* Step 2: OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-[var(--muted)] font-medium">
            {hi ? `${email} पर OTP भेजा गया — अपना inbox जाँचें` : `OTP sent to ${email} — check your inbox`}
          </p>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="• • • • • •"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full text-center text-3xl font-black tracking-[0.6em] py-4 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl outline-none focus:border-[var(--accent)] text-[var(--text)] transition-all"
              required
            />
          </div>
          <ModalButton loading={false} label={hi ? 'OTP सत्यापित करें' : 'Verify OTP'} />
          <button
            type="button"
            onClick={() => { setStep(1); setOtp(''); }}
            className="w-full text-xs text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors"
          >
            {hi ? 'ईमेल बदलें' : '← Change email'}
          </button>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <ModalInput
            icon={<Lock size={16} />}
            type={showNew ? 'text' : 'password'}
            placeholder={hi ? 'नया पासवर्ड' : 'New password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            toggle={() => setShowNew(!showNew)}
            showToggle={showNew}
            required
          />
          <ModalInput
            icon={<ShieldCheck size={16} />}
            type={showConf ? 'text' : 'password'}
            placeholder={hi ? 'पासवर्ड की पुष्टि करें' : 'Confirm new password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            toggle={() => setShowConf(!showConf)}
            showToggle={showConf}
            required
          />
          {confirmPassword && (
            <p className={`text-xs font-bold ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
              {newPassword === confirmPassword
                ? (hi ? '✓ पासवर्ड मेल खाते हैं' : '✓ Passwords match')
                : (hi ? '✗ पासवर्ड मेल नहीं खाते' : '✗ Passwords do not match')}
            </p>
          )}
          <ModalButton loading={loading} label={hi ? 'पासवर्ड रीसेट करें' : 'Reset Password'} />
        </form>
      )}
    </ModalShell>
  );
}

/* ─────────────────────────────────────────
   CHANGE PASSWORD MODAL  (single step)
   Requires: current pass, new pass, confirm
───────────────────────────────────────── */
export function ChangePasswordModal({ onClose, language }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);

  const hi = language === 'hi';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error(hi ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
    if (newPassword.length < 8) return toast.error(hi ? 'पासवर्ड कम से कम 8 अक्षर' : 'Password must be at least 8 characters');
    if (currentPassword === newPassword) return toast.error(hi ? 'नया पासवर्ड पुराने से अलग होना चाहिए' : 'New password must differ from current');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/user/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(hi ? 'पासवर्ड सफलतापूर्वक बदला' : 'Password changed successfully!');
        onClose();
      } else {
        toast.error(data.error || (hi ? 'विफल' : 'Failed'));
      }
    } catch {
      toast.error(hi ? 'नेटवर्क त्रुटि' : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={hi ? 'पासवर्ड बदलें' : 'Change Password'} icon={<Lock size={22} className="text-[var(--accent)]" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ModalInput
          icon={<Lock size={16} />}
          type={showCurrent ? 'text' : 'password'}
          placeholder={hi ? 'वर्तमान पासवर्ड' : 'Current password'}
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          toggle={() => setShowCurrent(!showCurrent)}
          showToggle={showCurrent}
          required
        />
        <ModalInput
          icon={<Lock size={16} />}
          type={showNew ? 'text' : 'password'}
          placeholder={hi ? 'नया पासवर्ड' : 'New password'}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          toggle={() => setShowNew(!showNew)}
          showToggle={showNew}
          required
        />
        <ModalInput
          icon={<ShieldCheck size={16} />}
          type={showConf ? 'text' : 'password'}
          placeholder={hi ? 'नए पासवर्ड की पुष्टि करें' : 'Confirm new password'}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          toggle={() => setShowConf(!showConf)}
          showToggle={showConf}
          required
        />
        {confirmPassword && (
          <p className={`text-xs font-bold ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
            {newPassword === confirmPassword
              ? (hi ? '✓ पासवर्ड मेल खाते हैं' : '✓ Passwords match')
              : (hi ? '✗ पासवर्ड मेल नहीं खाते' : '✗ Passwords do not match')}
          </p>
        )}
        <ModalButton loading={loading} label={hi ? 'पासवर्ड बदलें' : 'Change Password'} />
      </form>
    </ModalShell>
  );
}

/* ── Shared Sub-Components ── */

function ModalShell({ onClose, title, icon, children }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[var(--card)] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                {icon}
              </div>
              <h2 className="text-xl font-black text-[var(--text)] tracking-tight">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:rotate-90 transition-transform text-[var(--muted)]"
            >
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalInput({ icon, type, placeholder, value, onChange, toggle, showToggle, required }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl focus-within:border-[var(--accent)] transition-all group">
      <span className="text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent border-none outline-none w-full font-bold text-[var(--text)] placeholder:font-normal placeholder:text-[var(--muted)]/60 text-sm"
      />
      {toggle && (
        <button type="button" onClick={toggle} className="shrink-0 text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
          {showToggle ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

function ModalButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : null}
      {label}
    </button>
  );
}
