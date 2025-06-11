// src/components/common/Select.tsx - 已修正類型定義的版本

import React, { ReactNode } from 'react';

// 1. 定義 Select 元件需要的 Props
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: ReactNode; // 允許傳入 <option>
  error?: string | null;
  isRequired?: boolean;
  className?: string;
}

// 2. 使用現代的函式元件寫法，移除 React.FC
export const Select = ({
  label,
  id,
  children,
  error,
  isRequired = false,
  className = '',
  ...props
}: SelectProps) => {
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
  const selectBaseStyle = "block w-full px-3 py-2 bg-white border rounded-md shadow-sm sm:text-sm focus:outline-none transition-colors";
  const errorStyle = "border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500";
  const normalStyle = "border-gray-300 focus:ring-[#8B6F47] focus:border-[#8B6F47]";

  return (
    <div className={className}>
      <label htmlFor={id} className={labelStyle}>
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        className={`${selectBaseStyle} ${error ? errorStyle : normalStyle}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};