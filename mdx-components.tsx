import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardActions } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button/';
import { DocsTabs } from '@/app/components/ui/docs-tab';
import { Input } from '@/app/components/ui/input';
import { Alert, AlertTitle, AlertDescription, AlertIcon } from '@/app/components/ui/alert';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogActions, DialogClose } from '@/app/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/app/components/ui/tooltip';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Avatar } from '@/app/components/ui/avatar';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Custom paragraph component that doesn't create nested p tags
    p: ({ children, className, ...props }) => {
      // Check if we're in a context that might already contain p tags
      const isSmallText = className?.includes('text-sm');
      const isStringContent = typeof children === 'string';
      const hasNeutralColor = className?.includes('text-neutral-600') || className?.includes('text-neutral-400');
      const isInDialog = className?.includes('my-6') || className?.includes('px-6') || className?.includes('py-4');
      
      // If we're inside components that render p tags or in dialog context, render as span to avoid nested p tags  
      if (isSmallText || isStringContent || hasNeutralColor || isInDialog) {
        return <span className={className} {...props}>{children}</span>;
      }
      
      return <p className={className} {...props}>{children}</p>;
    },
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardActions,
    Button,
    DocsTabs,
    Input,
    Alert,
    AlertTitle,
    AlertDescription,
    AlertIcon,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    Badge,
    Switch,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogActions,
    DialogClose,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    Checkbox,
    Avatar,
    ...components,
  };
}
