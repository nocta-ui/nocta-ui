'use client';

import React from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from './sheet';
import { Button } from '../button';
import { Input } from '../input';
import { Badge } from '../badge';
import { 
  ChartBar, 
  Folder, 
  Check, 
  Users, 
  Gear, 
  Question,
  List,
  Sliders
} from 'phosphor-react';

export const BasicSheetDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>
              This is a basic sheet panel that slides in from the right side of the screen.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Sheet content goes here. You can add any components or content you need.
            </p>
          </div>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const SheetSidesDemo: React.FC = () => {
  return (
    <div className="my-6 flex flex-wrap gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Left Side</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the left side.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Content for left-side sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Right Side</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the right side.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Content for right-side sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Top Side</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the top.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Content for top sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Bottom Side</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the bottom.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Content for bottom sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const SheetSizesDemo: React.FC = () => {
  return (
    <div className="my-6 flex flex-wrap gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">Small</Button>
        </SheetTrigger>
        <SheetContent size="sm">
          <SheetHeader>
            <SheetTitle>Small Sheet</SheetTitle>
            <SheetDescription>
              This is a small-sized sheet (320px width).
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Compact content for small sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">Medium</Button>
        </SheetTrigger>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>Medium Sheet</SheetTitle>
            <SheetDescription>
              This is a medium-sized sheet (384px width).
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Standard content for medium sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">Large</Button>
        </SheetTrigger>
        <SheetContent size="lg">
          <SheetHeader>
            <SheetTitle>Large Sheet</SheetTitle>
            <SheetDescription>
              This is a large-sized sheet (448px width).
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Expanded content for large sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">Extra Large</Button>
        </SheetTrigger>
        <SheetContent size="xl">
          <SheetHeader>
            <SheetTitle>Extra Large Sheet</SheetTitle>
            <SheetDescription>
              This is an extra large sheet (512px width).
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              Wide content for extra large sheet.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const FormSheetDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Edit Profile</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1 space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              containerClassName="w-full"
              className="w-full"
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              containerClassName="w-full"
              className="w-full"
            />
            <Input
              label="Username"
              placeholder="Enter your username"
              containerClassName="w-full"
              className="w-full"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300">
                Status
              </label>
              <div className="flex gap-2">
                <Badge variant="success">Active</Badge>
                <Badge variant="secondary">Premium</Badge>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose>Cancel</SheetClose>
            <Button>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const NavigationSheetDemo: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', icon: ChartBar, badge: null },
    { name: 'Projects', icon: Folder, badge: '12' },
    { name: 'Tasks', icon: Check, badge: '3' },
    { name: 'Team', icon: Users, badge: null },
    { name: 'Settings', icon: Gear, badge: null },
    { name: 'Help', icon: Question, badge: null },
  ];

  return (
    <div className="my-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <List size={16} className="mr-2" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" size="sm">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Access all sections of the application.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="
                    w-full flex items-center justify-between px-3 py-2 rounded-lg
                    text-sm font-medium text-left
                    text-nocta-700 dark:text-nocta-300
                    hover:bg-nocta-100 dark:hover:bg-nocta-800
                    transition-colors duration-200
                  "
                >
                                   <div className="flex items-center gap-3">
                   <item.icon size={16} className="text-nocta-600 dark:text-nocta-400" />
                   <span>{item.name}</span>
                 </div>
                  {item.badge && (
                    <Badge variant="secondary" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <SheetFooter>
            <div className="w-full">
              <div className="flex items-center gap-3 px-3 py-2 bg-nocta-50 dark:bg-nocta-800 rounded-lg">
                <div className="w-8 h-8 bg-nocta-300 dark:bg-nocta-600 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-nocta-900 dark:text-nocta-100 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-nocta-500 dark:text-nocta-400 truncate">
                    john@example.com
                  </p>
                </div>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const ControlledSheetDemo: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="my-6 space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setOpen(true)}>
          Open Sheet (Controlled)
        </Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close Sheet
        </Button>
        <Badge variant={open ? 'success' : 'secondary'}>
          {open ? 'Open' : 'Closed'}
        </Badge>
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Controlled Sheet</SheetTitle>
            <SheetDescription>
              This sheet is controlled by external state. You can open and close it programmatically.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 flex-1">
            <p className="text-sm text-nocta-600 dark:text-nocta-400">
              This sheet's open state is managed by the parent component. 
              You can control when it opens and closes from outside the Sheet component.
            </p>
            <div className="mt-4 p-3 bg-nocta-50 dark:bg-nocta-800 rounded-lg">
              <p className="text-xs font-mono text-nocta-700 dark:text-nocta-300">
                Current state: {open ? 'open' : 'closed'}
              </p>
            </div>
          </div>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const CustomSheetDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="primary">
            <Sliders size={16} className="mr-2" />
            Customization Panel
          </Button>
        </SheetTrigger>
        <SheetContent showClose={false} className="bg-gradient-to-b from-nocta-50 to-white dark:from-nocta-900 dark:to-nocta-800">
          <SheetHeader className="border-b-2 border-nocta-300 dark:border-nocta-700 bg-white/50 dark:bg-nocta-900/50 backdrop-blur-sm">
            <SheetTitle className="text-xl">Customization</SheetTitle>
            <SheetDescription>
              This sheet has custom styling and no default close button.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-6 flex-1 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-nocta-900 dark:text-nocta-100">Theme Options</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="h-16 bg-blue-500 rounded-lg"></button>
                <button className="h-16 bg-green-500 rounded-lg"></button>
                <button className="h-16 bg-purple-500 rounded-lg"></button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-nocta-900 dark:text-nocta-100">Font Size</h3>
              <div className="flex gap-2">
                <Badge variant="outline">Small</Badge>
                <Badge variant="default">Default</Badge>
                <Badge variant="outline">Large</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-nocta-900 dark:text-nocta-100">Layout</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left border border-nocta-300 dark:border-nocta-700 rounded-lg hover:bg-nocta-100 dark:hover:bg-nocta-800 transition-colors">
                  <div className="text-sm font-medium">Compact</div>
                  <div className="text-xs text-nocta-500">Minimal spacing</div>
                </button>
                <button className="w-full p-3 text-left border-2 border-nocta-900 dark:border-nocta-100 rounded-lg bg-nocta-50 dark:bg-nocta-800">
                  <div className="text-sm font-medium">Comfortable</div>
                  <div className="text-xs text-nocta-500">Standard spacing</div>
                </button>
              </div>
            </div>
          </div>
          <SheetFooter className="bg-white/80 dark:bg-nocta-900/80 backdrop-blur-sm">
            <Button variant="ghost" size="sm">Reset</Button>
            <SheetClose asChild>
              <Button size="sm">Apply Changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}; 