import React, { useState } from 'react';
import { Check, Zap, Star, Shield, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { translations } from '../../data/translations';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

function MembershipPage({ isDark, language }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const t = translations[language];
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handlePayment = async (plan) => {
    if (plan.price === "0") return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to subscribe");
        navigate('/login');
        return;
      }

      const stripe = await stripePromise;
      const response = await fetch(`${API_BASE}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: plan.name,
          price: parseInt(plan.price),
          billingCycle: billingCycle
        })
      });

      const session = await response.json();
      if (session.error) throw new Error(session.error);

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const plans = [
    {
      name: t.freePlan,
      icon: <Home className="text-blue-500" size={24} />,
      price: billingCycle === 'monthly' ? "0" : "0",
      description: t.idealForBeginners,
      features: [
        t.aiScansPerMonth10,
        t.symptomAnalyses50,
        t.digitalRecords,
      ],
      buttonText: user?.membership === 'Free' ? t.currentPlan : t.getStarted,
      popular: false,
      color: "blue",
      isCurrent: user?.membership === 'Free' || (!user?.membership && true) // Default is free
    },
    {
      name: t.proPlan,
      icon: <Zap className="text-green-500" size={24} />,
      price: billingCycle === 'monthly' ? "499" : "4999",
      description: t.perfectForActiveFarmers,
      features: [
        t.aiScansPerMonth100,
        t.symptomAnalyses500,
        t.advancedAnalytics,
        t.digitalRecords,
        t.priorityEmailSupport
      ],
      buttonText: user?.membership === 'Pro' ? t.currentPlan : t.getStarted,
      popular: true,
      color: "green",
      isCurrent: user?.membership === 'Pro'
    },
    {
      name: t.enterprisePlan,
      icon: <Star className="text-purple-500" size={24} />,
      price: billingCycle === 'monthly' ? "1999" : "19999",
      description: t.forLargeScaleOperations,
      features: [
        t.everythingInPro,
        t.prioritySupport,
        t.multiUserAccess,
        t.apiAccess,
        t.personalizedTraining
      ],
      buttonText: user?.membership === 'Enterprise' ? t.currentPlan : t.getStarted,
      popular: false,
      color: "purple",
      isCurrent: user?.membership === 'Enterprise'
    }
  ];

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
            <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
          </div>
          <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
        </button>
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[var(--accent)] to-green-400 bg-clip-text text-transparent">
            {t.membershipPlans}
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            {t.choosePlan}
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
              {t.monthly}
            </span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] relative transition-all flex items-center p-1"
            >
              <div className={`w-6 h-6 rounded-full bg-[var(--accent)] transition-all transform ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
              {t.yearly}
              <span className="ml-2 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] uppercase tracking-wider">
                {t.bestValue}
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`pricing-card relative p-8 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 flex flex-col ${
                plan.popular 
                ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-2xl scale-105 z-10' 
                : 'border-[var(--border)] bg-[var(--card)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--accent)] text-white text-sm font-bold shadow-lg">
                  {t.popular}
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-500/10 flex items-center justify-center mb-6`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-[var(--muted)] text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹{plan.price}</span>
                  <span className="text-[var(--muted)]">/{billingCycle === 'monthly' ? t.monthly : t.yearly}</span>
                </div>
              </div>

              <div className="flex-1 mb-8">
                <p className="font-bold text-sm mb-4 uppercase tracking-wider text-[var(--muted)]">{t.features}</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Check size={16} className="text-[var(--accent)]" />
                      </div>
                      <span className="text-sm text-[var(--muted)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handlePayment(plan)}
                disabled={plan.isCurrent}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  plan.popular 
                  ? 'btn-primary-new' 
                  : plan.isCurrent 
                    ? 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] cursor-default'
                    : 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                } ${plan.isCurrent && plan.popular ? 'opacity-50 grayscale cursor-default' : ''}`}
              >
                {plan.buttonText}
                {!plan.isCurrent && <ArrowRight size={18} />}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <Shield className="text-[var(--accent)] mb-4" size={32} />
            <h4 className="font-bold mb-2">{t.securePayments}</h4>
            <p className="text-sm text-[var(--muted)]">{t.securePaymentsDesc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <Zap className="text-[var(--accent)] mb-4" size={32} />
            <h4 className="font-bold mb-2">{t.instantActivation}</h4>
            <p className="text-sm text-[var(--muted)]">{t.instantActivationDesc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <Home className="text-[var(--accent)] mb-4" size={32} />
            <h4 className="font-bold mb-2">{t.cancelAnytime}</h4>
            <p className="text-sm text-[var(--muted)]">{t.cancelAnytimeDesc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <Star className="text-[var(--accent)] mb-4" size={32} />
            <h4 className="font-bold mb-2">{t.premiumSupport}</h4>
            <p className="text-sm text-[var(--muted)]">{t.premiumSupportDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembershipPage;
