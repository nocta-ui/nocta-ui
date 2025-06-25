'use client';

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { User, Lock, Palette, Code, Gear, Question, Shield } from 'phosphor-react';

// Basic demo showing simple accordion usage
export function BasicAccordionDemo() {
  return (
    <div className="w-full max-w-md mx-auto h-64 relative">
      <Accordion className='absolute left-1/2 -translate-x-1/2 top-10'>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Nocta UI?</AccordionTrigger>
          <AccordionContent>
            Nocta UI is a modern React component library built with performance and accessibility in mind.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>How to install?</AccordionTrigger>
          <AccordionContent>
            You can install components using our CLI: <code>npx nocta-ui add accordion</code>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Does it support dark mode?</AccordionTrigger>
          <AccordionContent>
            Yes! All components in Nocta UI have full dark mode support with automatic switching.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Card variant demo
export function CardAccordionDemo() {
  return (
    <div className="w-full max-w-lg mx-auto h-64 relative">
      <Accordion variant="card" className="space-y-3 absolute left-1/2 -translate-x-1/2 top-10">
        <AccordionItem value="account">
          <AccordionTrigger>
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              Account Settings
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Manage your profile, change email address and password.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger>
            <div className="flex items-center">
              <Shield size={18} className="mr-2" />
              Security
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Enable two-factor authentication and manage your login sessions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="preferences">
          <AccordionTrigger>
            <div className="flex items-center">
              <Gear size={18} className="mr-2" />
              Preferences
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Customize the interface theme, language, and notification settings.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Multiple open demo
export function MultipleAccordionDemo() {
  return (
    <div className="w-full max-w-md mx-auto h-84 relative">
      <Accordion type="multiple" className='absolute left-1/2 -translate-x-1/2 top-10'>
        <AccordionItem value="react">
          <AccordionTrigger>React Basics</AccordionTrigger>
          <AccordionContent>
            Learn the fundamentals of React - components, props, state and lifecycle.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="typescript">
          <AccordionTrigger>TypeScript Integration</AccordionTrigger>
          <AccordionContent>
            How to use TypeScript with React for better type safety.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="testing">
          <AccordionTrigger>Testing Components</AccordionTrigger>
          <AccordionContent>
            Writing unit and integration tests for React components.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Size variants demo
export function SizeAccordionDemo() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 h-82 flex relative">
      <div className="flex flex-col gap-4 w-full absolute left-1/2 -translate-x-1/2 top-10">
        <div>
            <Accordion size="sm">
            <AccordionItem value="small">
                <AccordionTrigger>Small question</AccordionTrigger>
                <AccordionContent>Short answer in small size.</AccordionContent>
            </AccordionItem>
            </Accordion>
        </div>

        <div>
            <Accordion size="md">
            <AccordionItem value="medium">
                <AccordionTrigger>Standard question</AccordionTrigger>
                <AccordionContent>Standard answer in default size.</AccordionContent>
            </AccordionItem>
            </Accordion>
        </div>

        <div>
            <Accordion size="lg">
            <AccordionItem value="large">
                <AccordionTrigger>Large question requiring more space</AccordionTrigger>
                <AccordionContent>
                More detailed answer in larger size, which can contain more content 
                and details requiring additional space.
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </div>
      </div>
    </div>
  );
}

// Controlled demo
export function ControlledAccordionDemo() {
  const [openItems, setOpenItems] = React.useState<string[]>(['controlled-1']);

  const handleValueChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setOpenItems(value);
    } else {
      setOpenItems([value]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 h-64 flex flex-col justify-center items-center relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-10">
        <div className="flex gap-2 mb-10">
          <button
            onClick={() => setOpenItems(['controlled-1'])}
            className="px-3 py-1 bg-blue-500 dark:bg-blue-600/50 text-white rounded text-sm whitespace-nowrap"
          >
            Open First
          </button>
          <button
            onClick={() => setOpenItems(['controlled-2'])}
            className="px-3 py-1 bg-green-500 dark:bg-green-600/50 text-white rounded text-sm whitespace-nowrap"
          >
            Open Second
          </button>
          <button
            onClick={() => setOpenItems([])}
            className="px-3 py-1 bg-red-500 dark:bg-red-600/50 text-white rounded text-sm whitespace-nowrap"
          >
            Close All
          </button>
        </div>

        <Accordion 
          value={openItems} 
          onValueChange={handleValueChange}
          type="multiple"
        >
          <AccordionItem value="controlled-1">
            <AccordionTrigger>Controlled item 1</AccordionTrigger>
            <AccordionContent>
              This accordion is controlled externally. You can open and close it programmatically.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="controlled-2">
            <AccordionTrigger>Controlled item 2</AccordionTrigger>
            <AccordionContent>
              The state of this accordion is managed by the parent component.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// FAQ Demo with mixed content
export function FAQAccordionDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Find answers to the most commonly asked questions
        </p>
      </div>

      <Accordion variant="card" className="space-y-3">
        <AccordionItem value="what-is">
          <AccordionTrigger>
            <div className="flex items-center">
              <Question size={18} className="mr-2 text-blue-500" />
              What is Nocta UI?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p>
                Nocta UI is a modern React component library, built with focus on:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>High performance and accessibility</li>
                <li>Full TypeScript support</li>
                <li>Native dark mode</li>
                <li>Easy customization through design tokens</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="installation">
          <AccordionTrigger>
            <div className="flex items-center">
              <Code size={18} className="mr-2 text-green-500" />
              How to install components?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p>You can install components in several ways:</p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded font-mono text-sm">
                <div># Install single component</div>
                <div>npx nocta-ui add button</div>
                <br />
                <div># Install multiple components</div>
                <div>npx nocta-ui add button card input</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customization">
          <AccordionTrigger>
            <div className="flex items-center">
              <Palette size={18} className="mr-2 text-purple-500" />
              How to customize appearance?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p>Nocta UI uses design tokens for easy customization:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded">
                  <h4 className="font-medium mb-2">CSS Variables</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Change colors through CSS custom properties
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded">
                  <h4 className="font-medium mb-2">Tailwind Config</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Extend Tailwind CSS configuration
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionTrigger>
            <div className="flex items-center">
              <Lock size={18} className="mr-2 text-orange-500" />
              Where to get help?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p>Need help? Contact us:</p>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  GitHub Issues
                </a>
                <a href="#" className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                  Discord
                </a>
                <a href="#" className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                  Documentation
                </a>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 