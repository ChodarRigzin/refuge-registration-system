// src/components/RegistrationForm.tsx - 修改後版本

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

export const RegistrationForm = () => {
  const context = useContext(AppContext) as AppContextType;

  // ----- 修改 1：更新 refugeDate 的初始狀態為空字串 -----
  const getInitialFormDataState = useCallback(() => ({ 
    name: '', 
    gender: '' as '' | '男' | '女' | '未提供', 
    dateOfBirth: '', 
    nationality: '', 
    phone: '', 
    address: '', 
    email: '', 
    refugeDate: '', // 不再預設為今天，且為純文字
    refugePlace: '' 
  }), []);

  const [formData, setFormData] = useState(getInitialFormDataState());
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (context) { setFormData(getInitialFormDataState()); }
  }, [context, getInitialFormDataState]);

  if (!context) {
    // ... (Loading UI 維持不變)
    return <div className="p-12 text-center">Loading form...</div>;
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

  // ----- 修改 2：大幅簡化驗證邏輯 -----
  const validateForm = (): boolean => {
    // 現在只剩下這些是必填的
    const requiredFields = ['name', 'refugeDate', 'refugePlace'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setErrorMessage(translations.fillAllRequired);
        // 觸發所有必填欄位的 blur 效果以顯示錯誤
        requiredFields.forEach(f => handleBlur(f)); 
        return false;
      }
    }
    
    // 對有填寫的 email 和 phone 進行格式驗證
    if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      setErrorMessage(translations.invalidEmail);
      handleBlur('email');
      return false;
    }
    if (formData.phone && !/^\+\d{8,}$/.test(formData.phone)) {
      setErrorMessage(translations.invalidPhoneWithCountryCode);
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
      setSuccessMessage(translations.registrationSuccess);
      setFormData(getInitialFormDataState());
      setTouchedFields(new Set());
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error("Failed to submit registration to Firebase:", error);
      setErrorMessage(translations.registrationError);
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
  
  // ----- 修改 3：更新單一欄位錯誤檢查邏輯 -----
  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null;
    const value = formData[fieldName as keyof typeof formData] as string;
    
    // 定義哪些欄位是必填的
    const requiredFields = new Set(['name', 'refugeDate', 'refugePlace']);
    
    if (requiredFields.has(fieldName) && !value) {
      return translations.fieldRequired;
    }
    
    if (fieldName === 'email' && value) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return translations.invalidEmail;
    }
    if (fieldName === 'phone' && value) {
      if (!/^\+\d{8,}$/.test(value)) return translations.invalidPhoneWithCountryCodeShort;
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#8B6F47] mb-8 flex items-center gap-3">
        <span className="text-2xl text-[#D4A574]">◈</span>
        {translations.registrationFormTitle}
      </h2>
      
      {/* 訊息提示區塊維持不變 */}
      {successMessage && ( <div className="...">{successMessage}</div> )}
      {errorMessage && ( <div className="...">{errorMessage}</div> )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ----- 基本資料區塊 ----- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingBasicInfo}</h3>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              
              <div>
                {/* 姓名仍然是必填 */}
                <Input label={translations.name} id="name" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} placeholder={translations.namePlaceholder} isRequired error={getFieldError('name')} disabled={isSubmitting}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('name') || ''}</div>
              </div>

              <div>
                {/* ----- 修改 4：移除 isRequired ----- */}
                <Select label={translations.gender} id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={() => handleBlur('gender')} disabled={isSubmitting}>
                  <option value="">{translations.selectGender}</option>
                  <option value="男">{translations.male}</option>
                  <option value="女">{translations.female}</option>
                  <option value="未提供">{translations.genderNotProvided || '未提供'}</option>
                </Select>
                <div className="h-5 mt-1 text-xs text-red-600"></div>
              </div>

              <div>
                {/* ----- 修改 5：移除 isRequired，type 仍為 date ----- */}
                <Input label={translations.dateOfBirth} id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} onBlur={() => handleBlur('dateOfBirth')} disabled={isSubmitting} max={new Date().toISOString().split('T')[0]} error={getFieldError('dateOfBirth')}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('dateOfBirth') || ''}</div>
              </div>

            </div>
          </div>

          {/* ----- 聯絡資料區塊 ----- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingContactInfo}</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  {/* ----- 修改 6：移除 isRequired ----- */}
                  <Input label={translations.nationality} id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} onBlur={() => handleBlur('nationality')} placeholder={translations.nationalityPlaceholder} error={getFieldError('nationality')} disabled={isSubmitting}/>
                  <div className="h-5 mt-1 text-xs text-gray-500">{getFieldError('nationality') || translations.nationalityHint}</div>
                </div>
                <div>
                  {/* ----- 修改 7：移除 isRequired ----- */}
                  <Input label={translations.phone} id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} placeholder={translations.phonePlaceholder} error={getFieldError('phone')} disabled={isSubmitting}/>
                  <div className="h-5 mt-1 text-xs text-gray-500">{getFieldError('phone') || translations.phoneHint}</div>
                </div>
              </div>
              <div>
                {/* 地址本來就是選填 */}
                <Input label={translations.address} id="address" name="address" value={formData.address} onChange={handleChange} onBlur={() => handleBlur('address')} placeholder={translations.addressPlaceholder} disabled={isSubmitting}/>
                <div className="h-5 mt-1"></div>
              </div>
              <div>
                {/* ----- 修改 8：移除 isRequired ----- */}
                <Input label={translations.email} id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} placeholder={translations.emailPlaceholder} error={getFieldError('email')} disabled={isSubmitting}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('email') || ''}</div>
              </div>
            </div>
          </div>
          
          {/* ----- 皈依資料區塊 ----- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingRefugeInfo}</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                {/* ----- 修改 9：將 type 從 "date" 改為 "text" ----- */}
                <Input label={translations.refugeDate} id="refugeDate" name="refugeDate" type="text" value={formData.refugeDate} onChange={handleChange} onBlur={() => handleBlur('refugeDate')} placeholder="例如：2024-09-01 或 2024年9月" isRequired error={getFieldError('refugeDate')} disabled={isSubmitting} />
                 <div className="h-5 mt-1 text-xs text-gray-500">{getFieldError('refugeDate') || translations.refugeDateHint}</div>
              </div>
              <div>
                {/* 皈依地點仍然是必填 */}
                <Input label={translations.refugePlace} id="refugePlace" name="refugePlace" value={formData.refugePlace} onChange={handleChange} onBlur={() => handleBlur('refugePlace')} placeholder={translations.refugePlacePlaceholder} isRequired error={getFieldError('refugePlace')} disabled={isSubmitting}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('refugePlace') || ''}
              </div>
            </div>
          </div>

          {/* ----- 按鈕區塊維持不變 ----- */}
          <div className="mt-8 pt-6 border-t ...">
            ...
          </div>
        </form>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        <span className="text-red-500">*</span> {translations.requiredFieldsNote}
      </div>
    </div>
  );
};