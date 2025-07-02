'use client';

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogActions, DialogClose } from './dialog';
import { Button } from '../button';
import { Input } from '../input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../select';
import { Spinner } from '../spinner';

export const SimpleDialogDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>
              This is a basic dialog example with a title and description.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Dialog content goes here. You can add any components or content you need.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const DialogWithActionsDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Delete Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This will permanently remove <strong>Project Alpha</strong> and all associated data.
            </p>
          </div>
          <DialogFooter>
            <DialogActions>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <Button variant="primary" size="sm">Delete</Button>
            </DialogActions>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const SizesDemo: React.FC = () => {
  return (
    <div className="my-6 flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost">Small</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>
              This is a small dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Compact dialog for simple interactions.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost">Medium</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Medium Dialog</DialogTitle>
            <DialogDescription>
              This is a medium dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Standard dialog size for most use cases.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost">Large</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>
              This is a large dialog example.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Larger dialog for complex forms or detailed content.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const FormDialogDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New User</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to your team. Fill in their details below.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  First Name
                </label>
                <Input placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  Last Name
                </label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <Input type="email" placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Role
              </label>
              <Select defaultValue="viewer">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogActions>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <Button variant="primary" size="sm">Create User</Button>
            </DialogActions>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const WithoutCloseButtonDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Processing...</Button>
        </DialogTrigger>
        <DialogContent showClose={false} size="sm">
          <DialogHeader>
            <DialogTitle>Processing Request</DialogTitle>
            <DialogDescription>
              Please wait while we process your request...
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-8 text-center">
            <Spinner />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 