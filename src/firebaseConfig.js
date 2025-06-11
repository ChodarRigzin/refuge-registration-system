// src/firebaseConfig.js

// 從 Firebase SDK 引入所需的功能
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// 您的 Web 應用程式的 Firebase 設定
// 重要：請直接從您的 Firebase 專案設定中複製，確保金鑰是正確的
const firebaseConfig = {
  apiKey: "AIzaSyC4kCI-NGjJaXPZC9R8jfrlsDyDsfECypU", // 請使用您自己的金鑰
  authDomain: "refuge-registration-system.firebaseapp.com",
  projectId: "refuge-registration-system",
  storageBucket: "refuge-registration-system.appspot.com",
  messagingSenderId: "73516237447",
  appId: "1:73516237447:web:b9b0af4af80c151519ee22",
  measurementId: "G-FQ0CDF436R" // <--- 在您提供的程式碼中，這裡前面少了一個逗號，已補上
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