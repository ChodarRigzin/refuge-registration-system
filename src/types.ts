
export interface Refugee {
  id: number;
  name: string;
  gender: '男' | '女' | '';
  nationality: string;
  phone: string;
  address: string;
  email?: string;
  refugeDate: string; // YYYY-MM-DD
  refugePlace: string;
  registrationTime: string; // ISOString
  dharmaName?: string;
  dharmaNamePhonetic?: string;
  dharmaNameMeaning?: string;
}

export type Language = 'zh' | 'en';

export type Translations = {
  [key: string]: string;
};

export type AllTranslations = {
  zh: Translations;
  en: Translations;
};

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  isAdmin: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  refugeeData: Refugee[];
  addRefugee: (data: Omit<Refugee, 'id' | 'registrationTime'>) => void;
  updateRefugee: (id: number, updatedData: Partial<Omit<Refugee, 'id' | 'registrationTime'>>) => void;
  deleteRefugee: (id: number) => void;
  getNextId: () => number;
}

export enum TabKey {
  Registration = 'registration',
  List = 'list',
  Certificate = 'certificate',
}
