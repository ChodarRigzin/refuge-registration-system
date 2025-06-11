// src/types.ts

// 1. 定義「皈依者」的資料結構
export interface Refugee {
  id: string; // <-- 關鍵修改：從 number 改為 string
  name: string;
  gender: '男' | '女' | '';
  nationality: string;
  phone: string;
  address: string;
  email: string; // <-- 關鍵修改：移除問號，設為必填
  refugeDate: string;
  refugePlace: string;
  registrationTime: string; // 在客戶端可以是 ISO String
  dharmaName?: string;
  dharmaNamePhonetic?: string;
  dharmaNameMeaning?: string;
}

// 2. 定義「法名」的資料結構 (維持不變)
export interface DharmaNameEntry {
  id: number;
  name: string;
  phonetic: string;
  meaning: string;
}

// 3. 定義「語言」類型 (維持不變)
export type Language = 'zh' | 'en';

// 4. 定義「翻譯」物件的結構 (維持不變)
export interface Translations {
  [key: string]: string;
}

// 5. 定義頁籤 (Tab) 的鍵值 (維持不變)
export enum TabKey {
  Registration = 'registration',
  List = 'list',
  Certificate = 'certificate',
}

// 6. 定義與 Firebase 完全匹配的 AppContext 類型
export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  isAdmin: boolean;
  // login/logout 現在是 async，返回 Promise
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refugeeData: Refugee[];
  // 所有資料操作函式都是 async，返回 Promise
  addRefugee: (data: Omit<Refugee, 'id' | 'registrationTime'>) => Promise<void>;
  // id 參數現在是 string
  updateRefugee: (id: string, updatedData: Partial<Omit<Refugee, 'id'>>) => Promise<void>;
  deleteRefugee: (id: string) => Promise<void>;
  // getNextId 已被移除
}