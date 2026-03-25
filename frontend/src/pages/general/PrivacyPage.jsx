import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';

function PrivacyPage({ isDark, language }) {
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
            <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
          </div>
          <span className="text-sm uppercase tracking-widest">{language === 'en' ? 'Back' : 'पीछे'}</span>
        </button>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              {language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </h1>

            <div className="space-y-8 text-[var(--muted)] font-medium leading-relaxed">
              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '1. Information We Collect' : '1. जानकारी जो हम एकत्र करते हैं'}</h2>
                <p>
                  {language === 'en' 
                    ? 'We collect information you provide directly to us, such as when you create an account, upload cattle photos, or contact support.'
                    : 'हम वह जानकारी एकत्र करते हैं जो आप हमें सीधे प्रदान करते हैं, जैसे कि जब आप एक खाता बनाते हैं, मवेशियों की तस्वीरें अपलोड करते हैं, या सहायता से संपर्क करते हैं।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '2. How We Use Information' : '2. हम जानकारी का उपयोग कैसे करते हैं'}</h2>
                <p>
                  {language === 'en'
                    ? 'We use your information to provide and improve our AI services, maintain your herd records, and communicate with you about updates.'
                    : 'हम आपकी जानकारी का उपयोग अपनी AI सेवाओं को प्रदान करने और सुधारने, आपके झुंड के रिकॉर्ड को बनाए रखने और अपडेट के बारे में आपसे संवाद करने के लिए करते हैं।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '3. Data Security' : '3. डेटा सुरक्षा'}</h2>
                <p>
                  {language === 'en'
                    ? 'We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or alteration.'
                    : 'हम आपके व्यक्तिगत डेटा को अनधिकृत पहुंच, प्रकटीकरण या परिवर्तन से बचाने के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? '4. Your Rights' : '4. आपके अधिकार'}</h2>
                <p>
                  {language === 'en'
                    ? 'You have the right to access, update, or delete your personal information at any time through your profile settings.'
                    : 'आपको अपनी प्रोफ़ाइल सेटिंग्स के माध्यम से किसी भी समय अपनी व्यक्तिगत जानकारी तक पहुँचने, अपडेट करने या हटाने का अधिकार है।'}
                </p>
              </section>

              <section className="pt-8 border-t border-[var(--border)]">
                <p className="text-xs">
                  {language === 'en' 
                    ? 'Last Updated: March 2024. Your privacy is our priority.'
                    : 'अंतिम अपडेट: मार्च 2024। आपकी गोपनीयता हमारी प्राथमिकता है।'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
