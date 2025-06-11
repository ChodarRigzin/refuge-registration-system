// src/firebaseConfig.js

// 從 Firebase SDK 引入所需的功能
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// 您的 Web 應用程式的 Firebase 設定
// --- 關鍵修改：將寫死的金鑰換成 process.env.REACT_APP_... ---
const firebaseConfig = {
  // 語法是 process.env.金鑰名稱
  // REACT_APP_ 是 React 專案的標準前綴
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// 初始化 Firebase 應用程式
const app = initializeApp(firebaseConfig);

// 初始化並取得您想要使用的 Firebase 服務實例
// 這樣做可以確保在整個應用程式中只會有一個實例
const auth = getAuth(app);
const db = getFirestore(app); // 範例：加入 Firestore 資料庫
const functions = getFunctions(app, 'us-central1'); // 指定 Functions 的區域
const analytics = getAnalytics(app); // 如果您需要分析功能

// 將初始化後的服務實例導出，以便在應用程式的其他地方使用
export { auth, db, functions, analytics };