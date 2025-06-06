
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AppContext, AppProvider } from './contexts/AppContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LoginStatus } from './components/LoginStatus';
import { NavTabs } from './components/NavTabs';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationList } from './components/RegistrationList';
import { CertificateGenerator } from './components/CertificateGenerator';
import { TabKey, Translations } from './types';
import { ORGANIZATION_NAME_KEY } from './constants';
import { Modal } from './components/common/Modal';
import { Input } from './components/common/Input';
import { Button } from './components/common/Button';


const AppHeader: React.FC<{ translations: Translations }> = ({ translations }) => (
  <div className="text-center mb-10 py-8 md:py-12 px-5 bg-gradient-to-br from-[var(--primary-color)] via-[var(--primary-light)] to-[var(--primary-color)] text-white rounded-xl shadow-2xl relative overflow-hidden no-print">
    <span className="absolute top-[-30px] left-[-40px] text-7xl md:text-9xl opacity-10 text-amber-300" style={{ animation: 'rotateIcon 60s linear infinite' }}>☸</span>
    <span className="absolute bottom-[-30px] right-[-40px] text-7xl md:text-9xl opacity-10 text-amber-300" style={{ animation: 'rotateIcon 70s linear infinite reverse' }}>☸</span>
    
    <div className="relative z-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        {translations.systemTitle}
      </h1>
      <p className="text-base sm:text-lg md:text-xl opacity-90">{translations[ORGANIZATION_NAME_KEY]}</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.Registration);
  
  const [isLoginModalOpenFromAccess, setIsLoginModalOpenFromAccess] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');


  if (!context) {
    return <div className="flex items-center justify-center min-h-screen"><div className="p-10 text-gray-600">Loading application context...</div></div>;
  }
  const { translations, login, isAdmin } = context;

  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  // If user logs out while on an admin tab, redirect to registration
  useEffect(() => {
    if (!isAdmin && (activeTab === TabKey.List || activeTab === TabKey.Certificate)) {
      setActiveTab(TabKey.Registration);
    }
  }, [isAdmin, activeTab]);


  const openLoginModalFromAccess = () => {
    setLoginError('');
    setUsername('');
    setPassword('');
    setIsLoginModalOpenFromAccess(true);
  };
  
  const handleLoginFromAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!login(username, password)) {
      setLoginError(translations.loginError);
    } else {
      setIsLoginModalOpenFromAccess(false);
       // Active tab will re-render due to isAdmin context change.
       // If user was on an admin tab, it should now show content.
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case TabKey.Registration:
        return <RegistrationForm />;
      case TabKey.List:
        return <RegistrationList onLoginClick={openLoginModalFromAccess} />;
      case TabKey.Certificate:
        return <CertificateGenerator onLoginClick={openLoginModalFromAccess} />;
      default: // Fallback to registration
        if (!isAdmin && (activeTab === TabKey.List || activeTab === TabKey.Certificate)) {
           return <RegistrationForm />; // Should be handled by useEffect too
        }
        return <RegistrationForm />;
    }
  };

  return (
    <div className="min-h-screen text-gray-800">
      <LanguageSwitcher />
      <LoginStatus />
      
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24"> {/* Increased top padding */}
        <AppHeader translations={translations}/>
        <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mt-6 md:mt-8">{renderTabContent()}</div>
      </div>

      <Modal isOpen={isLoginModalOpenFromAccess} onClose={() => setIsLoginModalOpenFromAccess(false)} title={translations.adminLogin}>
        <form onSubmit={handleLoginFromAccess}>
          <Input
            label={translations.username}
            id="username_access_modal" 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isRequired
            autoFocus
          />
          <Input
            label={translations.password}
            id="password_access_modal" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
          {loginError && <p className="text-red-500 text-sm mb-4 text-center animate-shakeIcon">{loginError}</p>}
          <Button type="submit" variant="primary" className="w-full" size="lg">
            {translations.login}
          </Button>
        </form>
      </Modal>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
