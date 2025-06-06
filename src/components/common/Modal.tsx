import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'fit';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  let modalWidthClass = 'max-w-md';
  switch (size) {
    case 'sm': modalWidthClass = 'max-w-sm'; break;
    case 'lg': modalWidthClass = 'max-w-lg'; break;
    case 'xl': modalWidthClass = 'max-w-xl'; break;
    case '2xl': modalWidthClass = 'max-w-2xl'; break;
    case '3xl': modalWidthClass = 'max-w-3xl'; break;
    case 'fit': modalWidthClass = 'w-auto max-w-3xl'; break;
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out animate-fadeIn px-4 pt-12 pb-8 overflow-y-auto" // 修改 items-center 為 items-start, py-8 改為 pt-12 pb-8
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl m-4 relative overflow-hidden animate-slideUp w-full ${modalWidthClass} mb-auto`} // 新增 mb-auto 確保 margin-bottom 生效，當內容不足時不會被拉伸
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-radial-gradient-gold-light opacity-5 animate-rotateIcon" style={{ background: 'radial-gradient(circle, rgba(210,105,30,0.03) 0%, transparent 70%)', animation: 'rotateIcon 60s linear infinite reverse' }}></div>

        <div className="relative z-[5]">
          {(title) && (
            <div className="flex justify-between items-start pt-6 pb-3 px-6 md:px-8 border-b border-gray-200">
              <h2 className={`text-xl md:text-2xl font-semibold text-[var(--primary-color)] leading-tight break-words pr-2`}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-[var(--primary-dark)] text-2xl md:text-3xl font-light transition-transform duration-200 hover:rotate-90 ml-4 flex-shrink-0"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          )}
          {!title && (
             <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-[var(--primary-dark)] text-3xl font-light transition-transform duration-200 hover:rotate-90 z-10"
                aria-label="Close modal"
              >
                ×
              </button>
          )}
          {/* 內容區如果希望可滾動，可以再包一層並設定 max-height 和 overflow-y-auto */}
          <div className="p-6 md:p-8"> {/* 這個 div 的 padding 是內容的內邊距 */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};