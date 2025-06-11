// src/components/RegistrationList.tsx - 最終修正版

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        dharmaName: editingPerson.dharmaName || '',
        dharmaNamePhonetic: editingPerson.dharmaNamePhonetic || '',
        dharmaNameMeaning: editingPerson.dharmaNameMeaning || '',
      });
    }
    setSuggestionMessage(''); 
  }, [editingPerson]);

  if (!context) return <div className="p-6 text-center">Loading list...</div>;
  const { refugeeData, deleteRefugee, updateRefugee, isAdmin, translations, language } = context;

  if (!isAdmin) {
    return <AccessDenied messageKey="adminOnlyList" onLoginClick={onLoginClick} />;
  }

  const filteredData = useMemo(() => {
    return refugeeData.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm) ||
      person.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.dharmaNamePhonetic?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        const timeA = a.registrationTime ? new Date(a.registrationTime).getTime() : 0;
        const timeB = b.registrationTime ? new Date(b.registrationTime).getTime() : 0;
        return timeB - timeA;
    });
  }, [refugeeData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deleteRefugee(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };
  
  const handleViewPerson = (person: Refugee) => { /* ... 您的 view person 邏輯維持不變 ... */ };
  const handleOpenEditModal = (person: Refugee) => {
    setEditingPerson(person);
    setIsEditModalOpen(true);
    setSuccessMessage('');
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson && editFormData) {
      if (!editFormData.name || !editFormData.gender || !editFormData.nationality || 
          !editFormData.phone || !editFormData.address || !editFormData.refugeDate || 
          !editFormData.refugePlace) {
        alert(translations.fillAllRequired);
        return;
      }
      await updateRefugee(editingPerson.id, editFormData as Omit<Refugee, 'id' | 'registrationTime'>);
      setSuccessMessage(translations.updateSuccess);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditingPerson(null);
        setSuccessMessage('');
      }, 1500);
    }
  };
  
  const handleSuggestDharmaName = () => { /* ... 您的 suggest dharma name 邏輯維持不變 ... */ };

  return (
    <div className="w-full">
      {/* 列表和搜尋 (維持不變) */}
      <h2 className="text-2xl ...">{translations.discipleList}</h2>
      <div className="mb-6 ...">{/* ... Input and Button ... */}</div>
      <div className="overflow-x-auto ...">
        <table className="w-full ...">
          {/* ... thead ... */}
          <tbody>
            {paginatedData.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                {/* ... table cells (td) ... */}
                <td className="p-3 text-sm">
                  <div className="flex gap-1 justify-center">
                    <Button onClick={() => handleViewPerson(person)} variant="neutral" size="sm" className="!px-2 !py-1">⬉</Button>
                    <Button onClick={() => handleOpenEditModal(person)} variant="primary" size="sm" className="!px-2 !py-1">✎</Button>
                    <Button onClick={() => handleDeleteClick(person.id)} variant="danger" size="sm" className="!px-2 !py-1">⨯</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 分頁和刪除確認 (維持不變) */}
      
      {/* ******** 這是最關鍵的部分：確保 Modal 內有完整的編輯表單 ******** */}
      {editingPerson && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          title={`${translations.edit}: ${editingPerson.name}`} 
          size="xl"
        >
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm text-center">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSaveChanges} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={translations.name} name="name" value={editFormData.name || ''} onChange={handleEditFormChange} isRequired />
              <Select label={translations.gender} name="gender" value={editFormData.gender || ''} onChange={handleEditFormChange} isRequired>
                <option value="">{translations.selectGender}</option>
                <option value="男">{translations.male}</option>
                <option value="女">{translations.female}</option>
              </Select>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={translations.nationality} name="nationality" value={editFormData.nationality || ''} onChange={handleEditFormChange} isRequired />
              <Input label={translations.phone} name="phone" type="tel" value={editFormData.phone || ''} onChange={handleEditFormChange} isRequired />
            </div>
            <Input label={translations.address} name="address" value={editFormData.address || ''} onChange={handleEditFormChange} isRequired />
            <Input label={translations.email} name="email" type="email" value={editFormData.email || ''} onChange={handleEditFormChange} />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={translations.refugeDate} name="refugeDate" type="date" value={editFormData.refugeDate || ''} onChange={handleEditFormChange} isRequired />
              <Input label={translations.refugePlace} name="refugePlace" value={editFormData.refugePlace || ''} onChange={handleEditFormChange} isRequired />
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-[#8B6F47]">{translations.dharmaNameOptional || '法名 (選填)'}</h4>
                <Button type="button" variant="link" onClick={handleSuggestDharmaName} size="sm">{translations.suggestDharmaName || '建議法名'}</Button>
              </div>
              {suggestionMessage && (<p className="text-sm text-red-600 mb-3">{suggestionMessage}</p>)}
              <div className="space-y-3"> 
                <Input label={translations.dharmaName || '法名原文'} name="dharmaName" value={editFormData.dharmaName || ''} onChange={handleEditFormChange} placeholder={translations.dharmaNamePlaceholder || '請輸入藏文法名'}/>
                <Input label={translations.dharmaNamePhonetic || '法名音譯'} name="dharmaNamePhonetic" value={editFormData.dharmaNamePhonetic || ''} onChange={handleEditFormChange} placeholder={translations.dharmaNamePhoneticPlaceholder || '請輸入中文或英文音譯'}/>
                <Input label={translations.dharmaNameMeaning || '法名譯意'} name="dharmaNameMeaning" value={editFormData.dharmaNameMeaning || ''} onChange={handleEditFormChange} placeholder={translations.dharmaNameMeaningPlaceholder || '請輸入法名意義'}/>
              </div>
            </div>

            <div className="mt-6 flex gap-3 pt-4 border-t">
              <Button type="submit" variant="primary" size="lg">{translations.saveChanges || '儲存變更'}</Button>
              <Button type="button" onClick={() => setIsEditModalOpen(false)} variant="secondary" size="lg">{translations.cancel || '取消'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};