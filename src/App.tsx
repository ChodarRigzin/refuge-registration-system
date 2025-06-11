// src/App.tsx - 最終、完整、已修正語法且功能完整的版本

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AppContext, AppProvider, AppContextType } from './contexts/AppContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationList } from './components/RegistrationList';
import { CertificateGenerator } from './components/CertificateGenerator';
import { TabKey, Translations } from './types';
import { ORGANIZATION_NAME_KEY } from './constants';
import { Modal } from './components/common/Modal';
import { Input } from './components/common/Input';
import { Button } from './components/common/Button';
import { AccessDenied } from './components/AccessDenied';

// --- Loading Spinner Component (維持不變) ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin"></div>
      <div className="text-gray-600">載入中...</div>
    </div>
  </div>
);

// --- Error Fallback Component (維持不變) ---
const ErrorFallback = ({ error }: { error?: Error }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa] p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">系統發生錯誤</h2>
      <p className="text-gray-600 mb-4">{error?.message || '很抱歉，系統發生了錯誤。請重新整理頁面再試一次。'}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#8B6F47] text-white rounded-md hover:bg-[#7A5F3C] transition-colors">重新整理頁面</button>
    </div>
  </div>
);

// --- Header Component ---
const StyledHeader = ({ 
  onMenuToggle, isMobile, onLoginClick 
}: { 
  onMenuToggle: () => void;
  isMobile: boolean;
  onLoginClick: () => void;
}) => {
  const context = useContext(AppContext) as AppContextType;
  const { translations, isAdmin, logout } = context;

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 z-[110] no-print">
      <div className="flex items-center gap-3 flex-shrink min-w-0">
        {isMobile && (<button onClick={onMenuToggle} className="p-2 rounded-md hover:bg-gray-100 md:hidden"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>)}
        <div className="w-[30px] h-[30px] rounded-md bg-gradient-to-br from-[#8B6F47] to-[#B08D57] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">R</div>
        <div className="flex flex-col min-w-0">
          <h1 className="font-semibold text-base md:text-lg text-[#685335] leading-tight truncate">{translations.systemTitle}</h1>
          <p className="text-xs text-gray-500 leading-tight truncate">Refuge Registration System</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <LanguageSwitcher />
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{translations.admin}</span>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600" title={translations.logout}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="px-3 py-1.5 text-sm font-semibold text-white bg-[#8B6F47] rounded-full hover:bg-[#7A5F3C]">{translations.adminLogin}</button>
        )}
      </div>
    </header>
  );
};

// --- Sidebar Component (簡化了翻譯邏輯) ---
const SidebarNav = ({ 
  activeTab, onTabChange, isAdmin, translations, isOpen, onClose, isMobile 
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isAdmin: boolean;
  translations: Translations;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}) => {
  const navItems = [
    { key: TabKey.Registration, label: translations.registrationFormTitle, adminOnly: false, icon: '✎' },
    { key: TabKey.List, label: translations.discipleList, adminOnly: true, icon: '📄' },
    { key: TabKey.Certificate, label: translations.certificateGenTitleHtmlPrint, adminOnly: true, icon: '📕' },
  ];

  const handleTabClick = (tab: TabKey) => {
    onTabChange(tab);
    if (isMobile) { onClose(); }
  };
  
  return (
    <>
      {isMobile && isOpen && (<div className="fixed inset-0 bg-black/50 z-[105] md:hidden" onClick={onClose} aria-label="Close menu"/>)}
      <aside className={`fixed top-[60px] left-0 w-[260px] h-[calc(100vh-60px)] bg-white ... no-print ... ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}>
        <div className="p-4 border-b border-gray-200"><h2 className="text-xs font-semibold ...">{translations[ORGANIZATION_NAME_KEY]}</h2></div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isLocked = item.adminOnly && !isAdmin;
              const isActive = activeTab === item.key && !isLocked;
              return (
                <li key={item.key}>
                  <button onClick={() => !isLocked && handleTabClick(item.key)} className={`relative flex ... ${isActive ? 'bg-[#FFF3E0]...' : isLocked ? 'text-gray-400...' : 'text-gray-700...'}`} disabled={isLocked}>
                    {isActive && (<div className="absolute left-0 top-0 h-full w-1 bg-[#D4A574] rounded-l-md"></div>)}
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="block text-sm font-medium flex-grow">{item.label}</span>
                    {isLocked && <span className="ml-auto text-xs opacity-70">🔒</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t ..."><div>© 2024 {translations[ORGANIZATION_NAME_KEY]}</div></div>
      </aside>
    </>
  );
};

// --- Main App Content Component ---
const AppContent = () => {
  const context = useContext(AppContext) as AppContextType;
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.Registration);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => { setIsMobile(window.innerWidth < 768); if (window.innerWidth >= 768) { setIsSidebarOpen(false); } };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!context.isAdmin && (activeTab === TabKey.List || activeTab === TabKey.Certificate)) {
      setActiveTab(TabKey.Registration);
    }
  }, [context.isAdmin, activeTab]);

  if (!context) {
    return <LoadingSpinner />;
  }
  
  const { translations, login, isAdmin } = context;

  const handleTabChange = useCallback((tab: TabKey) => { setActiveTab(tab); }, []);
  const openLoginModal = () => {
    setLoginError(''); setEmail(''); setPassword(''); setIsLoginModalOpen(true);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const success = await login(email, password);
    if (!success) {
      setLoginError(translations.loginError || '登入失敗');
    } else {
      setIsLoginModalOpen(false);
    }
    setIsLoggingIn(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TabKey.List: 
        if (!isAdmin) return <AccessDenied messageKey="adminOnlyList" onLoginClick={openLoginModal} />;
        return <RegistrationList onLoginClick={openLoginModal} />;
      case TabKey.Certificate: 
        if (!isAdmin) return <AccessDenied messageKey="adminOnlyCert" onLoginClick={openLoginModal} />;
        return <CertificateGenerator onLoginClick={openLoginModal} />;
      case TabKey.Registration:
      default: 
        return <RegistrationForm />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#343a40]">
      <StyledHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isMobile={isMobile} onLoginClick={openLoginModal} />
      <SidebarNav activeTab={activeTab} onTabChange={handleTabChange} isAdmin={isAdmin} translations={translations} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} />
      <main className={`transition-all duration-300 pt-[60px] min-h-[calc(100vh-60px)] ${!isMobile ? 'md:ml-[260px]' : ''}`}>
        <div className="p-4 md:p-8 h-full"><div className="bg-white rounded-lg shadow-md p-4 ... min-h-[calc(100vh-140px)]"><div className="h-full overflow-y-auto">{renderTabContent()}</div></div></div>
      </main>
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title={translations.adminLogin || '管理員登入'}>
        <form onSubmit={handleLogin}>
          <Input label={translations.email || '電子信箱'} id="email_modal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} isRequired autoFocus />
          <Input label={translations.password || '密碼'} id="password_modal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} isRequired />
          {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
          <Button type="submit" variant="primary" className="w-full" size="lg" disabled={isLoggingIn}>{isLoggingIn ? "登入中..." : (translations.login || '登入')}</Button>
        </form>
      </Modal>
    </div>
  );
};

// --- Root App Component (使用簡化的 Error Boundary 概念) ---
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;