// src/components/RegistrationForm.tsx - 最終完整版

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

export const RegistrationForm = () => {
  const context = useContext(AppContext) as AppContextType;

  const getInitialFormDataState = useCallback(() => ({ name: '', gender: '' as '' | '男' | '女', nationality: context.language === 'en' ? 'Taiwan (R.O.C.)' : '中華民國', phone: '', address: '', email: '', refugeDate: new Date().toISOString().split('T')[0], refugePlace: '' }), [context.language]);

  const [formData, setFormData] = useState(getInitialFormDataState());
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (context) { setFormData(getInitialFormDataState()); }
  }, [context, getInitialFormDataState]);

  if (!context) {
    return <div className="flex items-center justify-center p-12"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-4"></div><div className="space-y-3"><div className="h-10 bg-gray-200 rounded"></div><div className="h-10 bg-gray-200 rounded"></div><div className="h-10 bg-gray-200 rounded"></div></div></div></div>;
  }
  
  const { addRefugee, translations } = context;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) { setErrorMessage(''); }
  };

  const handleBlur = (fieldName: string) => { setTouchedFields(prev => new Set(prev).add(fieldName)); };

  const validateForm = (): boolean => {
    const requiredFields = ['name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setErrorMessage(translations.fillAllRequired);
        requiredFields.forEach(f => handleBlur(f));
        return false;
      }
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(translations.invalidEmail);
      handleBlur('email');
      return false;
    }
    const phoneRegex = /^\+\d{8,}$/;
    if (!phoneRegex.test(formData.phone)) {
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

  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null;
    const value = formData[fieldName as keyof typeof formData] as string;
    if (!value) { return translations.fieldRequired; }
    if (fieldName === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) return translations.invalidEmail;
    }
    if (fieldName === 'phone' && value) {
      const phoneRegex = /^\+\d{8,}$/;
      if (!phoneRegex.test(value)) return translations.invalidPhoneWithCountryCodeShort;
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#8B6F47] mb-8 flex items-center gap-3">
        <span className="text-2xl text-[#D4A574]">◈</span>
        {translations.registrationFormTitle}
      </h2>
      {successMessage && <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center animate-fadeIn"><div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><span className="flex-grow">{successMessage}</span><button onClick={() => setSuccessMessage('')} className="ml-3 text-green-600 hover:text-green-800">✕</button></div>}
      {errorMessage && <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center animate-shakeIcon"><div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div><span className="flex-grow">{errorMessage}</span><button onClick={() => setErrorMessage('')} className="ml-3 text-red-600 hover:text-red-800">✕</button></div>}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingBasicInfo}</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Input label={translations.name} id="name" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} placeholder={translations.namePlaceholder} isRequired error={getFieldError('name')} disabled={isSubmitting}/>
              <Select label={translations.gender} id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={() => handleBlur('gender')} isRequired error={getFieldError('gender')} disabled={isSubmitting}>
                <option value="">{translations.selectGender}</option>
                <option value="男">{translations.male}</option>
                <option value="女">{translations.female}</option>
              </Select>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingContactInfo}</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Input label={translations.nationality} id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} onBlur={() => handleBlur('nationality')} placeholder={translations.nationalityPlaceholder} isRequired error={getFieldError('nationality')} disabled={isSubmitting}/>
                <div>
                  <Input label={translations.phone} id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} placeholder={translations.phonePlaceholder} isRequired error={getFieldError('phone')} disabled={isSubmitting}/>
                  <p className="mt-1 text-xs text-gray-500">{translations.phoneHint}</p>
                </div>
              </div>
              <Input label={translations.address} id="address" name="address" value={formData.address} onChange={handleChange} onBlur={() => handleBlur('address')} placeholder={translations.addressPlaceholder} isRequired error={getFieldError('address')} disabled={isSubmitting}/>
              <Input label={translations.email} id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} placeholder={translations.emailPlaceholder} isRequired error={getFieldError('email')} disabled={isSubmitting}/>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingRefugeInfo}</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Input label={translations.refugeDate} id="refugeDate" name="refugeDate" type="date" value={formData.refugeDate} onChange={handleChange} onBlur={() => handleBlur('refugeDate')} isRequired error={getFieldError('refugeDate')} disabled={isSubmitting} max={new Date().toISOString().split('T')[0]}/>
              <Input label={translations.refugePlace} id="refugePlace" name="refugePlace" value={formData.refugePlace} onChange={handleChange} onBlur={() => handleBlur('refugePlace')} placeholder={translations.refugePlacePlaceholder} isRequired error={getFieldError('refugePlace')} disabled={isSubmitting}/>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} flex-1 sm:flex-initial`}>
              {isSubmitting ? "處理中..." : translations.submitRegistration}
            </Button>
            <Button type="button" onClick={handleReset} variant="secondary" size="lg" disabled={isSubmitting} className="flex-1 sm:flex-initial">{translations.clearForm}</Button>
          </div>
        </form>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <span className="text-red-500">*</span> {translations.requiredFieldsNote}
      </div>
    </div>
  );
};