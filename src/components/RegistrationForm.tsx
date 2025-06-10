// RegistrationForm.tsx - 優化版本
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
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const { addRefugee, translations } = context;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  const validateForm = () => {
    // 將 email 加入必填欄位
    const requiredFields = ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      setErrorMessage(translations.fillAllRequired || '請填寫所有必填欄位');
      // Mark all empty fields as touched
      emptyFields.forEach(field => handleBlur(field));
      return false;
    }

    // Email validation - 更嚴格的驗證
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(translations.invalidEmail || '請輸入有效的電子郵件地址');
      handleBlur('email');
      return false;
    }

    // Phone validation (basic)
    if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      setErrorMessage(translations.invalidPhone || '請輸入有效的電話號碼');
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
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addRefugee(formData as Omit<Refugee, 'id' | 'registrationTime' | 'dharmaName' | 'dharmaNamePhonetic' | 'dharmaNameMeaning'>);
      setSuccessMessage(translations.registrationSuccess || '註冊成功！');
      setFormData(getInitialFormDataState());
      setTouchedFields(new Set());
      
      // Auto-hide success message
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(translations.registrationError || '註冊失敗，請稍後再試');
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

  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null;
    
    const value = formData[fieldName as keyof typeof formData];
    // 將 email 加入必填欄位檢查
    if (!value && ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'].includes(fieldName)) {
      return translations.fieldRequired || '此欄位為必填';
    }
    
    // 更嚴格的 email 驗證
    if (fieldName === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value as string)) {
        return translations.invalidEmail || '請輸入有效的電子郵件地址';
      }
    }
    
    if (fieldName === 'phone' && value && !/^[\d\s\-\+\(\)]+$/.test(value as string)) {
      return translations.invalidPhone || '請輸入有效的電話號碼';
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#8B6F47] mb-8 flex items-center gap-3">
        <span className="text-2xl text-[#D4A574]">◈</span>
        {translations.registrationFormTitle || '皈依登記表'}
      </h2>

      {/* 通知訊息 */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center animate-fadeIn">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="flex-grow">{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="ml-3 text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center animate-shakeIcon">
          <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="flex-grow">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-3 text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* 表單 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="space-y-6">
          {/* 基本資料區塊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              基本資料
            </h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Input 
                  label={translations.name} 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder={translations.namePlaceholder || '請輸入您的姓名'} 
                  isRequired
                  error={getFieldError('name')}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Select 
                  label={translations.gender} 
                  id="gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  onBlur={() => handleBlur('gender')}
                  isRequired
                  error={getFieldError('gender')}
                  disabled={isSubmitting}
                >
                  <option value="">{translations.selectGender || '請選擇性別'}</option>
                  <option value="男">{translations.male || '男'}</option>
                  <option value="女">{translations.female || '女'}</option>
                </Select>
              </div>
            </div>
          </div>

          {/* 聯絡資料區塊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              聯絡資料
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Input 
                  label={translations.nationality} 
                  id="nationality" 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleChange}
                  onBlur={() => handleBlur('nationality')}
                  placeholder={translations.nationalityPlaceholder || '請輸入國籍'} 
                  isRequired
                  error={getFieldError('nationality')}
                  disabled={isSubmitting}
                />
                <Input 
                  label={translations.phone} 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder={translations.phonePlaceholder || '請輸入電話號碼'} 
                  isRequired
                  error={getFieldError('phone')}
                  disabled={isSubmitting}
                />
              </div>
              <Input 
                label={translations.address} 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                onBlur={() => handleBlur('address')}
                placeholder={translations.addressPlaceholder || '請輸入地址'} 
                isRequired
                error={getFieldError('address')}
                disabled={isSubmitting}
              />
              <Input 
                label={translations.email} 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder={translations.emailPlaceholder || '請輸入電子郵件'}
                isRequired
                error={getFieldError('email')}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* 皈依資料區塊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              皈依資料
            </h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Input 
                label={translations.refugeDate} 
                id="refugeDate" 
                name="refugeDate" 
                type="date" 
                value={formData.refugeDate} 
                onChange={handleChange}
                onBlur={() => handleBlur('refugeDate')}
                isRequired
                error={getFieldError('refugeDate')}
                disabled={isSubmitting}
                max={new Date().toISOString().split('T')[0]}
              />
              <Input 
                label={translations.refugePlace} 
                id="refugePlace" 
                name="refugePlace" 
                value={formData.refugePlace} 
                onChange={handleChange}
                onBlur={() => handleBlur('refugePlace')}
                placeholder={translations.refugePlacePlaceholder || '請輸入皈依地點'} 
                isRequired
                error={getFieldError('refugePlace')}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        {/* 按鈕區域 */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            onClick={handleSubmit}
            variant="primary" 
            size="lg"
            disabled={isSubmitting}
            className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} flex-1 sm:flex-initial`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                處理中...
              </span>
            ) : (
              translations.submitRegistration || '提交註冊'
            )}
          </Button>
          <Button 
            onClick={handleReset}
            variant="secondary" 
            size="lg"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial"
          >
            {translations.clearForm || '清除表單'}
          </Button>
        </div>
      </div>

      {/* 提示訊息 */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <span className="text-red-500">*</span> {translations.requiredFieldsNote || '標示為必填欄位'}
      </div>
    </div>
  );
};