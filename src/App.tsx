// 這是修改好的完整 App.tsx 檔案，請直接用它取代您現有的檔案內容

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AppContext, AppProvider } from './contexts/AppContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
// 我們不再需要 LoginStatus 元件，因為邏輯已經整合進 Header
// import { LoginStatus } from './components/LoginStatus'; 
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationList } from './components/RegistrationList';
import { CertificateGenerator } from './components/CertificateGenerator';
import { TabKey, Translations } from './types';
import { ORGANIZATION_NAME_KEY } from './constants';
import { Modal } from './components/common/Modal';
import { Input } from './components/common/Input';
import { Button } from './components/common/Button';

// Loading 組件 (不變)
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#8B6F47] border-t-transparent rounded-full animate-spin"></div>
      <div className="text-gray-600">載入中...</div>
    </div>
  </div>
);

// Error Fallback 組件 (不變)
const ErrorFallback: React.FC<{ error?: Error; resetError?: () => void }> = ({ error, resetError }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa] p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">系統發生錯誤</h2>
      <p className="text-gray-600 mb-4">
        {error?.message || '很抱歉，系統發生了錯誤。請重新整理頁面再試一次。'}
      </p>
      <button
        onClick={() => {
          if (resetError) resetError();
          else window.location.reload();
        }}
        className="px-4 py-2 bg-[#8B6F47] text-white rounded-md hover:bg-[#7A5F3C] transition-colors"
      >
        重新整理頁面
      </button>
    </div>
  </div>
);

