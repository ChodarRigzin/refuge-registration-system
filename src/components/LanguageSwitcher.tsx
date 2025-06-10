// 這是修改後的 LanguageSwitcher.tsx
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Language } from '../types';

export const LanguageSwitcher: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;

  const { language, setLanguage } = context;

  // 我們把按鈕的樣式改得更簡潔，讓它能融入任何背景
  const buttonStyle = "px-2 py-1 text-sm font-medium rounded-md transition-colors";
  const activeStyle = "text-[#8B6F47] bg-gray-200";
  const inactiveStyle = "text-gray-500 hover:text-gray-800 hover:bg-gray-100";

  return (
    <>
      <button
        onClick={() => setLanguage('zh')}
        className={`${buttonStyle} ${language === 'zh' ? activeStyle : inactiveStyle}`}
      >
        中
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`${buttonStyle} ${language === 'en' ? activeStyle : inactiveStyle}`}
      >
        EN
      </button>
    </>
  );
};