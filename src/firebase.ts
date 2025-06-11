// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- 重要！請貼上您自己的 Firebase 專案設定 ---
// 您可以從 Firebase 控制台 -> 專案設定 (齒輪圖示) -> 您的應用程式 中找到
const firebaseConfig = {
  apiKey: "AIzaSyC4kCI-NGjJaXPZC9R8jfrlsDyDsfECypU", // 替換成您的 apiKey
  authDomain: "refuge-registration-system.firebaseapp.com",
  projectId: "refuge-registration-system",
  storageBucket: "refuge-registration-system.appspot.com",
  messagingSenderId: "73516237447",
  appId: "1:73516237447:web:b9b0af4af80c151519ee22"
  measurementId: "G-FQ0CDF436R"
};

// 初始化 Firebase App
const app = initializeApp(firebaseConfig);

// 初始化服務並將它們導出
// db 是我們與 Firestore 資料庫溝通的橋樑
export const db = getFirestore(app);

// auth 是我們用來做身份驗證的工具
export const auth = getAuth(app);