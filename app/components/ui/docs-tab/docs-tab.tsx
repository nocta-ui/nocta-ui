'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DocsTabProps {
  children?: React.ReactNode;
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  // Filter and type the children properly
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<DocsTabProps> => 
      React.isValidElement(child) && typeof child.type !== 'string'
  );

  const activeContent = tabs.find(tab => tab.props.value === activeTab);

  // Measure content height
  const measureHeight = useCallback(() => {
    if (wrapperRef.current) {
      const naturalHeight = wrapperRef.current.scrollHeight;
      setHeight(naturalHeight);
    }
  }, []);

  // Update height when active tab changes
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(measureHeight, 10);
    return () => clearTimeout(timer);
  }, [activeTab, measureHeight]);

  // Observe content changes for dynamic height updates
  useEffect(() => {
    if (!wrapperRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      measureHeight();
    });

    resizeObserver.observe(wrapperRef.current);
    
    return () => resizeObserver.disconnect();
  }, [measureHeight]);

  // Handle tab change with fade transition
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    setIsTransitioning(true);
    
    // Start fade out animation
    setTimeout(() => {
      setActiveTab(value);
      // End transition after content changes and fade in completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150); // Half of the total transition time
    }, 150); // Half of the total transition time
  };

  return (
    <div className="border border-neutral-300 dark:border-neutral-800 rounded-lg">
      {/* Tab Headers */}
      <div className="flex items-center gap-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 rounded-t-lg">
        {tabs.map((tab) => (
          <DocsTab
            key={tab.props.value}
            title={tab.props.title}
            value={tab.props.value}
            isActive={activeTab === tab.props.value}
            onClick={handleTabChange}
          />
        ))}
      </div>
      
      {/* Tab Content with animated height and opacity */}
      <div 
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-x-auto"
        style={{ 
          height: height === 'auto' ? 'auto' : `${height}px`
        }}
      >
        <div 
          ref={wrapperRef}
          className={`p-4 flex justify-center items-center transition-opacity duration-150 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-full flex justify-center items-center">
            {activeContent?.props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DocsTab, DocsTabs };