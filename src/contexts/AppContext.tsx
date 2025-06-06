
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, Refugee, AppContextType, Translations } from '../types';
import { initialTranslations } from '../constants';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('preferredLanguage') as Language) || 'zh';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });
  const [refugeeData, setRefugeeData] = useState<Refugee[]>(() => {
    const savedData = localStorage.getItem('refugeeData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [currentId, setCurrentId] = useState<number>(() => {
    return parseInt(localStorage.getItem('currentId') || '1', 10);
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  useEffect(() => {
    sessionStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('refugeeData', JSON.stringify(refugeeData));
  }, [refugeeData]);

  useEffect(() => {
    localStorage.setItem('currentId', currentId.toString());
  }, [currentId]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const login = useCallback((user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'refuge2024') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const getNextId = useCallback((): number => {
    const newId = currentId;
    setCurrentId(prevId => prevId + 1);
    return newId;
  }, [currentId]);

  const addRefugee = useCallback((data: Omit<Refugee, 'id' | 'registrationTime'>) => {
    const newRefugee: Refugee = {
      ...data,
      id: getNextId(),
      registrationTime: new Date().toISOString(),
    };
    setRefugeeData(prevData => [...prevData, newRefugee]);
  }, [getNextId]);

  const updateRefugee = useCallback((id: number, updatedData: Partial<Omit<Refugee, 'id' | 'registrationTime'>>) => {
    setRefugeeData(prevData =>
      prevData.map(refugee =>
        refugee.id === id ? { ...refugee, ...updatedData } : refugee
      )
    );
  }, []);

  const deleteRefugee = useCallback((id: number) => {
    if (window.confirm(initialTranslations[language].confirmDelete)) {
      setRefugeeData(prevData => prevData.filter(r => r.id !== id));
    }
  }, [language]);
  

  const translations = initialTranslations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        isAdmin,
        login,
        logout,
        refugeeData,
        addRefugee,
        updateRefugee,
        deleteRefugee,
        getNextId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
