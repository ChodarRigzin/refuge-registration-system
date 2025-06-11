// src/components/RegistrationForm.tsx - 已加入電話國碼提示與驗證

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

export const RegistrationForm: React.FC = () => {
  const context = useContext(AppContext);

  const getInitialFormDataState = useCallback(() => ({
    name: '',
    gender: '' as '' | '男' | '女',
    nationality: context?.language === 'en' ? 'Taiwan (R.O.C.)' : '中華民國',
    phone: '',
    address: '',
    email: '',
    refugeDate: new Date().toISOString().split('T')[0],
    refugePlace: '',
  }), [context?.language]);

  const [formData, setFormData] = useState(getInitialFormDataState());
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (context) {
      setFormData(getInitialFormDataState());
    }
  }, [context, getInitialFormDataState]);

  if (!context) {
    // ... Loading skeleton (維持不變)
    return <div className="... animate-pulse ...">...</div>;
  }
  
  const { addRefugee, translations } = context;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  // ***** 修改點 1: 加強電話號碼驗證邏輯 *****
  const validateForm = () => {
    const requiredFields = ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      setErrorMessage(translations.fillAllRequired || '請填寫所有必填欄位');
      emptyFields.forEach(field => handleBlur(field));
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(translations.invalidEmail || '請輸入有效的電子郵件地址');
      handleBlur('email');
      return false;
    }

    // 新的電話驗證：必須以 "+" 開頭，後面跟著數字
    const phoneRegex = /^\+\d+$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage(translations.invalidPhoneWithCountryCode || '請輸入包含國碼的完整電話號碼 (例如 +886912345678)');
      handleBlur('phone');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addRefugee(formData as Omit<Refugee, 'id' | 'registrationTime'>);
      setSuccessMessage(translations.registrationSuccess || '註冊成功！資料已安全存入雲端。');
      setFormData(getInitialFormDataState());
      setTouchedFields(new Set());
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error("Failed to submit registration to Firebase:", error);
      setErrorMessage(translations.registrationError || '註冊失敗，請檢查網路連線或稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(getInitialFormDataState());
    setSuccessMessage('');
    setErrorMessage('');
    setTouchedFields(new Set());
  };

  // ***** 修改點 2: 加入即時的電話格式錯誤提示 *****
  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null;
    const value = formData[fieldName as keyof typeof formData] as string;

    if (!value && ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'].includes(fieldName)) {
      return translations.fieldRequired || '此欄位為必填';
    }
    
    if (fieldName === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return translations.invalidEmail || '請輸入有效的電子郵件地址';
      }
    }
    
    // 新的電話格式即時驗證
    if (fieldName === 'phone' && value) {
      const phoneRegex = /^\+\d+$/;
      if (!phoneRegex.test(value)) {
        return translations.invalidPhoneWithCountryCodeShort || '格式錯誤 (應為 +國碼號碼)';
      }
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ... h2, successMessage, errorMessage (維持不變) ... */}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="space-y-6">
          {/* ... 基本資料 (維持不變) ... */}

          {/* 聯絡資料區塊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">聯絡資料</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Input /* ... 國籍 ... */ />

                {/* ***** 修改點 3: 在電話輸入框下方加入提示文字 ***** */}
                <div>
                  <Input 
                    label={translations.phone} 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder={translations.phonePlaceholder || '+886912345678'} 
                    isRequired
                    error={getFieldError('phone')}
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {translations.phoneHint || '請包含國碼，例如台灣 +886，馬來西亞 +60'}
                  </p>
                </div>
              </div>
              <Input /* ... 地址 ... */ />
              <Input /* ... email ... */ />
            </div>
          </div>

          {/* ... 皈依資料與按鈕 (維持不變) ... */}
        </div>
      </div>
    </div>
  );
};