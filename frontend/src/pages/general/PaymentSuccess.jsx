import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { translations } from '../../data/translations';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

function PaymentSuccess({ isDark, language }) {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const t = translations[language];

  useEffect(() => {
    if (!sessionId) {
      navigate('/membership');
      return;
    }
    
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        
        const response = await fetch(`${API_BASE}/api/payment/verify-session?session_id=${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          toast.success(`Payment verified! You are now a ${data.plan} member.`);
          
          // Refresh user data from server
          const userResponse = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            updateUser(userData);
          }
        } else {
          toast.error("Failed to verify payment status.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("An error occurred during verification.");
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-[var(--accent)]/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="text-[var(--accent)]" size={48} />
          </div>
          
          <h1 className="text-3xl font-black mb-4 text-[var(--text)]">
            Payment Successful!
          </h1>
          
          <p className="text-[var(--muted)] font-medium mb-10 leading-relaxed">
            Your subscription has been activated. You now have full access to all premium diagnostic tools and advanced analytics.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
