import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { FrameworkSelector } from '@/app/components/ui/framework-selector';
import { DocsTabs } from '@/app/components/ui/docs-tab';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardActions } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button/';
import { Input } from '@/app/components/ui/input';
import { Alert, AlertTitle, AlertDescription, AlertIcon } from '@/app/components/ui/alert';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogActions, DialogClose } from '@/app/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/app/components/ui/tooltip';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Combobox } from '@/app/components/ui/combobox';
import { Popover, PopoverTrigger, PopoverContent } from '@/app/components/ui/popover';
import { Avatar } from '@/app/components/ui/avatar';
import { Textarea } from '@/app/components/ui/textarea';
import { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage, FormActions } from '@/app/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/app/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/app/components/ui/accordion';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from '@/app/components/ui/context-menu';
import { Progress } from '@/app/components/ui/progress';
import { ToastProvider, useToast } from '@/app/components/ui/toast';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableFooter, TableCaption } from '@/app/components/ui/table';
import { Spinner } from '@/app/components/ui/spinner';
import { Slider } from '@/app/components/ui/slider';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Calendar } from '@/app/components/ui/calendar';
import { CodeBlock as YourCustomCodeBlock, Pre } from '@/app/components/ui/codeblock/codeblock';

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
    Combobox,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Avatar,
    Textarea,
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormActions,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    Progress,
    ToastProvider,
    useToast,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TableCaption,
    Spinner,
    Slider,
    Skeleton,
    Calendar,
    FrameworkSelector,

    pre: ({ ref: _ref, ...props }) => (
      <YourCustomCodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </YourCustomCodeBlock>
    ),
    ...components,
  };
}
