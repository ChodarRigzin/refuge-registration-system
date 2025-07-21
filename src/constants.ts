// 檔案路徑： src/constants.ts - 根據最新表單邏輯調整後的版本

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
    totalRecords: "共 {count} 筆資料",
    // 修改：與英文版同步，更貼切功能
    certificateGenTitleHtmlPrint: "皈依證預覽與列印",
    
    // --- 使用者狀態 ---
    guest: "訪客",
    admin: "管理員",
    adminLogin: "管理員登入",
    logout: "登出",
    
    // --- 通用欄位 & 按鈕 ---
    name: "姓名",
    gender: "性別",
    dateOfBirth: "出生年月日",
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
    genderNotProvided: "未提供", 

    submitRegistration: "提交登記",
    clearForm: "清除重填",
    search: "搜尋",
    showAll: "顯示全部",
    exportToExcel: "匯出 Excel",
    view: "查看",
    edit: "編輯",
    delete: "刪除",
    saveChanges: "儲存變更",
    cancel: "取消",
    previousPage: "上一頁",
    nextPage: "下一頁",
    pageIndicator: "第 {currentPage} / {totalPages} 頁",
    login: "登入",
    id: "ID",
    sequenceNumber: "編號",
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
    fillAllRequired: "請填寫所有標示 * 的必填欄位！", // 修改：更精確
    confirmDelete: "確定要刪除這筆資料嗎？",
    accessDenied: "權限不足",
    adminOnlyList: "只有管理員可以查看此頁面。",
    adminOnlyCert: "只有管理員可以訪問此頁面。",
    loginError: "信箱或密碼錯誤！",
    phoneHint: "請包含國碼，例如台灣 +886，中國 +86",
    nationalityHint: "香港、澳門等地區用戶請註明",
    // 新增：為皈依日期欄位增加提示
    refugeDateHint: "可輸入完整日期或年份月份，例如: 2024-09-01 或 2024年9月",
    invalidPhoneWithCountryCode: "請輸入包含國碼的完整電話號碼 (例如 +886912345678)",
    invalidPhoneWithCountryCodeShort: "格式錯誤 (應為 +國碼號碼)",
    fieldRequired: "此欄位為必填",
    invalidEmail: "請輸入有效的電子郵件地址",
    suggestDharmaName: "建議法名",
    allDharmaNamesUsed: "所有預設法名已被使用！",
    dharmaNameOptional: "法名相關 (管理員填寫)",
    // 修改：更清楚地說明必填欄位
    requiredFieldsNote: "* 標示為必填欄位 (姓名、皈依日期、皈依地點)",
    
    // --- 輸入框預設文字 (Placeholder) ---
    namePlaceholder: "請輸入您的姓名",
    dateOfBirthPlaceholder: "請選擇您的出生日期",
    nationalityPlaceholder: "請輸入您的國籍",
    phonePlaceholder: "+886912345678",
    addressPlaceholder: "請輸入您的地址",
    emailPlaceholder: "your-email@example.com",
    // 修改：更新皈依日期 placeholder
    refugeDatePlaceholder: "例如: 2024-09-01 或 2024年9月",
    refugePlacePlaceholder: "請輸入皈依地點",
    dharmaNamePlaceholder: "請輸入法名 (藏文原文)",
    dharmaNamePhoneticPlaceholder: "請輸入法名音譯 (中文)",
    dharmaNameMeaningPlaceholder: "請輸入法名譯意",
    searchPlaceholder: "搜尋姓名、電話、出生年月日...",
  },
  en: {
    // --- System & Navigation ---
    systemTitle: "Refuge Registration System",
    organizationName: "Kathog Rigzin Chenpo Dharma Association",
    registrationFormTitle: "Refuge Registration Form",
    discipleList: "Refugee List",
    totalRecords: "Total {count} records",
    certificateGenTitleHtmlPrint: "Certificate Preview & Print",

    // --- User Status ---
    guest: "Guest",
    admin: "Administrator",
    adminLogin: "Admin Login",
    logout: "Logout",

    // --- Common Fields & Buttons ---
    name: "Name",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
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
    genderNotProvided: "Not Provided",
    submitRegistration: "Submit Registration",
    clearForm: "Clear Form",
    search: "Search",
    showAll: "Show All",
    exportToExcel: "Export to Excel",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    previousPage: "Previous",
    nextPage: "Next",
    pageIndicator: "Page {currentPage} of {totalPages}",
    login: "Login",
    id: "ID",
    sequenceNumber: "No.",
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
    fillAllRequired: "Please fill in all fields marked with an * !", // Modified: More precise
    confirmDelete: "Are you sure you want to delete this record?",
    accessDenied: "Access Denied",
    adminOnlyList: "Only administrators can view this page.",
    adminOnlyCert: "Only administrators can access this page.",
    loginError: "Invalid email or password!",
    phoneHint: "Please include the country code, e.g., Taiwan +886, China +86.",
    nationalityHint: "For users from Hong Kong or Macau, please specify the region.",
    // New: Add a hint for the refuge date field
    refugeDateHint: "Enter a full date or year/month, e.g., 2024-09-01 or September 2024",
    invalidPhoneWithCountryCode: "Please enter a complete phone number with country code (e.g., +886912345678).",
    invalidPhoneWithCountryCodeShort: "Invalid format (e.g., +886...)",
    fieldRequired: "This field is required",
    invalidEmail: "Please enter a valid email address",
    suggestDharmaName: "Suggest Name",
    allDharmaNamesUsed: "All preset Dharma names have been used!",
    dharmaNameOptional: "Dharma Name (Admin entry)",
    // Modified: Clarify which fields are required
    requiredFieldsNote: "* indicates a required field (Name, Refuge Date, Refuge Place)",

    // --- Placeholders ---
    namePlaceholder: "Please enter your name",
    dateOfBirthPlaceholder: "Please select your date of birth", 
    nationalityPlaceholder: "Please enter your nationality",
    phonePlaceholder: "+886912345678",
    addressPlaceholder: "Please enter your address",
    emailPlaceholder: "your-email@example.com",
    // Modified: Update refuge date placeholder
    refugeDatePlaceholder: "e.g., 2024-09-01 or September 2024",
    refugePlacePlaceholder: "Please enter the refuge place",
    dharmaNamePlaceholder: "Enter Dharma Name (Tibetan)",
    dharmaNamePhoneticPlaceholder: "Enter Phonetic Dharma Name (Chinese)",
    dharmaNameMeaningPlaceholder: "Enter Meaning of Dharma Name",
    searchPlaceholder: "Search by name, phone, or date of birth...",
  },
};