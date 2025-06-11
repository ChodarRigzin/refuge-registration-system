// src/components/RegistrationForm.tsx - 最終完整版

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Refugee, AppContextType } from '../types'; // 引入 AppContextType 以獲得更強的類型安全
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

// 使用現代的元件寫法，移除 React.FC
export const RegistrationForm = () => {
  const context = useContext(AppContext) as AppContextType; // 斷言 context 類型，避免不斷檢查

  const getInitialFormDataState = useCallback(() => ({
    name: '',
    gender: '' as '' | '男' | '女',
    nationality: context.language === 'en' ? 'Taiwan (R.O.C.)' : '中華民國',
    phone: '',
    address: '',
    email: '',
    refugeDate: new Date().toISOString().split('T')[0],
    refugePlace: '',
  }), [context.language]);

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

  // 如果 context 尚未載入，顯示讀取畫面
  if (!context) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3"><div className="h-10 bg-gray-200 rounded"></div><div className="h-10 bg-gray-200 rounded"></div><div className="h-10 bg-gray-200 rounded"></div></div>
        </div>
      </div>
    );
  }
  
  const { addRefugee, translations } = context;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) { setErrorMessage(''); }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  // ***** 恢復完整的驗證邏輯 *****
  const validateForm = (): boolean => {
    const requiredFields = ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setErrorMessage(translations.fillAllRequired || '請填寫所有必填欄位');
        requiredFields.forEach(f => handleBlur(f));
        return false;
      }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(translations.invalidEmail || '請輸入有效的電子郵件地址');
      handleBlur('email');
      return false;
    }

    const phoneRegex = /^\+\d{8,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage(translations.invalidPhoneWithCountryCode || '請輸入包含國碼的完整電話號碼 (例如 +886912345678)');
      handleBlur('phone');
      return false;
    }
    return true;
  };

  // ***** 恢復完整的提交邏輯 *****
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

  // ***** 恢復完整的重設邏輯 *****
  const handleReset = () => {
    setFormData(getInitialFormDataState());
    setSuccessMessage('');
    setErrorMessage('');
    setTouchedFields(new Set());
  };

  // ***** 恢復完整的錯誤提示邏輯 *****
  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null;
    const value = formData[fieldName as keyof typeof formData] as string;
    if (!value) {
      return translations.fieldRequired || '此欄位為必填';
    }
    if (fieldName === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) return translations.invalidEmail || '請輸入有效的電子郵件地址';
    }
    if (fieldName === 'phone' && value) {
      const phoneRegex = /^\+\d{8,}$/;
      if (!phoneRegex.test(value)) return translations.invalidPhoneWithCountryCodeShort || '格式錯誤 (應為 +國碼號碼)';
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#8B6F47] mb-8 flex items-center gap-3">
        <span className="text-2xl text-[#D4A574]">◈</span>
        {translations.registrationFormTitle || '皈依登記表'}
      </h2>
      {successMessage && <div className="...">{successMessage}</div>}
      {errorMessage && <div className="...">{errorMessage}</div>}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">基本資料</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div><Input label={translations.name} id="name" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} placeholder={translations.namePlaceholder || '請輸入您的姓名'} isRequired error={getFieldError('name')} disabled={isSubmitting}/></div>
              <div>
                <Select label={translations.gender} id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={() => handleBlur('gender')} isRequired error={getFieldError('gender')} disabled={isSubmitting}>
                  <option value="">{translations.selectGender || '請選擇性別'}</option>
                  <option value="男">{translations.male || '男'}</option>
                  <option value="女">{translations.female || '女'}</option>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">聯絡資料</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Input label={translations.nationality} id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} onBlur={() => handleBlur('nationality')} placeholder={translations.nationalityPlaceholder || '請輸入國籍'} isRequired error={getFieldError('nationality')} disabled={isSubmitting}/>
                <div>
                  <Input label={translations.phone} id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} placeholder={translations.phonePlaceholder || '+886912345678'} isRequired error={getFieldError('phone')} disabled={isSubmitting}/>
                  <p className="mt-1 text-xs text-gray-500">{translations.phoneHint || '請包含國碼，例如台灣 +886，馬來西亞 +60'}</p>
                </div>
              </div>
              <Input label={translations.address} id="address" name="address" value={formData.address} onChange={handleChange} onBlur={() => handleBlur('address')} placeholder={translations.addressPlaceholder || '請輸入地址'} isRequired error={getFieldError('address')} disabled={isSubmitting}/>
              <Input label={translations.email} id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} placeholder={translations.emailPlaceholder || '請輸入電子郵件'} isRequired error={getFieldError('email')} disabled={isSubmitting}/>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">皈依資料</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Input label={translations.refugeDate} id="refugeDate" name="refugeDate" type="date" value={formData.refugeDate} onChange={handleChange} onBlur={() => handleBlur('refugeDate')} isRequired error={getFieldError('refugeDate')} disabled={isSubmitting} max={new Date().toISOString().split('T')[0]}/>
              <Input label={translations.refugePlace} id="refugePlace" name="refugePlace" value={formData.refugePlace} onChange={handleChange} onBlur={() => handleBlur('refugePlace')} placeholder={translations.refugePlacePlaceholder || '請輸入皈依地點'} isRequired error={getFieldError('refugePlace')} disabled={isSubmitting}/>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button onClick={handleSubmit} variant="primary" size="lg" disabled={isSubmitting} className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} flex-1 sm:flex-initial`}>
            {isSubmitting ? '處理中...' : (translations.submitRegistration || '提交註冊')}
          </Button>
          <Button onClick={handleReset} variant="secondary" size="lg" disabled={isSubmitting} className="flex-1 sm:flex-initial">{translations.clearForm || '清除表單'}</Button>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center"><span className="text-red-500">*</span> {translations.requiredFieldsNote || '標示為必填欄位'}</div>
    </div>
  );
};