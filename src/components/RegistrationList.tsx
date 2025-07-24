import React, { useState, useContext, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { AppContext, AppContextType } from '../contexts/AppContext';
import { Refugee, DharmaNameEntry } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Modal } from './common/Modal';
import { AccessDenied } from './AccessDenied';
import { dharmaNameList } from '../dharmaNames';
import { getCertificateAsBase64 } from '../services/pdfCertificateService';

interface RegistrationListProps {
  onLoginClick: () => void;
}

export const RegistrationList: React.FC<RegistrationListProps> = ({ onLoginClick }) => {
  const context = useContext(AppContext) as AppContextType;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Refugee | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Refugee>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendingPerson, setSendingPerson] = useState<Refugee | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendModalMessage, setSendModalMessage] = useState('');

  if (!context) {
    return <div className="p-6 text-center">Loading list...</div>;
  }

  const { refugeeData, deleteRefugee, updateRefugee, isAdmin, translations, language } = context;

  if (!isAdmin) {
    return <AccessDenied messageKey="adminOnlyList" onLoginClick={onLoginClick} />;
  }

  useEffect(() => {
    if (editingPerson) {
      setEditFormData({
        name: editingPerson.name,
        gender: editingPerson.gender,
        dateOfBirth: editingPerson.dateOfBirth,
        nationality: editingPerson.nationality,
        phone: editingPerson.phone,
        address: editingPerson.address,
        email: editingPerson.email,
        refugeDate: editingPerson.refugeDate,
        refugePlace: editingPerson.refugePlace,
        dharmaName: editingPerson.dharmaName,
        dharmaNamePhonetic: editingPerson.dharmaNamePhonetic,
        dharmaNameMeaning: editingPerson.dharmaNameMeaning,
      });
    }
    setSuggestionMessage(''); 
  }, [editingPerson]);
  
  const filteredData = useMemo(() => {
    const dataToSort = [...refugeeData];
    if (!searchTerm.trim()) {
      return dataToSort.sort((a, b) => (b.sequenceNumber || 0) - (a.sequenceNumber || 0));
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return dataToSort.filter(person => {
      const searchableFields = [
        person.name,
        person.dateOfBirth,
        person.phone,
        person.address,
        person.email,
        person.dharmaNamePhonetic,
        person.sequenceNumber ? String(person.sequenceNumber) : null,
      ];
      return searchableFields.some(field => 
        field && typeof field === 'string' && field.toLowerCase().includes(lowercasedSearchTerm)
      );
    }).sort((a, b) => (b.sequenceNumber || 0) - (a.sequenceNumber || 0));
  }, [refugeeData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteClick = (id: string) => setDeleteConfirmId(id);
  const handleConfirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deleteRefugee(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };
  
  const handleExportToExcel = () => {
    const dataToExport = filteredData.map((person) => ({
      '編號': person.sequenceNumber || '無',
      '姓名': person.name,
      '法名（音譯）': person.dharmaNamePhonetic || '-',
      '性別': person.gender,
      '出生年月日': person.dateOfBirth || '-',
      '國籍': person.nationality || '-',
      '電話': person.phone || '-',
      'Email': person.email || '-',
      '地址': person.address || '-',
      '皈依日期': person.refugeDate,
      '皈依地點': person.refugePlace,
      '登記時間': person.registrationTime ? new Date(person.registrationTime).toLocaleString() : '-',
      '法名（原文）': person.dharmaName || '-',
      '法名（意義）': person.dharmaNameMeaning || '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '弟子名單');
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 8 }, { wch: 15 }, { wch: 12 },
      { wch: 20 }, { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 30 },
    ];
    XLSX.writeFile(workbook, `皈依弟子名冊_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleViewPerson = (person: Refugee) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50';
    const content = `<div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"><h3 class="text-lg font-semibold mb-4 text-gray-800">${translations.viewDetails || '詳細資料'}</h3><div class="space-y-3 text-sm"><div><span class="font-medium text-gray-600">${translations.name}：</span>${person.name}</div><div><span class="font-medium text-gray-600">${translations.gender}：</span>${language === 'en' ? (person.gender === '男' ? 'Male' : 'Female') : person.gender}</div><div><span class="font-medium text-gray-600">${translations.dateOfBirth || '出生年月日'}：</span>${person.dateOfBirth || '-'}</div><div><span class="font-medium text-gray-600">${translations.nationality}：</span>${person.nationality || '-'}</div><div><span class="font-medium text-gray-600">${translations.phone}：</span>${person.phone || '-'}</div><div><span class="font-medium text-gray-600">${translations.address}：</span>${person.address || '-'}</div><div><span class="font-medium text-gray-600">${translations.email}：</span>${person.email || '-'}</div><div><span class="font-medium text-gray-600">${translations.refugeDate}：</span>${person.refugeDate}</div><div><span class="font-medium text-gray-600">${translations.refugePlace}：</span>${person.refugePlace}</div>${person.dharmaName ? `<div class="pt-3 mt-3 border-t border-gray-200"><div><span class="font-medium text-gray-600">${translations.dharmaName}：</span>${person.dharmaName || '-'}</div><div><span class="font-medium text-gray-600">${translations.dharmaNamePhonetic}：</span>${person.dharmaNamePhonetic || '-'}</div><div><span class="font-medium text-gray-600">${translations.dharmaNameMeaning}：</span>${person.dharmaNameMeaning || '-'}</div></div>` : ''}</div><button class="mt-6 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">${translations.close || '關閉'}</button></div>`;
    modal.innerHTML = content;
    document.body.appendChild(modal);
    const closeModal = () => document.body.contains(modal) && document.body.removeChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.querySelector('button')?.addEventListener('click', closeModal);
  };

  const handleOpenEditModal = (person: Refugee) => {
    setEditingPerson(person);
    setIsEditModalOpen(true);
    setSuccessMessage('');
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  
  // ***** 這裡是關鍵修正 *****
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson || !editFormData) return;

    // 必填欄位檢查
    if (!editFormData.name || !editFormData.gender || !editFormData.refugeDate || !editFormData.refugePlace) {
      alert(translations.fillAllRequired);
      return;
    }

    // 建立一個乾淨的物件，準備用來更新
    const dataToUpdate: { [key: string]: any } = {};

    // 智慧地過濾和轉換資料
    for (const key in editFormData) {
        const field = key as keyof typeof editFormData;
        const value = editFormData[field];

        // 只有當 value 不是 undefined 時，我們才處理它
        if (value !== undefined) {
            // 如果 value 是空字串，我們將其轉換為 null，以便能清空 Firestore 欄位
            dataToUpdate[field] = value === '' ? null : value;
        }
    }

    // 呼叫更新函式
    try {
        await updateRefugee(editingPerson.id, dataToUpdate);
        setSuccessMessage(translations.updateSuccess);
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditingPerson(null);
          setSuccessMessage('');
        }, 1500);
    } catch (error) {
        console.error("更新 Firebase 資料失敗:", error);
        alert('更新失敗，請檢查控制台中的錯誤訊息。');
    }
  };
  
  const handleSuggestDharmaName = () => {
    if (!refugeeData) {
      setSuggestionMessage("資料尚未載入，無法建議法名。");
      return;
    }
    const usedPhoneticNames = new Set(refugeeData.map(p => p.dharmaNamePhonetic).filter(Boolean));
    const availableNames = dharmaNameList.filter(entry => !usedPhoneticNames.has(entry.phonetic));
    if (availableNames.length > 0) {
      const suggestedEntry = availableNames[0];
      setEditFormData(prev => ({...prev, dharmaName: suggestedEntry.name, dharmaNamePhonetic: suggestedEntry.phonetic, dharmaNameMeaning: suggestedEntry.meaning}));
      setSuggestionMessage('');
    } else {
      setSuggestionMessage(translations.allDharmaNamesUsed || "所有預設法名皆已使用！");
    }
  };

  const handleOpenSendModal = (person: Refugee) => {
    if (!person.email) {
      alert(translations.noEmailToSend || '此用戶沒有登記電子郵件，無法寄送。');
      return;
    }
    setSendingPerson(person);
    setEmailSubject(translations.defaultEmailSubject || `【噶陀仁珍千寶佛學會】您的皈依證`);
    setEmailBody(
      (translations.defaultEmailBody || `親愛的 {name} 您好，\n\n附件是您的皈依證電子檔，請查收。\n\n祝福您 法喜充滿！\n\n噶陀仁珍千寶佛學會 敬上`).replace('{name}', person.name)
    );
    setSendModalMessage('');
    setIsSending(false);
    setIsSendModalOpen(true);
  };

  const handleConfirmSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendingPerson) return;
    setIsSending(true);
    setSendModalMessage(translations.generatingAndSending || '正在生成PDF並準備寄送...');
    try {
      const pdfBase64 = await getCertificateAsBase64(sendingPerson);
      setSendModalMessage(translations.sendingEmail || '正在寄送電子郵件...');
      const response = await fetch('/api/send-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: sendingPerson.email,
          recipientName: sendingPerson.name,
          pdfBase64: pdfBase64,
          subject: emailSubject,
          bodyText: emailBody,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || '發生未知錯誤');
      setSendModalMessage(translations.emailSentSuccess || '郵件已成功寄出！');
      setTimeout(() => setIsSendModalOpen(false), 2000);
    } catch (error: any) {
      console.error("郵件寄送失敗:", error);
      setSendModalMessage(`${translations.emailSentFailed || '寄送失敗'}: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full">
     <h2 className="text-2xl font-bold text-[#8B6F47] mb-6 flex items-center gap-3">
       <span className="text-2xl text-[#D4A574]">◈</span>
       {translations.discipleList}
       <span className="text-sm font-normal text-gray-600 ml-auto">
         {(translations.totalRecords || "共 {count} 筆資料").replace('{count}', filteredData.length.toString())}
       </span>
     </h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <Input type="text" placeholder={translations.searchPlaceholder} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="flex-grow !mb-0" aria-label="Search registrations"/>
        <Button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} variant="secondary" size="md">{translations.showAll}</Button>
        <Button onClick={handleExportToExcel} variant="success" size="md" disabled={filteredData.length === 0}>
          {translations.exportToExcel || '匯出 Excel'} 
        </Button>     
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">{translations.sequenceNumber || '編號'}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.name}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{translations.gender}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">{translations.dateOfBirth || '出生年月日'}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.phone}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{translations.email}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.refugeDate}</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">{translations.dharmaNamePhonetic}</th>
              <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">{translations.actions}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-sm text-gray-700 font-mono">{person.sequenceNumber || 'N/A'}</td>
                <td className="p-3 text-sm text-gray-800 font-medium">{person.name}</td>
                <td className="p-3 text-sm text-gray-700 hidden md:table-cell">{language === 'en' ? (person.gender === '男' ? 'M' : (person.gender === '女' ? 'F' : 'N/A')) : person.gender}</td>
                <td className="p-3 text-sm text-gray-700 hidden lg:table-cell">{person.dateOfBirth || '-'}</td>
                <td className="p-3 text-sm text-gray-700">{person.phone || '-'}</td>
                <td className="p-3 text-sm text-gray-700 hidden md:table-cell">{person.email || '-'}</td>
                <td className="p-3 text-sm text-gray-700">{person.refugeDate}</td>
                <td className="p-3 text-sm text-gray-700">{person.dharmaNamePhonetic || '-'}</td>
                <td className="p-3 text-sm">
                  <div className="flex gap-1 justify-center">
                    <Button onClick={() => handleViewPerson(person)} variant="neutral" size="sm" className="!px-2 !py-1" title={translations.view || '查看'}>⬉</Button>
                    <Button onClick={() => handleOpenEditModal(person)} variant="primary" size="sm" className="!px-2 !py-1" title={translations.edit || '編輯'}>✎</Button>
                    <Button onClick={() => handleOpenSendModal(person)} variant="success" size="sm" className="!px-2 !py-1" title={translations.sendCertificateEmail || '寄送皈依證郵件'} disabled={!person.email}>✉</Button>
                    <Button onClick={() => handleDeleteClick(person.id)} variant="danger" size="sm" className="!px-2 !py-1" title={translations.delete || '刪除'}>⨯</Button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (<tr><td colSpan={9} className="p-6 text-center text-gray-500">{searchTerm ? (translations.noResults || '找不到符合的資料') : (translations.noData || '尚無資料')}</td></tr>)}
          </tbody>
        </table>
      </div>

     {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="secondary" size="sm">
            {translations.previousPage || "上一頁"}
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {(translations.pageIndicator || "第 {currentPage} / {totalPages} 頁")
              .replace('{currentPage}', currentPage.toString())
              .replace('{totalPages}', totalPages.toString())}
          </span>
          <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="secondary" size="sm">
            {translations.nextPage || "下一頁"}
          </Button>
        </div>
      )}

      {deleteConfirmId !== null && (
        <Modal isOpen={true} onClose={() => setDeleteConfirmId(null)} title={translations.confirmDeleteTitle || '確認刪除'}>
          <div>
            <p className="text-gray-600 mb-6">{translations.confirmDeleteMessage || '確定要刪除這筆資料嗎？此操作無法復原。'}</p>
            <div className="flex gap-3">
              <Button onClick={handleConfirmDelete} variant="danger" className="flex-1">{translations.confirmDeleteButton || '確認刪除'}</Button>
              <Button onClick={() => setDeleteConfirmId(null)} variant="secondary" className="flex-1">{translations.cancel || '取消'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {editingPerson && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`${translations.edit}: ${editingPerson.name}`} size="xl">
          {successMessage && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm text-center">{successMessage}</div>}
          <form onSubmit={handleSaveChanges} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={translations.name} name="name" value={editFormData.name || ''} onChange={handleEditFormChange} isRequired />
              <Select label={translations.gender} name="gender" value={editFormData.gender || ''} onChange={handleEditFormChange} isRequired>
                <option value="">{translations.selectGender}</option>
                <option value="男">{translations.male}</option>
                <option value="女">{translations.female}</option>
                <option value="未提供">{translations.genderNotProvided || '未提供'}</option>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={translations.dateOfBirth} name="dateOfBirth" type="date" value={editFormData.dateOfBirth || ''} onChange={handleEditFormChange} />
              <Input label={translations.nationality} name="nationality" value={editFormData.nationality || ''} onChange={handleEditFormChange} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               <Input label={translations.phone} name="phone" type="tel" value={editFormData.phone || ''} onChange={handleEditFormChange} />
               <Input label={translations.email} name="email" type="email" value={editFormData.email || ''} onChange={handleEditFormChange} />
            </div>
            <Input label={translations.address} name="address" value={editFormData.address || ''} onChange={handleEditFormChange} />
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={translations.refugeDate} name="refugeDate" type="text" value={editFormData.refugeDate || ''} onChange={handleEditFormChange} placeholder="例如：2024-09-01 或 2024年9月" isRequired />
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

      {sendingPerson && (
        <Modal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} title={`${translations.sendCertificateTo || '寄送皈依證給'}: ${sendingPerson.name}`} size="lg">
          <form onSubmit={handleConfirmSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{translations.recipientEmail || '收件人'}</label>
              <p className="mt-1 text-md text-gray-900">{sendingPerson.email}</p>
            </div>
            <Input label={translations.emailSubject || '郵件主旨'} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} disabled={isSending} isRequired />
            <div>
              <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700">{translations.emailBody || '郵件內文'}<span className="text-red-500 ml-1">*</span></label>
              <textarea id="emailBody" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} disabled={isSending} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50" />
            </div>
            {sendModalMessage && (
              <div className={`p-3 text-center text-sm rounded-md ${sendModalMessage.includes('失敗') || sendModalMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {sendModalMessage}
              </div>
            )}
            <div className="mt-6 flex gap-3 pt-4 border-t">
              <Button type="submit" variant="primary" size="lg" disabled={isSending}>
                {isSending ? (translations.sending || '寄送中...') : (translations.confirmAndSend || '確認寄送')}
              </Button>
              <Button type="button" onClick={() => setIsSendModalOpen(false)} variant="secondary" size="lg" disabled={isSending}>
                {translations.cancel || '取消'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};