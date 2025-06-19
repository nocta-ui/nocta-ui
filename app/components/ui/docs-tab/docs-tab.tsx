'use client';

import React, { useState } from 'react';

interface DocsTabProps {
  children: React.ReactNode;
  title: string;
  value: string;
  isActive?: boolean;
  onClick?: (value: string) => void;
}

const DocsTab = ({ children, title, value, isActive = false, onClick }: DocsTabProps) => {
  if (onClick) {
    return (
      <button
        onClick={() => onClick(value)}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }`}
      >
        {title}
      </button>
    );
  }

  // When used as content container
  return <>{children}</>;
};

interface DocsTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const DocsTabs = ({ children, defaultValue = 'preview' }: DocsTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Filter and type the children properly
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<DocsTabProps> => 
      React.isValidElement(child) && typeof child.type !== 'string'
  );

  const activeContent = tabs.find(tab => tab.props.value === activeTab);

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex items-center gap-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <DocsTab
            key={tab.props.value}
            title={tab.props.title}
            value={tab.props.value}
            isActive={activeTab === tab.props.value}
            onClick={setActiveTab}
            children={null}
          />
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeContent?.props.children}
      </div>
    </div>
  );
};

export { DocsTab, DocsTabs };