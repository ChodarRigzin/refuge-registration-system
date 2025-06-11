// 引入 Firebase Functions 和 Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// 初始化 Firebase Admin SDK (只需要一次)
admin.initializeApp();

// ======================================================================
// 函式一：處理使用者註冊 (您原本的程式碼，維持不變)
// ======================================================================
exports.registerUser = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const password = data.password;
  const fullName = data.fullName;
  const phone = data.phone;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: fullName,
    });

    // 注意：您這裡的集合名稱是 "users"，而您的前端應用程式使用的是 "refugees"。
    // 為了統一，建議將這裡也改為 "refugees"。
    await admin.firestore().collection("refugees").doc(userRecord.uid).set({
      fullName: fullName,
      email: email,
      phone: phone,
      registrationDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Successfully created new user: ${userRecord.uid}`);
    return {
      status: "success",
      message: "User registered successfully!",
      uid: userRecord.uid,
    };
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to register user.",
        error.message,
    );
  }
});


// ======================================================================
// 函式二：設定管理員權限 (我們新增的函式)
// ======================================================================
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  //
  // ******** 第一次設定時，請務必將以下這段檢查註解掉！ ********
  //
  // if (context.auth.token.admin !== true) {
  //   return { error: "權限不足：只有管理員才能設定其他管理員。" };
  // }
  //
  // **********************************************************
  //

  // 從前端接收要設為管理員的 email
  const email = data.email;

  try {
    // 透過 email 找到對應的使用者
    const user = await admin.auth().getUserByEmail(email);
    // 為該使用者設定一個名為 "admin" 的自訂宣告 (Custom Claim)
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    // 回傳成功訊息
    return { message: `成功！ ${email} 現在是管理員了。` };
  } catch (error) {
    console.error("設定管理員時發生錯誤:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to set admin role.",
      error.message,
    );
  }
});