
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Language } from '../types';

export const LanguageSwitcher: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { language, setLanguage, translations } = context;

  const switchLang = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="fixed top-4 left-4 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg flex gap-1 z-[1000] no-print">
      <button
        onClick={() => switchLang('zh')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
          language === 'zh' ? 'bg-[var(--primary-color)] text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-[var(--cream)] hover:text-[var(--primary-dark)]'
        }`}
        aria-pressed={language === 'zh'}
      >
        {translations.chinese || '中文'}
      </button>
      <button
        onClick={() => switchLang('en')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
          language === 'en' ? 'bg-[var(--primary-color)] text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-[var(--cream)] hover:text-[var(--primary-dark)]'
        }`}
        aria-pressed={language === 'en'}
      >
        {translations.english || 'English'}
      </button>
    </div>
  );
};