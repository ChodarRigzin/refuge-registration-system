
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Refugee } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Modal } from './common/Modal';
import { AccessDenied } from './AccessDenied';
import { dharmaNameList, DharmaNameEntry } from '../dharmaNames';

interface RegistrationListProps {
  onLoginClick: () => void;
}

export const RegistrationList: React.FC<RegistrationListProps> = ({ onLoginClick }) => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Refugee | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Refugee>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [suggestionMessage, setSuggestionMessage] = useState('');


  useEffect(() => {
    if (editingPerson) {
      setEditFormData({
        name: editingPerson.name,
        gender: editingPerson.gender,
        nationality: editingPerson.nationality,
        phone: editingPerson.phone,
        address: editingPerson.address,
        email: editingPerson.email || '',
        refugeDate: editingPerson.refugeDate,
        refugePlace: editingPerson.refugePlace,
        dharmaName: editingPerson.dharmaName || '', // Tibetan Script
        dharmaNamePhonetic: editingPerson.dharmaNamePhonetic || '', // Chinese Phonetic Transcription
        dharmaNameMeaning: editingPerson.dharmaNameMeaning || '', // Chinese Meaning
      });
    }
    setSuggestionMessage(''); 
  }, [editingPerson]);

  if (!context) return <div className="p-6 text-center">Loading list...</div>;
  const { refugeeData, deleteRefugee, updateRefugee, isAdmin, translations, language } = context;

  if (!isAdmin) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
        <AccessDenied messageKey="adminOnlyList" onLoginClick={onLoginClick} />
      </div>
    );
  }

  const filteredData = useMemo(() => {
    return refugeeData.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm) ||
      person.address.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => b.id - a.id); // Sort by newest first
  }, [refugeeData, searchTerm]);

  const handleViewPerson = (person: Refugee) => {
    const genderDisplay = language === 'en' ? (person.gender === '男' ? 'Male' : 'Female') : person.gender;
    const dharmaDetails = `
${translations.dharmaName}：${person.dharmaName || '-'} (${translations.dharmaNamePhonetic}：${person.dharmaNamePhonetic || '-'})
${translations.dharmaNameMeaning}：${person.dharmaNameMeaning || '-'}`;

    alert(`
${translations.name}：${person.name}
${translations.gender}：${genderDisplay}
${translations.nationality}：${person.nationality}
${translations.phone}：${person.phone}
${translations.address}：${person.address}
${translations.email}：${person.email || '-'}
${translations.refugeDate}：${person.refugeDate}
${translations.refugePlace}：${person.refugePlace}
${person.dharmaName || person.dharmaNamePhonetic ? dharmaDetails : ''}
    `.trim());
  };

  const handleOpenEditModal = (person: Refugee) => {
    setEditingPerson(person);
    setIsEditModalOpen(true);
    setSuccessMessage('');
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson && editFormData) {
      if (!editFormData.name || !editFormData.gender || !editFormData.nationality || !editFormData.phone || !editFormData.address || !editFormData.refugeDate || !editFormData.refugePlace) {
        alert(translations.fillAllRequired);
        return;
      }
      updateRefugee(editingPerson.id, editFormData as Omit<Refugee, 'id' | 'registrationTime'>);
      setSuccessMessage(translations.updateSuccess);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditingPerson(null);
        setSuccessMessage('');
      }, 1500);
    }
  };

  const handleSuggestDharmaName = () => {
    // Check for uniqueness based on the Chinese Phonetic Transcription
    const usedPhoneticNames = new Set(refugeeData.map(p => p.dharmaNamePhonetic).filter(Boolean));
    let suggestedEntry: DharmaNameEntry | null = null;

    for (const entry of dharmaNameList) {
      if (!usedPhoneticNames.has(entry.phonetic)) { // Check against entry.phonetic (Chinese Transcription)
        suggestedEntry = entry;
        break;
      }
    }

    if (suggestedEntry) {
      setEditFormData(prev => ({
        ...prev,
        dharmaName: suggestedEntry!.name, // Tibetan Script
        dharmaNamePhonetic: suggestedEntry!.phonetic, // Chinese Phonetic Transcription
        dharmaNameMeaning: suggestedEntry!.meaning, // Chinese Meaning
      }));
      setSuggestionMessage('');
    } else {
      setSuggestionMessage(translations.allDharmaNamesUsed);
    }
  };
  
  const tableHeaders = ['id', 'name', 'gender', 'nationality', 'phone', 'address', 'email', 'refugeDate', 'refugePlace', 'dharmaNamePhonetic', 'actions'];


  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-xl animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary-color)] mb-8 relative pl-10">
        <span className="absolute left-0 top-0.5 text-[var(--gold)] text-3xl md:text-4xl" style={{ animation: 'pulseIcon 2s ease-in-out infinite' }}>◈</span>
        {translations.discipleList}
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
        <Input
          type="text"
          placeholder={translations.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow w-full sm:w-auto !mb-0"
          aria-label="Search registrations"
        />
        <Button onClick={() => setSearchTerm('')} variant="secondary" size="md" className="w-full sm:w-auto">
          {translations.showAll}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead className="bg-gradient-to-br from-gray-100 to-gray-200 border-b-2 border-gray-300">
            <tr>
              {tableHeaders.map(key => (
                <th key={key} className="p-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  {key === 'dharmaNamePhonetic' ? translations.dharmaNamePhonetic : translations[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.map(person => (
              <tr key={person.id} className="hover:bg-[var(--cream)]/50 transition-colors duration-150">
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.id}</td>
                <td className="p-3 text-sm text-gray-800 font-medium whitespace-nowrap">{person.name}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {language === 'en' ? (person.gender === '男' ? 'Male' : 'Female') : person.gender}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.nationality}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.phone}</td>
                <td className="p-3 text-sm text-gray-700 min-w-[200px] max-w-[300px] whitespace-normal break-words">{person.address}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.email || '-'}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.refugeDate}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.refugePlace}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{person.dharmaNamePhonetic || '-'}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button onClick={() => handleViewPerson(person)} variant="neutral" size="sm">
                      {translations.view}
                    </Button>
                    <Button onClick={() => handleOpenEditModal(person)} variant="primary" size="sm">
                      {translations.edit}
                    </Button>
                    <Button onClick={() => deleteRefugee(person.id)} variant="danger" size="sm">
                      {translations.delete}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={tableHeaders.length} className="p-6 text-center text-gray-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingPerson && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`${translations.edit}: ${editingPerson.name}`} size="lg">
          {successMessage && (
             <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-700 text-sm text-center animate-fadeIn">
               {successMessage}
             </div>
          )}
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-x-4">
              <Input label={translations.name} name="name" value={editFormData.name || ''} onChange={handleEditFormChange} isRequired />
              <Select label={translations.gender} name="gender" value={editFormData.gender || ''} onChange={handleEditFormChange} isRequired>
                <option value="">{translations.selectGender}</option>
                <option value="男">{translations.male}</option>
                <option value="女">{translations.female}</option>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-x-4">
              <Input label={translations.nationality} name="nationality" value={editFormData.nationality || ''} onChange={handleEditFormChange} isRequired />
              <Input label={translations.phone} name="phone" type="tel" value={editFormData.phone || ''} onChange={handleEditFormChange} isRequired />
            </div>
            <Input label={translations.address} name="address" value={editFormData.address || ''} onChange={handleEditFormChange} isRequired />
            <Input label={translations.email} name="email" type="email" value={editFormData.email || ''} onChange={handleEditFormChange} />
            <div className="grid md:grid-cols-2 gap-x-4">
              <Input label={translations.refugeDate} name="refugeDate" type="date" value={editFormData.refugeDate || ''} onChange={handleEditFormChange} isRequired />
              <Input label={translations.refugePlace} name="refugePlace" value={editFormData.refugePlace || ''} onChange={handleEditFormChange} isRequired />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-md font-semibold text-[var(--primary-dark)]">{translations.dharmaNameOptional}</h4>
                <Button type="button" variant="link" onClick={handleSuggestDharmaName} size="sm">
                  {translations.suggestDharmaName}
                </Button>
              </div>
              {suggestionMessage && <p className="text-xs text-red-600 mb-2 animate-shakeIcon">{suggestionMessage}</p>}
              <div className="space-y-3"> 
                  <Input 
                    label={translations.dharmaName} // Should be "法名 (藏文原文)"
                    name="dharmaName" 
                    value={editFormData.dharmaName || ''} 
                    onChange={handleEditFormChange} 
                    placeholder={translations.dharmaNamePlaceholder} // Should be "請輸入法名 (藏文原文)"
                    className="font-tibetan text-lg tibetan-input-field" // Apply Tibetan font and slightly larger for script
                  />
                  <Input 
                    label={translations.dharmaNamePhonetic} // Should be "法名音譯 (中文)"
                    name="dharmaNamePhonetic" 
                    value={editFormData.dharmaNamePhonetic || ''} 
                    onChange={handleEditFormChange} 
                    placeholder={translations.dharmaNamePhoneticPlaceholder} // Should be "請輸入法名音譯 (中文)"
                  />
                  <Input 
                    label={translations.dharmaNameMeaning} // "法名譯意"
                    name="dharmaNameMeaning" 
                    value={editFormData.dharmaNameMeaning || ''} 
                    onChange={handleEditFormChange} 
                    placeholder={translations.dharmaNameMeaningPlaceholder} // "請輸入法名譯意"
                  />
              </div>
            </div>

            <div className="mt-6 flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="lg">{translations.saveChanges}</Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => setIsEditModalOpen(false)}>{translations.cancel}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};