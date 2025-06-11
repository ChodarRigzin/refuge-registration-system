// src/contexts/AppContext.tsx - 最終、完整、包含所有功能的版本

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, Refugee, AppContextType, Translations } from '../types';
import { initialTranslations } from '../constants';

// --- 引入所有需要的 Firebase 工具 ---
import { db, auth, functions } from '../firebase'; // 引入 functions
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // --- 狀態管理 ---
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('preferredLanguage') as Language) || 'zh');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [refugees, setRefugees] = useState<Refugee[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 合併了資料和驗證的讀取狀態

  // --- Effect: 處理語言變更 ---
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // --- Effect: 監聽 Firebase Auth 狀態 (核心) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const userIsAdmin = tokenResult.claims.admin === true;
        setIsAdmin(userIsAdmin);
        // 如果是管理員，就去讀取資料
        if (userIsAdmin) {
          await fetchRefugees();
        }
      } else {
        setIsAdmin(false);
        setRefugees([]); // 登出後清空資料
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 資料庫 CRUD 函式 ---
  const fetchRefugees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "refugees"));
      const refugeesFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Refugee[];
      setRefugees(refugeesFromDb);
    } catch (error) {
      console.error("從 Firebase 讀取資料失敗: ", error);
    }
  };

  const addRefugee = useCallback(async (data: Omit<Refugee, 'id' | 'registrationTime'>) => {
    try {
      await addDoc(collection(db, "refugees"), { ...data, registrationTime: serverTimestamp() });
      // 寫入成功後，可以選擇性地重新獲取一次列表以確保同步
      if (isAdmin) { await fetchRefugees(); }
    } catch (error) {
      console.error("新增資料到 Firebase 失敗: ", error);
      throw error;
    }
  }, [isAdmin]);

  const updateRefugee = useCallback(async (id: string, updatedData: Partial<Omit<Refugee, 'id'>>) => {
    const refugeeDocRef = doc(db, "refugees", id);
    try {
      await updateDoc(refugeeDocRef, updatedData);
      setRefugees(prevData => prevData.map(refugee => refugee.id === id ? { ...refugee, ...updatedData } : refugee));
    } catch (error) {
      console.error("更新 Firebase 資料失敗: ", error);
      throw error;
    }
  }, []);

  const deleteRefugee = useCallback(async (id: string) => {
    if (window.confirm(initialTranslations[language].confirmDelete)) {
      const refugeeDocRef = doc(db, "refugees", id);
      try {
        await deleteDoc(refugeeDocRef);
        setRefugees(prevData => prevData.filter(r => r.id !== id));
      } catch (error) {
        console.error("刪除 Firebase 資料失敗: ", error);
        throw error;
      }
    }
  }, [language]);

  // --- 身份驗證函式 ---
  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Firebase 登入失敗:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase 登出失敗:", error);
    }
  }, []);
  
  const translations = initialTranslations[language];

  // ******** 這是您指出的、之前遺漏的關鍵部分 ********
  // 組合所有要提供給子元件的 value
  const value: AppContextType = {
    language,
    setLanguage: useCallback((lang: Language) => setLanguageState(lang), []),
    translations,
    isAdmin,
    login,
    logout,
    refugeeData: refugees,
    addRefugee,
    updateRefugee,
    deleteRefugee,
  };
  

  return (
    <AppContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">載入中...</div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};