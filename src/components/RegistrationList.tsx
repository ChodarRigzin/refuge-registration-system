// src/components/RegistrationList.tsx - Firebase 連接版本

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
  // ***** 關鍵修改點 1: ID 類型從 number 改為 string *****
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
    // ***** 關鍵修改點 2: 排序方式從數字 ID 改為註冊時間 *****
    .sort((a, b) => {
        const timeA = a.registrationTime ? new Date(a.registrationTime).getTime() : 0;
        const timeB = b.registrationTime ? new Date(b.registrationTime).getTime() : 0;
        return timeB - timeA; // 最新的在前面
    });
  }, [refugeeData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ***** 關鍵修改點 3: 函式參數 id 類型改為 string *****
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deleteRefugee(deleteConfirmId); // deleteRefugee 現在是 async
      setDeleteConfirmId(null);
    }
  };
  
  // ... (handleViewPerson 函式維持原樣，它不直接依賴 ID 類型)
    const handleViewPerson = (person: Refugee) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50';
    const content = `<div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"><h3 class="text-lg font-semibold mb-4 text-gray-800">${translations.viewDetails || '詳細資料'}</h3><div class="space-y-3 text-sm"><div><span class="font-medium text-gray-600">${translations.name}：</span>${person.name}</div><div><span class="font-medium text-gray-600">${translations.gender}：</span>${language === 'en' ? (person.gender === '男' ? 'Male' : 'Female') : person.gender}</div><div><span class="font-medium text-gray-600">${translations.nationality}：</span>${person.nationality}</div><div><span class="font-medium text-gray-600">${translations.phone}：</span>${person.phone}</div><div><span class="font-medium text-gray-600">${translations.address}：</span>${person.address}</div><div><span class="font-medium text-gray-600">${translations.email}：</span>${person.email || '-'}</div><div><span class="font-medium text-gray-600">${translations.refugeDate}：</span>${person.refugeDate}</div><div><span class="font-medium text-gray-600">${translations.refugePlace}：</span>${person.refugePlace}</div>${person.dharmaName ? `<div class="pt-3 border-t border-gray-200"><div><span class="font-medium text-gray-600">${translations.dharmaName}：</span>${person.dharmaName}</div><div><span class="font-medium text-gray-600">${translations.dharmaNamePhonetic}：</span>${person.dharmaNamePhonetic || '-'}</div><div><span class="font-medium text-gray-600">${translations.dharmaNameMeaning}：</span>${person.dharmaNameMeaning || '-'}</div></div>` : ''}</div><button class="mt-6 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">${translations.close || '關閉'}</button></div>`;
    modal.innerHTML = content;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || (e.target as HTMLElement).tagName === 'BUTTON') { document.body.removeChild(modal); } });
  };


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
      // ***** 關鍵修改點 4: updateRefugee 現在是 async *****
      await updateRefugee(editingPerson.id, editFormData as Omit<Refugee, 'id' | 'registrationTime'>);
      setSuccessMessage(translations.updateSuccess);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditingPerson(null);
        setSuccessMessage('');
      }, 1500);
    }
  };
  
  const handleSuggestDharmaName = () => {
    const usedPhoneticNames = new Set(refugeeData.map(p => p.dharmaNamePhonetic).filter(Boolean));
    let suggestedEntry: DharmaNameEntry | null = null;
    for (const entry of dharmaNameList) {
      if (!usedPhoneticNames.has(entry.phonetic)) { suggestedEntry = entry; break; }
    }
    if (suggestedEntry) {
      setEditFormData(prev => ({...prev, dharmaName: suggestedEntry!.name, dharmaNamePhonetic: suggestedEntry!.phonetic, dharmaNameMeaning: suggestedEntry!.meaning,}));
      setSuggestionMessage('');
    } else {
      setSuggestionMessage(translations.allDharmaNamesUsed);
    }
  };


  // ... (return JSX 部分，只需修改 key 和 onClick 的 id 傳遞即可)
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#8B6F47] mb-6 flex items-center gap-3">
        <span className="text-2xl text-[#D4A574]">◈</span>{translations.discipleList}
        <span className="text-sm font-normal text-gray-600 ml-auto">共 {filteredData.length} 筆資料</span>
      </h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <Input type="text" placeholder={translations.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow !mb-0" aria-label="Search registrations"/>
        <Button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} variant="secondary" size="md">{translations.showAll}</Button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.name}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.gender}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.phone}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{translations.email}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.refugeDate}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.dharmaNamePhonetic}</th>
              <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">{translations.actions}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map(person => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                {/* ID 現在是字串，只顯示前幾個字元以保持整潔 */}
                <td className="p-3 text-sm text-gray-700" title={person.id}>{person.id.substring(0, 6)}...</td>
                <td className="p-3 text-sm text-gray-800 font-medium">{person.name}</td>
                <td className="p-3 text-sm text-gray-700">{language === 'en' ? (person.gender === '男' ? 'M' : 'F') : person.gender}</td>
                <td className="p-3 text-sm text-gray-700">{person.phone}</td>
                <td className="p-3 text-sm text-gray-700 hidden md:table-cell">{person.email || '-'}</td>
                <td className="p-3 text-sm text-gray-700">{person.refugeDate}</td>
                <td className="p-3 text-sm text-gray-700">{person.dharmaNamePhonetic || '-'}</td>
                <td className="p-3 text-sm">
                  <div className="flex gap-1 justify-center">
                    <Button onClick={() => handleViewPerson(person)} variant="neutral" size="sm" className="!px-2 !py-1">⬉</Button>
                    <Button onClick={() => handleOpenEditModal(person)} variant="primary" size="sm" className="!px-2 !py-1">✎</Button>
                    {/* ***** 關鍵修改點 5: 傳遞 string ID ***** */}
                    <Button onClick={() => handleDeleteClick(person.id)} variant="danger" size="sm" className="!px-2 !py-1">⨯</Button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (<tr><td colSpan={8} className="p-6 text-center text-gray-500">{searchTerm ? '找不到符合的資料' : '尚無資料'}</td></tr>)}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="secondary" size="sm">上一頁</Button>
          <span className="px-4 py-2 text-sm text-gray-600">第 {currentPage} / {totalPages} 頁</span>
          <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="secondary" size="sm">下一頁</Button>
        </div>
      )}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">確認刪除</h3><p className="text-gray-600 mb-6">確定要刪除這筆資料嗎？此操作無法復原。</p>
            <div className="flex gap-3">
              <Button onClick={handleConfirmDelete} variant="danger" className="flex-1">確認刪除</Button>
              <Button onClick={() => setDeleteConfirmId(null)} variant="secondary" className="flex-1">取消</Button>
            </div>
          </div>
        </div>
      )}
      {editingPerson && ( <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`${translations.edit}: ${editingPerson.name}`} size="xl"> {/* ... Modal content ... */} </Modal>)}
    </div>
  );
};