// src/components/RegistrationForm.tsx - 最終修正版

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

export const RegistrationForm = () => {
  const context = useContext(AppContext) as AppContextType;

  const getInitialFormDataState = useCallback(() => ({ 
    name: '', 
    gender: '' as '' | '男' | '女' | '未提供', 
    dateOfBirth: '', 
    nationality: '', 
    phone: '', 
    address: '', 
    email: '', 
    refugeDate: '',
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

  const validateForm = (): boolean => {
    const requiredFields = ['name', 'refugeDate', 'refugePlace'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setErrorMessage(translations.fillAllRequired);
        requiredFields.forEach(f => handleBlur(f)); 
        return false;
      }
    }
    
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
  
  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null;
    const value = formData[fieldName as keyof typeof formData] as string;
    
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
      
      {successMessage && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">{errorMessage}</div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingBasicInfo}</h3>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <Input label={translations.name} id="name" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} placeholder={translations.namePlaceholder} isRequired error={getFieldError('name')} disabled={isSubmitting}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('name') || ''}</div>
              </div>
              <div>
                <Select label={translations.gender} id="gender" name="gender" value={formData.gender} onChange={handleChange} onBlur={() => handleBlur('gender')} disabled={isSubmitting}>
                  <option value="">{translations.selectGender}</option>
                  <option value="男">{translations.male}</option>
                  <option value="女">{translations.female}</option>
                  <option value="未提供">{translations.genderNotProvided || '未提供'}</option>
                </Select>
                <div className="h-5 mt-1"></div>
              </div>
              <div>
                <Input label={translations.dateOfBirth} id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} onBlur={() => handleBlur('dateOfBirth')} disabled={isSubmitting} max={new Date().toISOString().split('T')[0]}/>
                <div className="h-5 mt-1"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingContactInfo}</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Input label={translations.nationality} id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} onBlur={() => handleBlur('nationality')} placeholder={translations.nationalityPlaceholder} disabled={isSubmitting}/>
                  <div className="h-5 mt-1 text-xs text-gray-500">{translations.nationalityHint}</div>
                </div>
                <div>
                  <Input label={translations.phone} id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} placeholder={translations.phonePlaceholder} error={getFieldError('phone')} disabled={isSubmitting}/>
                  <div className="h-5 mt-1 text-xs text-gray-500">{getFieldError('phone') || translations.phoneHint}</div>
                </div>
              </div>
              <div>
                <Input label={translations.address} id="address" name="address" value={formData.address} onChange={handleChange} onBlur={() => handleBlur('address')} placeholder={translations.addressPlaceholder} disabled={isSubmitting}/>
                <div className="h-5 mt-1"></div>
              </div>
              <div>
                <Input label={translations.email} id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} placeholder={translations.emailPlaceholder} error={getFieldError('email')} disabled={isSubmitting}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('email') || ''}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{translations.subheadingRefugeInfo}</h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Input label={translations.refugeDate} id="refugeDate" name="refugeDate" type="text" value={formData.refugeDate} onChange={handleChange} onBlur={() => handleBlur('refugeDate')} placeholder={translations.refugeDatePlaceholder} isRequired error={getFieldError('refugeDate')} disabled={isSubmitting} />
                 <div className="h-5 mt-1 text-xs text-gray-500">{getFieldError('refugeDate') || translations.refugeDateHint}</div>
              </div>
              <div>
                <Input label={translations.refugePlace} id="refugePlace" name="refugePlace" value={formData.refugePlace} onChange={handleChange} onBlur={() => handleBlur('refugePlace')} placeholder={translations.refugePlacePlaceholder} isRequired error={getFieldError('refugePlace')} disabled={isSubmitting}/>
                <div className="h-5 mt-1 text-xs text-red-600">{getFieldError('refugePlace') || ''}</div>
              </div>
            </div>
          </div>

          {/* ***** 這裡是最關鍵的修正 ***** */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="flex-1 sm:flex-initial">
              {isSubmitting ? (translations.submitting || "處理中...") : translations.submitRegistration}
            </Button>
            <Button type="button" onClick={handleReset} variant="secondary" size="lg" disabled={isSubmitting} className="flex-1 sm:flex-initial">
              {translations.clearForm}
            </Button>
          </div>

        </form>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        <span className="text-red-500">*</span> {translations.requiredFieldsNote}
      </div>
    </div>
  );
};