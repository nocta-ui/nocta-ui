"use client";

import type React from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

export const SimpleCardDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Card className="max-w-100">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Learn how to use the Card component in your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This is a basic card example showing the fundamental structure and
            styling.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const CardWithActionsDemo: React.FC = () => {
  return (
    <div className="my-6 w-100">
      <Card className="w-full max-w-100">
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>
            Manage your project configuration and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/70">
                Status
              </span>
              <Badge size="sm" variant="success">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/70">
                Members
              </span>
              <span className="text-sm text-foreground/70">12</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <CardActions>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Save Changes
            </Button>
          </CardActions>
        </CardFooter>
      </Card>
    </div>
  );
};
