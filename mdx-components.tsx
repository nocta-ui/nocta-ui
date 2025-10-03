import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/app/components/ui/accordion';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from '@/app/components/ui/alert';
import { Avatar } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';
import { Button } from '@/app/components/ui/button/';
import { Calendar } from '@/app/components/ui/calendar';
import {
	Card,
	CardActions,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/app/components/ui/card';
import {
	Chat,
	ChatActions,
	ChatInput,
	ChatMessage,
	ChatMessages,
} from '@/app/components/ui/chat';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Combobox } from '@/app/components/ui/combobox';
import { CommandK } from '@/app/components/ui/command-k';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@/app/components/ui/context-menu';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/app/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
	FileUpload,
	FileUploadItem,
	FileUploadProgress,
	FileUploadZone,
} from '@/app/components/ui/file-upload';
import {
	Form,
	FormActions,
	FormControl,
	FormDescription,
	FormField,
	FormLabel,
	FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/app/components/ui/popover';
import { Progress } from '@/app/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/app/components/ui/select';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/app/components/ui/sheet';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Slider } from '@/app/components/ui/slider';
import { Spinner } from '@/app/components/ui/spinner';
import { Switch } from '@/app/components/ui/switch';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import { Toaster, toast } from '@/app/components/ui/toast';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { Pre, CodeBlock as YourCustomCodeBlock } from '@/components/codeblock';
import { DocsTabs } from '@/components/docs-tab';
import { FrameworkSelector } from '@/components/framework-selector';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const wrap = (Tag: any, className?: string) => (props: any) => (
	<Tag className={className} {...props} />
);

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
		toast,
		Toaster,
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
		Chat,
		ChatMessages,
		ChatMessage,
		ChatInput,
		ChatActions,
		Breadcrumb,
		BreadcrumbList,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbPage,
		BreadcrumbSeparator,
		BreadcrumbEllipsis,
		FileUpload,
		FileUploadZone,
		FileUploadItem,
		FileUploadProgress,
		CommandK,
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuSub,
		DropdownMenuSubTrigger,
		DropdownMenuSubContent,
		pre: ({ ref: _ref, ...props }) => (
			<YourCustomCodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</YourCustomCodeBlock>
		),
		...components,
	};
}
