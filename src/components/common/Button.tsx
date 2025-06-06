
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
  let baseStyle = 'rounded-lg font-semibold tracking-wide transition-all duration-300 ease-in-out relative overflow-hidden shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-70 transform hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:shadow-md';
  
  baseStyle += ' before:content-[\'\'] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:bg-white/20 before:rounded-full before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:duration-700 hover:before:w-[calc(100%+60px)] hover:before:h-[calc(100%+60px)]';

  if (size === 'sm') {
    baseStyle += ' px-3 py-1.5 text-xs';
  } else if (size === 'lg') {
    baseStyle += ' px-8 py-3.5 text-base';
  } else { // md
    baseStyle += ' px-5 py-2.5 text-sm';
  }


  if (variant === 'primary') {
    baseStyle += ' bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-light)] text-white focus:ring-[var(--primary-color)]';
  } else if (variant === 'secondary') {
    baseStyle += ' bg-gradient-to-br from-gray-500 to-gray-600 text-white focus:ring-gray-500';
  } else if (variant === 'danger') {
    baseStyle += ' bg-gradient-to-br from-red-500 to-red-600 text-white focus:ring-red-500';
  } else if (variant === 'link') {
    baseStyle = `font-medium transition-all duration-300 ease-in-out text-[var(--primary-color)] hover:text-[var(--primary-dark)] focus:outline-none hover:underline ${size === 'sm' ? 'text-xs p-1' : 'text-sm p-1.5'}`;
  } else if (variant === 'neutral') {
     baseStyle += ' bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400';
  }


  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center">
        {icon && <span className={`mr-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{icon}</span>}
        {children}
      </span>
    </button>
  );
};