// ===== 修改點 1：修改 StyledHeader 的定義 =====
const StyledHeader: React.FC<{ 
  translations: Translations;
  onMenuToggle: () => void;
  isMobile: boolean;
  onLoginClick: () => void; // 新增這一行，告訴它會收到一個叫做 onLoginClick 的函式
}> = ({ translations, onMenuToggle, isMobile, onLoginClick }) => { // 也要在這裡接收 onLoginClick
  const context = useContext(AppContext);

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 z-[110] no-print">
      {/* ===== 左邊區塊 ===== */}
      <div className="flex items-center gap-3 flex-shrink min-w-0">
        {isMobile && (
          <button onClick={onMenuToggle} className="p-2 rounded-md hover:bg-gray-100 md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="w-[30px] h-[30px] rounded-md bg-gradient-to-br from-[#8B6F47] to-[#B08D57] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          R
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-base md:text-lg text-[#685335] leading-tight">
            {translations.systemTitle || '皈依弟子註冊系統'}
          </h1>
          <p className="text-xs text-gray-500 leading-tight">
            Refuge Registration System
          </p>
        </div>
      </div>

      {/* ===== 右邊區塊 ===== */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
        </div>

        {context && (
          <>
            {context.isAdmin ? (
              // 如果是管理員，顯示管理員資訊和登出按鈕
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8B6F47] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {translations.admin || '管理員'}
                  </span>
                </div>
                <button
                  onClick={context.logout}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                  title={translations.logout || '登出'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              // 如果不是管理員，顯示登入按鈕
              <button
                onClick={onLoginClick} // 使用從 AppContent 傳進來的 onLoginClick 函式
                className="px-3 py-1.5 text-sm font-semibold text-white bg-[#8B6F47] rounded-full hover:bg-[#7A5F3C] transition-colors"
              >
                {translations.adminLogin || '管理員登入'}
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

// Sidebar 組件 (不變)
const SidebarNav: React.FC<{
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isAdmin: boolean;
  translations: Translations;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}> = ({ activeTab, onTabChange, isAdmin, translations, isOpen, onClose, isMobile }) => {
  const navItems = [
    { 
      key: TabKey.Registration, 
      label: translations.registrationTitle || translations.registrationFormTitle || '註冊表單',
      adminOnly: false,
      icon: '✎'
    },
    { 
      key: TabKey.List, 
      label: translations.listTitle || translations.discipleList || '皈依弟子名單',
      adminOnly: true,
      icon: '📄'
    },
    { 
      key: TabKey.Certificate, 
      label: translations.certificateTitle || '皈依證書',
      adminOnly: true,
      icon: '📕'
    },
  ];

  const handleTabClick = (tab: TabKey) => {
    onTabChange(tab);
    if (isMobile) {
      onClose();
    }
  };
  
  return (
    <>
      {/* 遮罩層 */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[105] md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      
      {/* 側邊欄 */}
      <aside className={`
        fixed top-[60px] left-0 w-[260px] h-[calc(100vh-60px)] 
        bg-white border-r border-gray-200 flex flex-col no-print
        transition-transform duration-300 ease-in-out z-[106]
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xs font-semibold text-[#333] mb-0">
            {translations[ORGANIZATION_NAME_KEY] || '噶陀仁珍千寶佛學會'}
          </h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isLocked = item.adminOnly && !isAdmin;
              const isActive = activeTab === item.key && !isLocked;
              
              return (
                <li key={item.key}>
                  <button 
                    onClick={() => !isLocked && handleTabClick(item.key)} 
                    className={`
                      relative flex items-center gap-3 w-full text-left 
                      py-3 px-4 text-sm transition-all duration-200 rounded-md
                      ${isActive 
                        ? 'bg-[#FFF3E0] text-[#8B6F47] font-semibold' 
                        : isLocked 
                          ? 'text-gray-400 bg-gray-50 cursor-not-allowed opacity-60' 
                          : 'text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#8B6F47]'
                      }
                    `}
                    disabled={isLocked}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#D4A574] rounded-l-md"></div>
                    )}
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="block text-sm font-medium flex-grow">{item.label}</span>
                    {isLocked && <span className="ml-auto text-xs opacity-70">🔒</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 text-center">
          <div>© 2024 {translations[ORGANIZATION_NAME_KEY] || '噶陀仁珍千寶佛學會'}</div>
        </div>
      </aside>
    </>
  );
};

// 主要內容組件
const AppContent: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.Registration);
  const [isLoginModalOpenFromAccess, setIsLoginModalOpenFromAccess] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (context && !context.isAdmin && (activeTab === TabKey.List || activeTab === TabKey.Certificate)) {
      setActiveTab(TabKey.Registration);
    }
  }, [context?.isAdmin, activeTab]);

  if (error) {
    return <ErrorFallback error={error} resetError={() => setError(null)} />;
  }

  if (!context) {
    return <LoadingSpinner />;
  }
  
  const { translations, login, isAdmin } = context;

  const handleTabChange = useCallback((tab: TabKey) => {
    try {
      setActiveTab(tab);
    } catch (err) {
      console.error('Tab change error:', err);
      setError(err as Error);
    }
  }, []);

  const openLoginModalFromAccess = () => {
    setLoginError(''); 
    setUsername(''); 
    setPassword(''); 
    setIsLoginModalOpenFromAccess(true);
  };
  
  const handleLoginFromAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {

 // ===== 請在這裡加上這兩行 =====
    console.log('準備登入的帳號:', `'${username}'`);
    console.log('準備登入的密碼:', `'${password}'`);
    // =============================

      if (!login(username, password)) {
        setLoginError(translations.loginError || '登入失敗，請檢查帳號密碼');
      } else {
        setIsLoginModalOpenFromAccess(false);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('系統錯誤，請稍後再試');
    }
  };

  const renderTabContent = () => {
    if (!isAdmin && (activeTab === TabKey.List || activeTab === TabKey.Certificate)) {
      return (
        <div className="text-center p-8 text-gray-500">
          <AccessDenied messageKey="accessDenied" onLoginClick={openLoginModalFromAccess} />
        </div>
      );
    }
    
    try {
      switch (activeTab) {
        case TabKey.Registration: 
          return <RegistrationForm />;
        case TabKey.List: 
          return <RegistrationList onLoginClick={openLoginModalFromAccess} />;
        case TabKey.Certificate: 
          return <CertificateGenerator onLoginClick={openLoginModalFromAccess} />;
        default: 
          return <RegistrationForm />;
      }
    } catch (err) {
      console.error('Error rendering tab content:', err);
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">載入內容時發生錯誤</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#8B6F47] text-white rounded-md hover:bg-[#7A5F3C]"
          >
            重新載入
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#343a40]">
      {/* ===== 修改點 2：在使用 StyledHeader 的地方，把函式傳進去 ===== */}
      <StyledHeader 
        translations={translations} 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
        onLoginClick={openLoginModalFromAccess} // 把 openLoginModalFromAccess 這個函式交給 StyledHeader
      />
      
      <SidebarNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isAdmin={isAdmin} 
        translations={translations}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      <main className={`
        transition-all duration-300 pt-[60px] min-h-[calc(100vh-60px)]
        ${!isMobile ? 'md:ml-[260px]' : ''}
      `}>
        <div className="p-4 md:p-8 h-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8 min-h-[calc(100vh-140px)]">
            <div className="h-full overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
      
      <Modal 
        isOpen={isLoginModalOpenFromAccess} 
        onClose={() => {
          setIsLoginModalOpenFromAccess(false);
          setLoginError('');
          setUsername('');
          setPassword('');
        }} 
        title={translations.adminLogin || '管理員登入'}
      >
        <div onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleLoginFromAccess(e as any);
          }
        }}>
          <Input 
            label={translations.username || '帳號'} 
            id="username_access_modal" 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            isRequired 
            autoFocus 
            className="mb-4 text-base"
            autoComplete="new-password"
          />
          <Input 
            label={translations.password || '密碼'} 
            id="password_access_modal" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            isRequired 
            className="mb-4 text-base"
            aautoComplete="new-password" 
          />
          {loginError && (
            <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
              {loginError}
            </p>
          )}
          <Button 
            onClick={handleLoginFromAccess}
            variant="primary" 
            className="w-full bg-[#8B6F47] hover:bg-[#7A5F3C]" 
            size="lg"
          >
            {translations.login || '登入'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// 主應用組件 - 使用 Error Boundary
const App: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError && error) {
    return <ErrorFallback error={error} resetError={() => {
      setHasError(false);
      setError(null);
    }} />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;