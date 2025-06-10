// Button.tsx
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'link' | 'neutral';
  icon?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  size = 'md',
  ...props
}) => {
  // 基礎樣式，更簡潔
  let baseStyle = 'inline-flex items-center justify-center font-semibold border rounded-full shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 尺寸樣式
  if (size === 'sm') {
    baseStyle += ' px-3 py-1.5 text-xs';
  } else if (size === 'lg') {
    baseStyle += ' px-5 py-2.5 text-base';
  } else { // md
    baseStyle += ' px-4 py-2 text-sm';
  }

  // 變體樣式 (符合新設計)
  if (variant === 'primary') {
    baseStyle += ' bg-[#8B6F47] text-white border-transparent hover:bg-[#7A5F3C] focus:ring-[#8B6F47]';
  } else if (variant === 'secondary') {
    baseStyle += ' bg-white text-gray-700 border-gray-300 hover:bg-gray-300 focus:ring-[#8B6F47]';
  } else if (variant === 'danger') {
    baseStyle += ' bg-red-300 text-white border-transparent hover:bg-red-100 focus:ring-red-100';
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