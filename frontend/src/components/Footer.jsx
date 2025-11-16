import React from 'react';
import { translations } from '../data/translations';

function Footer({ isDark, language }) {
  const t = translations[language];
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold mb-2">{t.footer}</p>
        <p className="text-sm opacity-80">{t.contact}</p>
      </div>
    </footer>
  );
}

export default Footer;