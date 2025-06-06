
import React, { ReactNode } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, isRequired, children, className, ...props }) => {
  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all duration-200 ease-in-out 
                   focus:outline-none focus:border-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary-light)]/30 
                   hover:border-gray-400
                   bg-white appearance-none pr-8 bg-no-repeat 
                   bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238B4513%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
                   bg-[right_0.75rem_center] bg-[length:0.65em_auto] 
                   ${className} 
                   ${error ? 'border-red-500 focus:ring-red-500/30' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};