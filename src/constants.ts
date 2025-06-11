// src/constants.ts - 最終完整版

import { AllTranslations } from './types';

export const APP_NAME = "Refuge Registration System";
export const ORGANIZATION_NAME_KEY = "organizationName";

export const initialTranslations: AllTranslations = {
  zh: {
    // --- 系統 & 導覽 ---
    systemTitle: "皈依登記管理系統",
    organizationName: "噶陀仁珍千寶佛學會",
    registrationFormTitle: "皈依登記表",
    discipleList: "皈依名單",
    certificateGenTitleHtmlPrint: "皈依證書", // 側欄和內容區都用這個
    
    // --- 使用者狀態 ---
    guest: "訪客",
    admin: "管理員",
    adminLogin: "管理員登入",
    logout: "登出",
    
    // --- 通用欄位 & 按鈕 ---
    name: "姓名",
    gender: "性別",
    nationality: "國籍",
    phone: "電話",
    address: "地址",
    email: "電子信箱",
    refugeDate: "皈依日期",
    refugePlace: "皈依地點",
    dharmaName: "法名 (藏文原文)",
    dharmaNamePhonetic: "法名音譯 (中文)",
    dharmaNameMeaning: "法名譯意",
    selectGender: "請選擇性別",
    male: "男",
    female: "女",
    submitRegistration: "提交登記",
    clearForm: "清除重填",
    search: "搜尋",
    showAll: "顯示全部",
    view: "查看",
    edit: "編輯",
    delete: "刪除",
    saveChanges: "儲存變更",
    cancel: "取消",
    login: "登入",
    id: "ID",
    actions: "操作",

    // --- 表單子標題 ---
    subheadingBasicInfo: "基本資料",
    subheadingContactInfo: "聯絡資料",
    subheadingRefugeInfo: "皈依資料",

    // --- 證書頁面 ---
    selectDisciple: "選擇皈依弟子",
    pleaseSelect: "請選擇...",
    printFullCertificate: "列印皈依證",
    preparingPrint: "正在準備列印...",
    selectToPrintCertificate: "請選擇一位皈依弟子以準備列印。",
    printError: "準備列印時發生錯誤，請查看控制台。",

    // --- 訊息 & 提示 ---
    registrationSuccess: "登記成功！感謝您的填寫。",
    updateSuccess: "資料更新成功！",
    fillAllRequired: "請填寫所有必填欄位！",
    confirmDelete: "確定要刪除這筆資料嗎？",
    accessDenied: "權限不足",
    adminOnlyList: "只有管理員可以查看此頁面。",
    adminOnlyCert: "只有管理員可以訪問此頁面。",
    loginError: "信箱或密碼錯誤！",
    phoneHint: "請包含國碼，例如台灣 +886，馬來西亞 +60",
    invalidPhoneWithCountryCode: "請輸入包含國碼的完整電話號碼 (例如 +886912345678)",
    invalidPhoneWithCountryCodeShort: "格式錯誤 (應為 +國碼號碼)",
    fieldRequired: "此欄位為必填",
    invalidEmail: "請輸入有效的電子郵件地址",
    suggestDharmaName: "建議法名",
    allDharmaNamesUsed: "所有預設法名已被使用！",
    dharmaNameOptional: "法名相關 (管理員填寫)",
    requiredFieldsNote: "* 標示為必填欄位",
    
    // --- 輸入框預設文字 (Placeholder) ---
    namePlaceholder: "請輸入您的姓名",
    nationalityPlaceholder: "請輸入您的國籍",
    phonePlaceholder: "+886912345678",
    addressPlaceholder: "請輸入您的地址",
    emailPlaceholder: "請輸入您的電子信箱",
    refugePlacePlaceholder: "請輸入皈依地點",
    dharmaNamePlaceholder: "請輸入法名 (藏文原文)",
    dharmaNamePhoneticPlaceholder: "請輸入法名音譯 (中文)",
    dharmaNameMeaningPlaceholder: "請輸入法名譯意",
    searchPlaceholder: "搜尋姓名、電話或地址...",
  },
  en: {
    // --- System & Navigation ---
    systemTitle: "Refuge Registration System",
    organizationName: "Kathog Rigzin Chenpo Dharma Association",
    registrationFormTitle: "Refuge Registration Form",
    discipleList: "Refugee List",
    certificateGenTitleHtmlPrint: "Certificate Preview & Print",

    // --- User Status ---
    guest: "Guest",
    admin: "Administrator",
    adminLogin: "Admin Login",
    logout: "Logout",

    // --- Common Fields & Buttons ---
    name: "Name",
    gender: "Gender",
    nationality: "Nationality",
    phone: "Phone",
    address: "Address",
    email: "Email",
    refugeDate: "Refuge Date",
    refugePlace: "Refuge Place",
    dharmaName: "Dharma Name (Tibetan)",
    dharmaNamePhonetic: "Phonetic Dharma Name (Chinese)",
    dharmaNameMeaning: "Meaning of Dharma Name",
    selectGender: "Please select gender",
    male: "Male",
    female: "Female",
    submitRegistration: "Submit Registration",
    clearForm: "Clear Form",
    search: "Search",
    showAll: "Show All",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    login: "Login",
    id: "ID",
    actions: "Actions",

    // --- Form Subheadings ---
    subheadingBasicInfo: "Basic Information",
    subheadingContactInfo: "Contact Information",
    subheadingRefugeInfo: "Refuge Information",

    // --- Certificate Page ---
    selectDisciple: "Select Disciple",
    pleaseSelect: "Please select...",
    printFullCertificate: "Print Certificate",
    preparingPrint: "Preparing to print...",
    selectToPrintCertificate: "Please select a disciple to prepare the certificate.",
    printError: "An error occurred while preparing to print. Please check the console.",

    // --- Messages & Hints ---
    registrationSuccess: "Registration successful! Thank you.",
    updateSuccess: "Data updated successfully!",
    fillAllRequired: "Please fill in all required fields!",
    confirmDelete: "Are you sure you want to delete this record?",
    accessDenied: "Access Denied",
    adminOnlyList: "Only administrators can view this page.",
    adminOnlyCert: "Only administrators can access this page.",
    loginError: "Invalid email or password!",
    phoneHint: "Include country code, e.g., +886 for Taiwan, +60 for Malaysia.",
    invalidPhoneWithCountryCode: "Please enter a complete phone number with country code (e.g., +886912345678).",
    invalidPhoneWithCountryCodeShort: "Invalid format (e.g., +886...)",
    fieldRequired: "This field is required",
    invalidEmail: "Please enter a valid email address",
    suggestDharmaName: "Suggest Name",
    allDharmaNamesUsed: "All preset Dharma names have been used!",
    dharmaNameOptional: "Dharma Name (Admin entry)",
    requiredFieldsNote: "* Indicates a required field",

    // --- Placeholders ---
    namePlaceholder: "Please enter your name",
    nationalityPlaceholder: "Please enter your nationality",
    phonePlaceholder: "+886912345678",
    addressPlaceholder: "Please enter your address",
    emailPlaceholder: "Please enter your email",
    refugePlacePlaceholder: "Please enter the refuge place",
    dharmaNamePlaceholder: "Enter Dharma Name (Tibetan)",
    dharmaNamePhoneticPlaceholder: "Enter Phonetic Dharma Name (Chinese)",
    dharmaNameMeaningPlaceholder: "Enter Meaning of Dharma Name",
    searchPlaceholder: "Search by name, phone, or address...",
  },
};