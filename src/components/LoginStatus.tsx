
import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';

export const LoginStatus: React.FC = () => {
  const context = useContext(AppContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!context) {
    return null;
  }

  const { isAdmin, login, logout, translations } = context;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!login(username, password)) {
      setLoginError(translations.loginError);
    } else {
      setIsLoginModalOpen(false);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-lg flex items-center gap-2.5 md:gap-3 z-[1000] transition-all duration-300 hover:shadow-xl hover:-translate-y-px no-print">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-light)] flex items-center justify-center text-white text-base md:text-lg shadow-sm">
          <i className="fas fa-user"></i>
        </div>
        <span className="text-xs md:text-sm font-semibold text-gray-700">
          {isAdmin ? translations.admin : translations.guest}
        </span>
        {isAdmin ? (
          <Button onClick={logout} variant="secondary" size="sm" icon={<i className="fas fa-sign-out-alt text-xs"></i>}>
            {translations.logout}
          </Button>
        ) : (
          <Button onClick={() => setIsLoginModalOpen(true)} variant="primary" size="sm" icon={<i className="fas fa-sign-in-alt text-xs"></i>}>
            {translations.adminLogin}
          </Button>
        )}
      </div>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title={translations.adminLogin}>
        <form onSubmit={handleLogin}>
          <Input
            label={translations.username}
            id="username_modal" // Unique ID for modal input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isRequired
            autoFocus
          />
          <Input
            label={translations.password}
            id="password_modal" // Unique ID
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
    </>
  );
};