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
import { Button } from '@/app/components/ui/button';
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
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '@/app/components/ui/menubar';
import {
	NavigationMenu,
	NavigationMenuGroup,
	NavigationMenuItem,
	NavigationMenuLink,
} from '@/app/components/ui/navigation-menu';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/app/components/ui/popover';
import { Progress } from '@/app/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
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
import { Table } from '@/app/components/ui/table';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import { Toaster, toast } from '@/app/components/ui/toast';
import { Toggle } from '@/app/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { WheelPicker, WheelPickerItem } from '@/app/components/ui/wheel-picker';
import { Pre, CodeBlock as YourCustomCodeBlock } from '@/components/codeblock';
import { DocsTabs } from '@/components/docs-tab';
import { FrameworkSelector } from '@/components/framework-selector';
import { TokenTable } from '@/components/token-table';
import { TypeTable } from '@/components/type-table';
import {
	PieChart,
	PieChartActions,
	PieChartGraph,
	PieChartDataTable,
	PieChartDataTableContent,
	PieChartDescription,
	PieChartHeader,
	PieChartLegend,
	PieChartTitle,
} from '@/app/components/ui/pie-chart';

const Wrap = (Tag: any, className: string) => (props: any) => (
	<Tag className={className} {...props} />
);

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		h1: Wrap('h1', 'scroll-m-20 text-3xl font-medium mt-6 mb-4'),
		h2: Wrap(
			'h2',
			'scroll-m-20 pb-2 text-2xl font-medium first:mt-0 mt-8 mb-3',
		),
		h3: Wrap('h3', 'scroll-m-20 text-xl font-medium mt-6 mb-2'),
		h4: Wrap('h4', 'scroll-m-20 text-xl font-medium mt-4 mb-2'),
		h5: Wrap('h5', 'scroll-m-20 text-lg font-medium mt-3 mb-1'),
		h6: Wrap('h6', 'scroll-m-20 text-base font-medium mt-2 mb-1'),
		p: Wrap('p', 'leading-7 [&:not(:first-child)]:mt-4 text-foreground/70'),
		ul: Wrap('ul', 'my-6 ml-6 list-disc [&>li]:mt-2 marker:text-foreground/70'),
		ol: Wrap(
			'ol',
			'my-6 ml-6 list-decimal [&>li]:mt-2 marker:text-foreground/70',
		),
		li: Wrap('li', 'leading-7 text-foreground/70'),
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
		Toggle,
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
		RadioGroup,
		RadioGroupItem,
		ToggleGroup,
		ToggleGroupItem,
		toast,
		Toaster,
		Table,
		Spinner,
		Slider,
		Skeleton,
		Calendar,
		WheelPicker,
		WheelPickerItem,
		FrameworkSelector,
		Chat,
		ChatMessages,
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
		Menubar,
		MenubarMenu,
		MenubarTrigger,
		MenubarContent,
		MenubarItem,
		MenubarSeparator,
		NavigationMenu,
		NavigationMenuGroup,
		NavigationMenuItem,
		NavigationMenuLink,
		MenubarSub,
		MenubarSubTrigger,
		MenubarSubContent,
		TypeTable,
		TokenTable,
		PieChart,
		PieChartActions,
		PieChartGraph,
		PieChartDataTable,
		PieChartDataTableContent,
		PieChartDescription,
		PieChartHeader,
		PieChartLegend,
		PieChartTitle,
		pre: ({ ref: _ref, ...props }) => (
			<YourCustomCodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</YourCustomCodeBlock>
		),
		...components,
	};
}
