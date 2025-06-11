// src/types.ts - 最終、完整、已包含所有類型的版本

// 1. 定義「皈依者」的資料結構
export interface Refugee {
  id: string; // Firebase 的文件 ID 是 string
  name: string;
  gender: '男' | '女' | '';
  nationality: string;
  phone: string;
  address: string;
  email: string; // 設為必填
  refugeDate: string;
  refugePlace: string;
  registrationTime: string; // 在客戶端可以是 ISO String，在 Firestore 中會是 Timestamp
  dharmaName?: string;
  dharmaNamePhonetic?: string;
  dharmaNameMeaning?: string;
}

// 2. 定義「法名」的資料結構
export interface DharmaNameEntry {
  id: number;
  name: string;
  phonetic: string;
  meaning: string;
}

// 3. 定義「語言」類型
export type Language = 'zh' | 'en';

// 4. 定義「翻譯」物件的結構
export type Translations = {
  [key: string]: string;
};

// ***** 這是最關鍵的新增部分 *****
// 5. 定義包含所有語言的翻譯物件結構
//    這個類型被 constants.ts 用來定義 initialTranslations
export type AllTranslations = {
  zh: Translations;
  en: Translations;
};

// 6. 定義頁籤 (Tab) 的鍵值
export enum TabKey {
  Registration = 'registration',
  List = 'list',
  Certificate = 'certificate',
}

// 7. 定義與 Firebase 完全匹配的 AppContext 類型
export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refugeeData: Refugee[];
  addRefugee: (data: Omit<Refugee, 'id' | 'registrationTime'>) => Promise<void>;
  updateRefugee: (id: string, updatedData: Partial<Omit<Refugee, 'id'>>) => Promise<void>;
  deleteRefugee: (id: string) => Promise<void>;
}