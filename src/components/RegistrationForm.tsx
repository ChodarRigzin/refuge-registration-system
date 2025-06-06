
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';

export const RegistrationForm: React.FC = () => {
  const context = useContext(AppContext);
  
  // Helper to create initial form data, memoized if context is stable
  const getInitialFormDataState = useCallback(() => ({
    name: '',
    gender: '' as '' | '男' | '女', // Explicitly type empty string for gender
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

  useEffect(() => {
    // Reset form if language changes or on initial load with context
    if (context) {
        setFormData(getInitialFormDataState());
    }
  }, [context, getInitialFormDataState]);


  if (!context) return <div className="p-6 text-center">Loading form...</div>;
  const { addRefugee, translations } = context;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name || !formData.gender || !formData.nationality || !formData.phone || !formData.address || !formData.refugeDate || !formData.refugePlace) {
      setErrorMessage(translations.fillAllRequired);
      return;
    }
    
    addRefugee(formData as Omit<Refugee, 'id' | 'registrationTime' | 'dharmaName' | 'dharmaNamePhonetic' | 'dharmaNameMeaning'>);

    setSuccessMessage(translations.registrationSuccess);
    setFormData(getInitialFormDataState()); 
    
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleReset = () => {
    setFormData(getInitialFormDataState());
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary-color)] mb-8 relative pl-10">
        <span className="absolute left-0 top-0.5 text-[var(--gold)] text-3xl md:text-4xl" style={{animation: 'pulseIcon 2s ease-in-out infinite'}}>◈</span>
        {translations.registrationFormTitle}
      </h2>

      {successMessage && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-300 text-green-700 flex items-center animate-slideDown shadow-sm">
          <span className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center mr-3 text-xs shrink-0">✓</span>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 flex items-center animate-slideDown shadow-sm">
          <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center mr-3 text-xs shrink-0">✕</span>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="grid md:grid-cols-2 gap-x-6">
          <Input 
            label={translations.name} 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder={translations.namePlaceholder} 
            isRequired 
          />
          <Select 
            label={translations.gender} 
            id="gender" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            isRequired
          >
            <option value="">{translations.selectGender}</option>
            <option value="男">{translations.male}</option>
            <option value="女">{translations.female}</option>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 gap-x-6">
          <Input 
            label={translations.nationality} 
            id="nationality" 
            name="nationality" 
            value={formData.nationality} 
            onChange={handleChange} 
            placeholder={translations.nationalityPlaceholder} 
            isRequired 
          />
          <Input 
            label={translations.phone} 
            id="phone" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder={translations.phonePlaceholder} 
            isRequired 
          />
        </div>
        <Input 
          label={translations.address} 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          placeholder={translations.addressPlaceholder} 
          isRequired 
        />
        <Input 
          label={translations.email} 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email || ''} 
          onChange={handleChange} 
          placeholder={translations.emailPlaceholder} 
        />
        <div className="grid md:grid-cols-2 gap-x-6">
          <Input 
            label={translations.refugeDate} 
            id="refugeDate" 
            name="refugeDate" 
            type="date" 
            value={formData.refugeDate} 
            onChange={handleChange} 
            isRequired 
          />
          <Input 
            label={translations.refugePlace} 
            id="refugePlace" 
            name="refugePlace" 
            value={formData.refugePlace} 
            onChange={handleChange} 
            placeholder={translations.refugePlacePlaceholder} 
            isRequired 
          />
        </div>
        
        <div className="mt-8 flex gap-4">
          <Button type="submit" variant="primary" size="lg">{translations.submitRegistration}</Button>
          <Button type="reset" variant="secondary" size="lg">{translations.clearForm}</Button>
        </div>
      </form>
    </div>
  );
};
