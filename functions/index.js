// 引入 Firebase Functions 和 Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// 初始化 Firebase Admin SDK
admin.initializeApp();

// 建立一個 "可呼叫的" Cloud Function，命名為 registerUser
exports.registerUser = functions.https.onCall(async (data, context) => {
  // 從前端接收傳來的資料
  const email = data.email;
  const password = data.password; // 建議由後端生成或更安全的方式處理
  const fullName = data.fullName;
  const phone = data.phone;

  try {
    // 1. 使用 Firebase Authentication 建立新用戶
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password, // 注意：真實應用中密碼處理要更安全
      displayName: fullName,
    });

    // 2. 將額外資料存儲到 Firestore 資料庫
    // 我們以用戶的 UID 作為文件的 ID，方便未來查找
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      fullName: fullName,
      email: email,
      phone: phone,
      registrationDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Successfully created new user: ${userRecord.uid}`);

    // 回傳成功訊息給前端
    return {
      status: "success",
      message: "User registered successfully!",
      uid: userRecord.uid,
    };
  } catch (error) {
    console.error("Error creating new user:", error);
    // 回傳詳細錯誤訊息給前端
    throw new functions.https.HttpsError(
        "internal",
        "Failed to register user.",
        error.message,
    );
  }
});
