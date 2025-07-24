// src/contexts/AppContext.tsx - 修正了資料讀取邏輯的最終版本

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, Refugee, AppContextType, Translations } from '../types';
import { initialTranslations } from '../constants';

import { db, auth } from '../firebase'; // functions 在這裡不需要
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('preferredLanguage') as Language) || 'zh');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [refugees, setRefugees] = useState<Refugee[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Effect 1: 專門監聽 Firebase Auth 狀態，並設定 isAdmin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        // 使用 getIdTokenResult 可以強制刷新 token，確保拿到最新的自訂宣告
        const tokenResult = await user.getIdTokenResult(true); 
        const userIsAdmin = tokenResult.claims.admin === true;
        setIsAdmin(userIsAdmin);
      } else {
        setIsAdmin(false);
        setRefugees([]); // 登出後清空資料
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ***** 這裡是關鍵修改 *****
  // Effect 2: 專門監聽 isAdmin 狀態的變化。
  // 一旦 isAdmin 變為 true，就去讀取資料。
  useEffect(() => {
    // 定義一個函式來獲取資料
    const fetchRefugees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "refugees"));
        const refugeesFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Refugee[];
        setRefugees(refugeesFromDb);
      } catch (error) {
        console.error("從 Firebase 讀取資料失敗: ", error);
        setRefugees([]); // 如果讀取失敗，確保列表是空的
      }
    };

    // 只有當使用者是管理員時，才執行獲取
    if (isAdmin) {
      fetchRefugees();
    }
  }, [isAdmin]); // <--- 依賴於 isAdmin 的變化！

  const addRefugee = useCallback(async (data: Omit<Refugee, 'id' | 'registrationTime'>) => {
    try {
      await addDoc(collection(db, "refugees"), { ...data, registrationTime: serverTimestamp() });
      // 寫入成功後，不需要手動刷新，因為 isAdmin 狀態沒變，列表會自動更新（如果需要的話）
      // 更好的做法是在 RegistrationList 中顯示一個成功訊息
    } catch (error) {
      console.error("新增資料到 Firebase 失敗: ", error);
      throw error;
    }
  }, []);

  const updateRefugee = useCallback(async (id: string, updatedData: Partial<Omit<Refugee, 'id'>>) => {
    const refugeeDocRef = doc(db, "refugees", id);
    try {
      await updateDoc(refugeeDocRef, updatedData);
      // 更新本地狀態以提供即時反饋
      setRefugees(prevData => prevData.map(refugee => refugee.id === id ? { ...refugee, ...updatedData } as Refugee : refugee));
    } catch (error) {
      console.error("更新 Firebase 資料失敗: ", error);
      throw error;
    }
  }, []);

  const deleteRefugee = useCallback(async (id: string) => {
    const refugeeDocRef = doc(db, "refugees", id);
    try {
      await deleteDoc(refugeeDocRef);
      setRefugees(prevData => prevData.filter(r => r.id !== id));
    } catch (error) {
      console.error("刪除 Firebase 資料失敗: ", error);
      throw error;
    }
  }, []);

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};