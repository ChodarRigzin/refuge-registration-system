// src/components/LoginStatus.tsx - Firebase Auth 連接版本

import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';

export const LoginStatus: React.FC = () => {
  const context = useContext(AppContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState(''); // ***** 修改: username -> email *****
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 新增一個處理中的狀態

  if (!context) {
    return null;
  }

  const { isAdmin, login, logout, translations } = context;

  // ***** 關鍵修改: handleLogin 現在是 async 函式 *****
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true); // 開始登入

    // login 函式現在返回一個 Promise<boolean>
    const loginSuccess = await login(email, password); 

    if (!loginSuccess) {
      setLoginError(translations.loginError || '登入失敗，請檢查信箱或密碼');
    } else {
      setIsLoginModalOpen(false); // 成功則關閉 Modal
      setEmail('');
      setPassword('');
    }
    setIsLoggingIn(false); // 結束登入
  };

  return (
    <>
      <div className="fixed top-4 right-4 ... no-print"> {/* 樣式維持不變 */}
        <div className="..."><i className="fas fa-user"></i></div>
        <span className="...">{isAdmin ? translations.admin : translations.guest}</span>
        {isAdmin ? (
          // logout 現在也是 async
          <Button onClick={async () => await logout()} variant="secondary" size="sm" icon={<i className="fas fa-sign-out-alt text-xs"></i>}>
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
            label={translations.email || '電子信箱'} // ***** 修改: username -> email *****
            id="email_modal"
            type="email" // ***** 修改: type 改為 email *****
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            autoFocus
          />
          <Input
            label={translations.password}
            id="password_modal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
          {loginError && <p className="text-red-500 text-sm mb-4 text-center animate-shakeIcon">{loginError}</p>}
          <Button type="submit" variant="primary" className="w-full" size="lg" disabled={isLoggingIn}>
            {isLoggingIn ? '登入中...' : translations.login}
          </Button>
        </form>
      </Modal>
    </>
  );
};