// src/contexts/AppContext.tsx

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, Refugee, AppContextType, Translations } from '../types';
import { initialTranslations } from '../constants';

// --- 關鍵修改點 1: 引入 Firebase Firestore 的工具 ---
import { db } from '../firebase'; // 引入我們建立的 firebase.ts 中的 db 連線實例
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp // 用於在伺服器端產生時間戳，更準確
} from 'firebase/firestore';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // --- 以下幾個狀態保持不變，因為它們適合存在瀏覽器中 ---
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('preferredLanguage') as Language) || 'zh';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });

  // --- 關鍵修改點 2: 修改資料相關的狀態 ---
  // 將 refugeeData -> refugees，並且初始值為空陣列，等待從 Firebase 載入
  const [refugees, setRefugees] = useState<Refugee[]>([]); 
  // 移除 currentId 狀態，因為 Firebase 會自動生成獨一無二的 ID
  // const [currentId, setCurrentId] = useState<number>(...); // <--- 已移除
  const [loading, setLoading] = useState(true); // 新增一個讀取狀態，提升使用者體驗

  // 以下幾個 useEffect 維持不變
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  useEffect(() => {
    sessionStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

  // --- 關鍵修改點 3: 移除將資料存回 localStorage 的 useEffect ---
  // 因為我們的「唯一事實來源 (Single Source of Truth)」現在是 Firebase，而不是本地狀態
  // useEffect(() => { ... }, [refugeeData]); // <--- 已移除
  // useEffect(() => { ... }, [currentId]); // <--- 已移除

  
  // --- 關鍵修改點 4: 新增一個 useEffect，在應用程式啟動時從 Firebase 讀取資料 ---
  useEffect(() => {
    const fetchRefugees = async () => {
      setLoading(true);
      try {
        // 'refugees' 是您在 Firestore 資料庫中的集合名稱 (collection)
        const querySnapshot = await getDocs(collection(db, "refugees"));
        const refugeesFromDb = querySnapshot.docs.map(doc => ({
          id: doc.id, // Firebase 的文件 ID 是字串
          ...doc.data(),
        })) as Refugee[];
        setRefugees(refugeesFromDb);
      } catch (error) {
        console.error("從 Firebase 讀取資料失敗: ", error);
        // 在這裡可以加入更詳細的錯誤處理 UI
      } finally {
        setLoading(false);
      }
    };
    fetchRefugees();
  }, []); // 空依賴陣列 [] 確保此 effect 只在元件掛載時執行一次


  // setLanguage, login, logout 維持不變
  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const login = useCallback((user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'refuge2024') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);
  const logout = useCallback(() => setIsAdmin(false), []);


  // --- 關鍵修改點 5: 重寫 CRUD (建立、更新、刪除) 函式來操作 Firebase ---

  // 移除 getNextId，不再需要手動管理 ID
  // const getNextId = useCallback(...); // <--- 已移除

  const addRefugee = useCallback(async (data: Omit<Refugee, 'id' | 'registrationTime'>) => {
    try {
      const dataToSave = {
        ...data,
        registrationTime: serverTimestamp() // 使用伺服器時間，最準確
      };
      const docRef = await addDoc(collection(db, "refugees"), dataToSave);
      
      // 為了讓 UI 即時反應，我們手動將新資料加入本地狀態
      // 注意：serverTimestamp 在前端會是 null，所以我們先用客戶端時間暫代顯示
      setRefugees(prevData => [...prevData, { ...data, id: docRef.id, registrationTime: new Date().toISOString() } as Refugee]);
    } catch (error) {
      console.error("新增資料到 Firebase 失敗: ", error);
      throw error; // 將錯誤拋出，讓表單元件可以捕獲
    }
  }, []);

  const updateRefugee = useCallback(async (id: string, updatedData: Partial<Omit<Refugee, 'id'>>) => {
    // 注意: Firebase 的 ID 是 string
    const refugeeDocRef = doc(db, "refugees", id);
    try {
      await updateDoc(refugeeDocRef, updatedData);
      // 更新本地狀態以即時反應 UI
      setRefugees(prevData =>
        prevData.map(refugee =>
          refugee.id === id ? { ...refugee, ...updatedData } : refugee
        )
      );
    } catch (error) {
      console.error("更新 Firebase 資料失敗: ", error);
      throw error;
    }
  }, []);

  const deleteRefugee = useCallback(async (id: string) => {
    // 注意: Firebase 的 ID 是 string
    if (window.confirm(initialTranslations[language].confirmDelete)) {
      const refugeeDocRef = doc(db, "refugees", id);
      try {
        await deleteDoc(refugeeDocRef);
        // 從本地狀態移除以即時反應 UI
        setRefugees(prevData => prevData.filter(r => r.id !== id));
      } catch (error) {
        console.error("刪除 Firebase 資料失敗: ", error);
        throw error;
      }
    }
  }, [language]);
  

  const translations = initialTranslations[language];

  // --- 關鍵修改點 6: 更新提供給子元件的 Context Value ---
  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        isAdmin,
        login,
        logout,
        refugeeData: refugees, // 將從 Firebase 來的資料傳下去
        addRefugee,
        updateRefugee,
        deleteRefugee,
        // getNextId 已被移除，因為不再需要
      }}
    >
      {/* 在資料載入完成前，可以顯示一個全域的 Loading 畫面 */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">載入資料中...</div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};