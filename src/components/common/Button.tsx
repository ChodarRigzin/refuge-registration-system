// src/components/common/Button.tsx - 已修正類型定義的版本

import React, { ReactNode } from 'react';

// ButtonProps 的定義維持不變，它是正確的
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'link' | 'neutral';
  icon?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ***** 這是最關鍵的修改 *****
// 我們移除了 React.FC，改用更直接、更明確的函式簽名
// 這可以避免類型推斷時的歧義
export const Button = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  size = 'md',
  ...props
}: ButtonProps) => {
  // 基礎樣式
  let baseStyle = 'inline-flex items-center justify-center font-semibold border rounded-full shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 尺寸樣式
  if (size === 'sm') {
    baseStyle += ' px-3 py-1.5 text-xs';
  } else if (size === 'lg') {
    baseStyle += ' px-5 py-2.5 text-base';
  } else { // md
    baseStyle += ' px-4 py-2 text-sm';
  }

  // 變體樣式
  if (variant === 'primary') {
    baseStyle += ' bg-[#8B6F47] text-white border-transparent hover:bg-[#7A5F3C] focus:ring-[#8B6F47]';
  } else if (variant === 'secondary') {
    // 修正：將 hover 背景改得更合適
    baseStyle += ' bg-white text-gray-700 border-gray-300 hover:bg-gray-100 focus:ring-[#8B6F47]'; 
  } else if (variant === 'danger') {
    // 修正：將 hover 背景改得更合適
    baseStyle += ' bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500';
  } else if (variant === 'link') {
    baseStyle = 'font-medium text-[#8B6F47] hover:text-[#7A5F3C] underline focus:outline-none';
  } else { // neutral
     baseStyle += ' bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-400';
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};