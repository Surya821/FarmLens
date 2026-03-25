import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { translations } from '../data/translations';
import logo from '../assets/farmlens-logo (1).png';
import { Leaf, Github, Twitter, Mail, Phone, PhoneCall, ChevronDown, Book, Linkedin } from 'lucide-react';

function Footer({ isDark, language }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const t = translations[language];
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-sm:gap-8 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="w-13 h-13"/>
              <span className="text-xl font-black text-[var(--accent)] tracking-tighter">
                FarmLens
              </span>
            </div>
            <p className="text-[var(--muted)] text-sm font-medium leading-relaxed max-w-xs">
              {language === 'en'
                ? 'Empowering livestock owners with state-of-the-art AI technology for better animal health and management.'
                : 'बेहतर पशु स्वास्थ्य और प्रबंधन के लिए अत्याधुनिक AI तकनीक के साथ पशुधन मालिकों को सशक्त बनाना।'}
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/Surya821/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                <Github size={18} />
              </a>
              <a href="https://www.linkedin.com/in/surya-pratap-singh1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              className="font-black text-sm uppercase tracking-widest mb-6 flex items-center justify-between cursor-pointer md:cursor-default group"
            >
              {t.resources}
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-300 md:hidden ${isResourcesOpen ? 'rotate-180' : ''} text-[var(--muted)] group-hover:text-[var(--accent)]`} 
              />
            </h4>
            <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 md:h-auto ${isResourcesOpen ? 'max-h-96 mb-6 opacity-100' : 'max-h-0 md:max-h-none opacity-0 md:opacity-100'}`}>
              <span onClick={() => navigate('/docs')} className="text-[var(--accent)] text-sm font-black hover:underline cursor-pointer transition-colors flex items-center gap-2">
                <Book size={14} /> Documentation
              </span>
              <span onClick={() => navigate('/predict')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{t.aiPredictionLabel}</span>
              <span onClick={() => navigate('/diseases')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{t.diseaseDatabase}</span>
              <span onClick={() => navigate('/breeds')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{t.breedLibrary}</span>
              <span onClick={() => navigate('/about')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{t.expertCare}</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="font-black text-sm uppercase tracking-widest mb-6 flex items-center justify-between cursor-pointer md:cursor-default group"
            >
              {language === 'en' ? 'Services' : 'सेवाएं'}
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-300 md:hidden ${isServicesOpen ? 'rotate-180' : ''} text-[var(--muted)] group-hover:text-[var(--accent)]`} 
              />
            </h4>
            <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 md:h-auto ${isServicesOpen ? 'max-h-96 mb-6 opacity-100' : 'max-h-0 md:max-h-none opacity-0 md:opacity-100'}`}>
              <span onClick={() => navigate('/predict')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{language === 'en' ? 'Breed Recognition' : 'नस्ल पहचान'}</span>
              <span onClick={() => navigate('/disease')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{language === 'en' ? 'Disease Diagnosis' : 'रोग निदान'}</span>
              <span onClick={() => navigate(user ? `/${user.username}` : '/login')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{language === 'en' ? 'Herd Management' : 'झुंड प्रबंधन'}</span>
              <span onClick={() => navigate(user ? `/${user.username}/membership` : '/login')} className="text-[var(--muted)] text-sm font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">{language === 'en' ? 'Premium Membership' : 'प्रीमियम सदस्यता'}</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-6">{t.contact}</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[var(--muted)] text-sm font-semibold">
                <Mail size={16} className="text-[var(--accent)]" />
                <span>farmlens@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--muted)] text-sm font-semibold">
                <Phone size={16} className="text-[var(--accent)]" />
                <span>+91 1800-FARM-CARE</span>
              </div>
              <div className="mt-2 bg-red-500/5 border border-red-500/10 rounded-2xl p-4">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <PhoneCall size={12} /> {t.emergencyHelplineLabel}
                </div>
                <div className="font-black text-red-600 text-lg">
                  1800-FARM-CARE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <span className="text-[var(--muted)] text-xs font-semibold">
            © 2024 FarmLens. All rights reserved. Built with ❤️ for farmers.
          </span>
          <div className="flex gap-6">
            <span onClick={() => navigate('/privacy')} className="text-[var(--muted)] text-xs font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">Privacy Policy</span>
            <span onClick={() => navigate('/terms')} className="text-[var(--muted)] text-xs font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">Terms of Service</span>
            <span onClick={() => navigate('/cookies')} className="text-[var(--muted)] text-xs font-semibold hover:text-[var(--accent)] cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;