import React from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';

const UsageLimitModal = ({ isOpen, onClose, language = 'en' }) => {
  const navigate = useNavigate();
  const t = translations[language] || translations['en'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      <div className="relative bg-[var(--card)] border border-[var(--border)] w-full max-w-md rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 slide-in-from-bottom-10">
        <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <i className="fa-solid fa-crown text-3xl text-amber-500 animate-pulse"></i>
        </div>
        <h2 className="text-3xl font-black text-center mb-4 tracking-tight text-[var(--text)]">
          {language === 'en' ? 'Scanning Limit Reached' : 'स्कैनिंग सीमा समाप्त'}
        </h2>
        <p className="text-[var(--muted)] font-medium text-center mb-8 leading-relaxed">
          {language === 'en' 
            ? "You've used all your free scans for this month. Upgrade to our Premium plan to unlock more AI recognition!" 
            : "आपने इस महीने के लिए अपने सभी मुफ़्त स्कैन का उपयोग कर लिया है। अधिक एआई पहचान अनलॉक करने के लिए हमारे प्रीमियम प्लान पर अपग्रेड करें!"}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/membership');
            }}
            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-black shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {language === 'en' ? 'Get More Scans' : 'अधिक स्कैन प्राप्त करें'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 text-[var(--muted)] font-black hover:text-[var(--text)] transition-colors text-sm uppercase tracking-widest"
          >
            {language === 'en' ? 'Cancel' : 'रद्द करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;
