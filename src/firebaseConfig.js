// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// 您的 Web 應用程式的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 取得各項服務的實例
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app); // 取得 Functions 服務

export { db, auth, functions };