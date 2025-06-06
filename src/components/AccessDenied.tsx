
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Button } from './common/Button';

interface AccessDeniedProps {
  messageKey: string;
  onLoginClick?: () => void; 
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ messageKey, onLoginClick }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { translations } = context;

  return (
    <div className="text-center py-12 md:py-16 px-6 text-gray-700">
      <div className="text-6xl md:text-7xl mb-6 text-[var(--primary-color)]" style={{animation: 'shakeIcon 2.5s ease-in-out infinite'}}>🔒</div>
      <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary-dark)] mb-3">{translations.accessDenied}</h2>
      <p className="text-base md:text-lg text-gray-600 mb-8">{translations[messageKey]}</p>
      {onLoginClick && (
         <Button onClick={onLoginClick} variant="primary" size="lg">
            {translations.adminLogin}
          </Button>
      )}
    </div>
  );
};
