'use client';

import React, { useState } from 'react';
import { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage, FormActions } from './form';
import { Input } from '../input';
import { Button } from '../button';
import { Textarea } from '../textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../select';
import { Checkbox } from '../checkbox';

export const BasicFormDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="my-6 w-96">
      <Form onSubmit={handleSubmit} className="max-w-md">
        <FormField name="name">
          <FormLabel required>Full Name</FormLabel>
          <FormControl>
            <Input 
              className="w-full"
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </FormControl>
          <FormDescription>This will be displayed on your profile.</FormDescription>
        </FormField>

        <FormField name="email">
          <FormLabel required>Email</FormLabel>
          <FormControl>
            <Input 
              className="w-full"
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </FormControl>
        </FormField>

        <FormActions>
          <Button type="submit">Submit</Button>
        </FormActions>
      </Form>
    </div>
  );
};

export const FormWithErrorsDemo: React.FC = () => {
  const [errors] = useState({
    username: 'Username is already taken',
    password: ''
  });

  return (
    <div className="my-6 w-96">
      <Form className="max-w-md">
        <FormField name="username" error={errors.username}>
          <FormLabel required>Username</FormLabel>
          <FormControl>
            <Input className="w-full" placeholder="Choose a username" />
          </FormControl>
          <FormMessage />
        </FormField>

        <FormField name="password" error={errors.password}>
          <FormLabel required>Password</FormLabel>
          <FormControl>
            <Input className="w-full" type="password" placeholder="Create a password" />
          </FormControl>
          <FormDescription>Must be at least 8 characters long.</FormDescription>
          <FormMessage />
        </FormField>

        <FormActions>
          <Button variant="secondary">Reset</Button>
          <Button type="submit">Create Account</Button>
        </FormActions>
      </Form>
    </div>
  );
};

export const ComplexFormDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    bio: '',
    newsletter: false
  });

  return (
    <div className="my-6 w-96">
      <Form className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="firstName">
            <FormLabel required>First Name</FormLabel>
            <FormControl>
              <Input 
                className="w-full"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </FormControl>
          </FormField>

          <FormField name="lastName">
            <FormLabel required>Last Name</FormLabel>
            <FormControl>
              <Input 
                className="w-full"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </FormControl>
          </FormField>
        </div>

        <FormField name="email">
          <FormLabel required>Email Address</FormLabel>
          <FormControl>
            <Input 
              className="w-full"
              type="email" 
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </FormControl>
          <FormDescription>We&apos;ll never share your email with anyone else.</FormDescription>
        </FormField>

        <FormField name="country">
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="pl">Poland</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormField>

        <FormField name="bio">
          <FormLabel>Bio</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </FormControl>
          <FormDescription>Brief description for your profile. Maximum 500 characters.</FormDescription>
        </FormField>

        <FormField name="newsletter">
          <div className="flex items-center space-x-2">
            <FormControl>
              <Checkbox 
                checked={formData.newsletter}
                onCheckedChange={(checked) => setFormData({...formData, newsletter: !!checked})}
              />
            </FormControl>
            <FormLabel>Subscribe to newsletter</FormLabel>
          </div>
          <FormDescription>Get notified about new features and updates.</FormDescription>
        </FormField>

        <FormActions align="right">
          <Button variant="ghost">Cancel</Button>
          <Button variant="secondary">Save Draft</Button>
          <Button type="submit">Save Profile</Button>
        </FormActions>
      </Form>
    </div>
  );
};

export const FormActionsVariantsDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-8 w-96">
      {/* Left aligned actions */}
      <Form className="max-w-md">
        <FormField name="example1">
          <FormLabel>Example Field</FormLabel>
          <FormControl>
            <Input className="w-full" placeholder="Enter something..." />
          </FormControl>
        </FormField>
        <FormActions align="left">
          <Button>Left Aligned</Button>
          <Button variant="secondary">Cancel</Button>
        </FormActions>
      </Form>

      {/* Center aligned actions */}
      <Form className="max-w-md">
        <FormField name="example2">
          <FormLabel>Example Field</FormLabel>
          <FormControl>
            <Input className="w-full" placeholder="Enter something..." />
          </FormControl>
        </FormField>
        <FormActions align="center">
          <Button variant="secondary">Cancel</Button>
          <Button>Center Aligned</Button>
        </FormActions>
      </Form>

      {/* Right aligned actions (default) */}
      <Form className="max-w-md">
        <FormField name="example3">
          <FormLabel>Example Field</FormLabel>
          <FormControl>
            <Input className="w-full" placeholder="Enter something..." />
          </FormControl>
        </FormField>
        <FormActions align="right">
          <Button variant="ghost">Cancel</Button>
          <Button>Right Aligned</Button>
        </FormActions>
      </Form>
    </div>
  );
};

export const FormMessageTypesDemo: React.FC = () => {
  return (
    <div className="my-6 w-96">
      <Form className="max-w-md space-y-4">
        <FormField name="success" error="">
          <FormLabel>Success Field</FormLabel>
          <FormControl>
            <Input className="w-full" defaultValue="valid@email.com" />
          </FormControl>
          <FormMessage type="success">Email is available!</FormMessage>
        </FormField>

        <FormField name="warning" error="">
          <FormLabel>Warning Field</FormLabel>
          <FormControl>
            <Input className="w-full" defaultValue="weak-password" />
          </FormControl>
          <FormMessage type="warning">Password strength is weak</FormMessage>
        </FormField>

        <FormField name="error" error="This field is required">
          <FormLabel>Error Field</FormLabel>
          <FormControl>
            <Input className="w-full" />
          </FormControl>
          <FormMessage type="error" />
        </FormField>
      </Form>
    </div>
  );
}; 