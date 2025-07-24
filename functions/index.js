// 引入 Firebase Functions 和 Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// 初始化 Firebase Admin SDK (只需要一次)
admin.initializeApp();
const db = admin.firestore(); // 將 db 實例化放在頂層，方便共用

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
    
    await db.collection("users").doc(userRecord.uid).set({
      fullName: fullName,
      email: email,
      phone: phone,
      registrationDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.log(`Successfully created new user: ${userRecord.uid}`);
    return {
      status: "success",
      message: "User registered successfully!",
      uid: userRecord.uid,
    };
  } catch (error) {
    functions.logger.error("Error creating new user:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to register user.",
        error,
    );
  }
});

// ======================================================================
// 函式二：設定管理員權限 (您原本的程式碼，維持不變)
// ======================================================================
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  if (context.auth.token.admin !== true) {
     return { error: "權限不足：只有管理員才能設定其他管理員。" };
  }
  
  const email = data.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `成功！ ${email} 現在是管理員了。` };
  } catch (error) {
    functions.logger.error("設定管理員時發生錯誤:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to set admin role.",
      error,
    );
  }
});

// ======================================================================
// 函式三：為新的皈依登記資料產生永久編號 (新增加的函式)
// ======================================================================
exports.onRefugeeCreate = functions.firestore
  .document("refugees/{refugeeId}")
  .onCreate(async (snap, context) => {
    // 1. 找到 metadata 文件，它用來記錄目前的最高編號
    const metadataRef = db.collection("metadata").doc("refugees");

    // 2. 使用事務來安全地讀取和更新編號
    return db.runTransaction(async (transaction) => {
      const metadataDoc = await transaction.get(metadataRef);

      // 3. 獲取當前編號，如果 metadata 不存在，就從 0 開始
      const currentSequence = metadataDoc.data()?.currentSequence || 0;
      const newSequence = currentSequence + 1;

      // 4. 更新 metadata 文件中的最高編號
      // 使用 merge: true 確保不會覆蓋 metadata 文件中的其他可能欄位
      transaction.set(metadataRef, { currentSequence: newSequence }, { merge: true });

      // 5. 將這個新的、永久的編號寫回到剛剛被建立的那筆 refugee 資料中
      functions.logger.log(`Assigning sequence number ${newSequence} to refugee ${snap.id}`);
      return transaction.update(snap.ref, { sequenceNumber: newSequence });
    }).catch(err => {
        functions.logger.error(`Transaction failed for refugee ${snap.id}`, err);
        return null; // 確保函式有返回值
    });
  });