import React from 'react';

export interface Tab {
  key: string;
  label: string;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  const baseClasses = 'flex border-b border-slate-200';
  const finalClassName = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={finalClassName}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`flex-1 py-4 text-sm font-medium transition-all duration-300 ${
            activeTab === tab.key
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;