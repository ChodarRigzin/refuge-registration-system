
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, id, error, isRequired, className, ...props }) => {
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
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all duration-200 ease-in-out 
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