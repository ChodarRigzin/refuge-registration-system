// Select.tsx
import React, { ReactNode } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string; // 設為必填
  id: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, isRequired, children, className = '', ...props }) => {
  return (
    // 移除外層的 mb-5
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {/* 
        調整 padding 和樣式
        使用 Tailwind 的 ring utilities 簡化 focus 效果
        更新下拉箭頭 SVG 的顏色以匹配新設計
      */}
      <select
        id={id}
        className={`
          block w-full px-3 py-2 text-base
          border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-[#8B6F47] focus:border-[#8B6F47]
          transition-colors duration-200
          appearance-none pr-8 bg-no-repeat
          bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%236b7280%22%3E%3Cpath%20d%3D%22M8%2011L3%206h10z%22%2F%3E%3C%2Fsvg%3E')]
          bg-[right_0.5rem_center] bg-[length:1em_1em]
          ${className}
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};