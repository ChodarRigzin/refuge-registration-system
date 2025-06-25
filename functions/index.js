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
    
    // 這裡的集合名稱 "users" 與前端的 "refugees" 不一致，
    // 這是一個潛在問題，但暫時不影響新功能的實作。
    await db.collection("users").doc(userRecord.uid).set({
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
// 函式二：設定管理員權限 (您原本的程式碼，維持不變)
// ======================================================================
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // 權限檢查：確保呼叫者是管理員
  if (context.auth.token.admin !== true) {
     return { error: "權限不足：只有管理員才能設定其他管理員。" };
  }
  
  const email = data.email;

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
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


// ======================================================================
// 函式三：為新的皈依登記資料產生唯一的序列號 (新增加的函式)
// ======================================================================
exports.generateSequenceNumber = functions.firestore
  .document("refugees/{refugeeId}")
  .onCreate(async (snapshot, context) => {
    // 1. 取得計數器文件的引用
    const counterRef = db.collection("metadata").doc("refugeeCounter");

    try {
      // 2. 使用 Transaction (事務) 來安全地讀取和更新計數器
      const newSequenceNumber = await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);

        let newNumber;
        if (!counterDoc.exists) {
          newNumber = 1;
        } else {
          const currentNumber = counterDoc.data().currentNumber || 0;
          newNumber = currentNumber + 1;
        }
        transaction.update(counterRef, { currentNumber: newNumber });
        return newNumber;
      });

      // 3. 將獲得的唯一編號更新到新建立的資料上
      const newRefugeeRef = snapshot.ref;
      await newRefugeeRef.update({ sequenceNumber: newSequenceNumber });
      
      console.log(
        `Successfully assigned sequence number ${newSequenceNumber} to refugee ${context.params.refugeeId}`
      );
      
    } catch (error) {
      console.error(
        `Failed to generate sequence number for refugee ${context.params.refugeeId}`,
        error
      );
    }
  });