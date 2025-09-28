"use client";

import type React from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export const BasicTabsDemo: React.FC = () => {
  return (
    <div className="my-6 w-96">
      <Tabs defaultValue="overview" className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View your account overview and recent activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">
                This is the overview tab content. You can add any components
                here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Page Views</span>
                  <Badge>1,234</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unique Visitors</span>
                  <Badge variant="secondary">567</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download detailed reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  Download Monthly Report
                </Button>
                <Button variant="ghost" className="w-full">
                  View All Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const VariantsDemo: React.FC = () => {
  return (
    <div className="my-6 w-72 space-y-8">
      {/* Default variant */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Default</h4>
        <Tabs defaultValue="tab1" variant="default">
          <TabsList>
            <TabsTrigger value="tab1">Account</TabsTrigger>
            <TabsTrigger value="tab2">Password</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm text-foreground/70">
              Account settings and profile information.
            </p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm text-foreground/70">
              Change your password and security settings.
            </p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm text-foreground/70">
              Application preferences and configurations.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pills variant */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Pills</h4>
        <Tabs defaultValue="tab1" variant="pills">
          <TabsList>
            <TabsTrigger value="tab1">Home</TabsTrigger>
            <TabsTrigger value="tab2">Products</TabsTrigger>
            <TabsTrigger value="tab3">About</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm text-foreground/70">
              Welcome to the home page content.
            </p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm text-foreground/70">
              Browse our product catalog.
            </p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm text-foreground/70">
              Learn more about our company.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Underline variant */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Underline</h4>
        <Tabs defaultValue="tab1" variant="underline">
          <TabsList>
            <TabsTrigger value="tab1">Dashboard</TabsTrigger>
            <TabsTrigger value="tab2">Team</TabsTrigger>
            <TabsTrigger value="tab3">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm text-foreground/70">
              Your dashboard overview and quick stats.
            </p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm text-foreground/70">
              Manage your team members and permissions.
            </p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm text-foreground/70">
              View and manage your active projects.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const SizesDemo: React.FC = () => {
  return (
    <div className="my-6 w-64 space-y-8">
      {/* Small size */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Small</h4>
        <Tabs defaultValue="tab1" size="sm">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm text-foreground/70">Small tab content.</p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm text-foreground/70">Small tab content.</p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm text-foreground/70">Small tab content.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Medium size */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Medium</h4>
        <Tabs defaultValue="tab1" size="md">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm text-foreground/70">Medium tab content.</p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm text-foreground/70">Medium tab content.</p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm text-foreground/70">Medium tab content.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Large size */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Large</h4>
        <Tabs defaultValue="tab1" size="lg">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p className="text-sm text-foreground/70">Large tab content.</p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p className="text-sm text-foreground/70">Large tab content.</p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p className="text-sm text-foreground/70">Large tab content.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const VerticalTabsDemo: React.FC = () => {
  return (
    <div className="my-6 w-120">
      <Tabs defaultValue="general" orientation="vertical" className="max-w-2xl">
        <TabsList className="h-fit">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your general account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <p className="mt-1 text-sm text-foreground/70">
                      This is your public display name.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="mt-1 text-sm text-foreground/70">
                      Your email address for notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Two-Factor Authentication
                    </label>
                    <p className="mt-1 text-sm text-foreground/70">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Button variant="secondary">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect your account with third-party services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
                  No integrations configured yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Advanced configuration options for power users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
                  Advanced settings and developer options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export const DisabledTabsDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
          <TabsTrigger value="coming-soon" disabled>
            Coming Soon
          </TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70">
                This tab is available and can be accessed.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="disabled" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70">
                This content won&apos;t be shown as the tab is disabled.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coming-soon" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70">
                Coming soon feature content.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
