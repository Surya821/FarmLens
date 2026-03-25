import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';

function TermsPage({ isDark, language }) {
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen pb-20 pt-10 transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f9faf8]'}`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </div>
          <span className="text-sm uppercase tracking-widest">{language === 'en' ? 'Back' : 'पीछे'}</span>
        </button>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-emerald-600">
              {language === 'en' ? 'Terms & Conditions' : 'नियम एवं शर्तें'}
            </h1>

            <div className="space-y-8 text-[var(--muted)] font-medium leading-relaxed">
              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '1. Acceptance of Terms' : '1. शर्तों की स्वीकृति'}</h2>
                <p>
                  {language === 'en' 
                    ? 'By accessing and using FarmLens, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.'
                    : 'FarmLens का उपयोग करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '2. Use of Services' : '2. सेवाओं का उपयोग'}</h2>
                <p>
                  {language === 'en'
                    ? 'Our AI-powered tools are designed to assist in livestock management. While we strive for high accuracy, results should be used as a guide and not as a substitute for professional veterinary advice.'
                    : 'हमारे AI-आधारित उपकरण पशुधन प्रबंधन में सहायता के लिए डिज़ाइन किए गए हैं। हालांकि हम उच्च सटीकता के लिए प्रयास करते हैं, परिणामों का उपयोग एक गाइड के रूप में किया जाना चाहिए न कि पेशेवर पशु चिकित्सा सलाह के विकल्प के रूप में।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '3. User Responsibilities' : '3. उपयोगकर्ता की जिम्मेदारियां'}</h2>
                <p>
                  {language === 'en'
                    ? 'Users are responsible for the accuracy of the data they upload. You must not use the platform for any illegal or unauthorized purposes.'
                    : 'उपयोगकर्ता उनके द्वारा अपलोड किए गए डेटा की सटीकता के लिए जिम्मेदार हैं। आपको किसी भी अवैध या अनधिकृत उद्देश्यों के लिए प्लेटफॉर्म का उपयोग नहीं करना चाहिए।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '4. Intellectual Property' : '4. बौद्धिक संपदा'}</h2>
                <p>
                  {language === 'en'
                    ? 'All content, logos, and AI models on FarmLens are the property of FarmLens and are protected by intellectual property laws.'
                    : 'FarmLens पर सभी सामग्री, लोगो और AI मॉडल FarmLens की संपत्ति हैं और बौद्धिक संपदा कानूनों द्वारा संरक्षित हैं।'}
                </p>
              </section>

              <section className="pt-8 border-t border-[var(--border)]">
                <p className="text-xs">
                  {language === 'en' 
                    ? 'Last Updated: March 2024. For more information, contact us at farmlens@example.com.'
                    : 'अंतिम अपडेट: मार्च 2024। अधिक जानकारी के लिए, हमसे farmlens@example.com पर संपर्क करें।'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
