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
import { Textarea } from '@/app/components/ui/textarea';
import { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage, FormActions } from '@/app/components/ui/form';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
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
    Textarea,
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormActions,
    ...components,
  };
}
