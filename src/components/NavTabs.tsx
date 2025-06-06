
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { TabKey } from '../types';

interface NavTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface TabConfig {
  key: TabKey;
  labelKey: string;
  icon: string;
  adminOnly?: boolean;
}

export const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onTabChange }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }
  const { translations, isAdmin } = context;

  const tabs: TabConfig[] = [
    { key: TabKey.Registration, labelKey: 'refugeRegistration', icon: 'fas fa-edit' },
    { key: TabKey.List, labelKey: 'registrationList', icon: 'fas fa-list', adminOnly: true },
    { key: TabKey.Certificate, labelKey: 'certificateGeneration', icon: 'fas fa-certificate', adminOnly: true },
  ];

  return (
    <div className="mb-8 bg-white/70 backdrop-blur-md p-3 rounded-xl shadow-lg flex flex-wrap gap-2 md:gap-3 no-print">
      {tabs.map((tab) => {
        if (tab.adminOnly && !isAdmin && activeTab === tab.key) {
           // If an admin-only tab is somehow active and user is not admin, switch to registration
           // This situation should ideally be prevented by initial tab state logic in App.tsx
           onTabChange(TabKey.Registration);
           return null;
        }
        if (tab.adminOnly && !isAdmin) {
          return null; 
        }

        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            aria-current={isActive ? "page" : undefined}
            className={`
              px-4 py-2.5 md:px-5 md:py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out 
              flex items-center group relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-light)]
              ${isActive 
                ? 'bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-light)] text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-[var(--cream)] hover:text-[var(--primary-dark)] hover:shadow-md transform hover:-translate-y-px'
              }
            `}
          >
            <i className={`${tab.icon} mr-2 text-base ${isActive ? 'opacity-90' : 'text-[var(--primary-color)] group-hover:text-[var(--primary-dark)]'}`}></i>
            {translations[tab.labelKey]}
            {tab.adminOnly && <span className={`ml-1.5 text-xs ${isActive ? 'opacity-70' : 'opacity-60'}`}>🔒</span>}
          </button>
        );
      })}
    </div>
  );
};