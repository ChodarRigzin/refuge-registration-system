// src/firebase.ts - 已加入 Functions 初始化的最終版本

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// ***** 這是最關鍵的新增部分 *****
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  // 您的環境變數讀取方式維持不變
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, 
};

const app = initializeApp(firebaseConfig);

// 初始化並匯出所有我們需要的服務
export const db = getFirestore(app);
export const auth = getAuth(app);

// ***** 這是最關鍵的新增部分 *****
// 初始化 Firebase Functions，並指定您的 Cloud Function 所在的區域
// 通常是 'us-central1'，您可以在 Firebase 控制台的 Functions 頁面確認
export const functions = getFunctions(app, 'us-central1'); 