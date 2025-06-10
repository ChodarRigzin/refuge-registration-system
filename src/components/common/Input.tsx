// 完整的 Input.tsx 修改版
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isRequired?: boolean;
  size?: 'normal' | 'large'; // 新增 size 屬性
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  id, 
  error, 
  isRequired, 
  className, 
  size = 'normal', // 接收 size prop，預設值為 'normal'
  ...props 
}) => {

  // 根據 size 決定垂直 padding
  const paddingClass = size === 'large' ? 'py-3' : 'py-2.5';

  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        // 將原本的 py-2.5 換成我們動態計算的 paddingClass
        className={`w-full px-4 ${paddingClass} border border-gray-300 rounded text-sm transition-all duration-200 ease-in-out 
                   focus:outline-none focus:border-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary-light)]/30 
                   hover:border-gray-400
                   bg-white disabled:bg-gray-100 disabled:cursor-not-allowed
                   ${className} 
                   ${error ? 'border-red-500 focus:ring-red-500/30' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};