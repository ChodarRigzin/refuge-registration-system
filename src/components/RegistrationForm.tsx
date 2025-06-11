// src/components/RegistrationForm.tsx - 最終修正版

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

export const RegistrationForm: React.FC = () => {
  const context = useContext(AppContext);

  const getInitialFormDataState = useCallback(() => ({ name: '', gender: '' as '' | '男' | '女', nationality: context?.language === 'en' ? 'Taiwan (R.O.C.)' : '中華民國', phone: '', address: '', email: '', refugeDate: new Date().toISOString().split('T')[0], refugePlace: '' }), [context?.language]);

  const [formData, setFormData] = useState(getInitialFormDataState());
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (context) { setFormData(getInitialFormDataState()); }
  }, [context, getInitialFormDataState]);

  if (!context) { return <div className="... animate-pulse ...">...</div>; }
  
  const { addRefugee, translations } = context;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) { setErrorMessage(''); }
  };

  const handleBlur = (fieldName: string) => { setTouchedFields(prev => new Set(prev).add(fieldName)); };

  // ***** 優化後的驗證邏輯 *****
  const validateForm = () => {
    const requiredFields = ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setErrorMessage(translations.fillAllRequired || '請填寫所有必填欄位');
        requiredFields.forEach(f => handleBlur(f)); // 將所有未填寫的欄位標記為已觸摸
        return false;
      }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(translations.invalidEmail || '請輸入有效的電子郵件地址');
      handleBlur('email');
      return false;
    }

    const phoneRegex = /^\+\d{8,}$/; // 要求以+開頭，且至少有8位數字
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

    if (!validateForm()) { return; }

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

  const handleReset = () => { /* ... 維持不變 ... */ };
  const getFieldError = (fieldName: string): string | null => { /* ... 維持不變 ... */ };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ... h2, successMessage, errorMessage (維持不變) ... */}
      
      <div className="bg-white rounded-lg shadow-sm ...">
        {/* ... form content ... */}
        {/* ***** 電話輸入框 ***** */}
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
        {/* ... */}
      </div>
    </div>
  );
};