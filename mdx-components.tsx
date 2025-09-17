import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "@/app/components/ui/alert";
import { Avatar } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Button } from "@/app/components/ui/button/";
import { Calendar } from "@/app/components/ui/calendar";
import {
	Card,
	CardActions,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/app/components/ui/card";
import {
	Chat,
	ChatActions,
	ChatDescription,
	ChatHeader,
	ChatInput,
	ChatMessage,
	ChatMessages,
	ChatTitle,
} from "@/app/components/ui/chat";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
	Pre,
	CodeBlock as YourCustomCodeBlock,
} from "@/app/components/ui/codeblock/codeblock";
import { Combobox } from "@/app/components/ui/combobox";
import { CommandK } from "@/app/components/ui/command-k";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/app/components/ui/context-menu";
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
} from "@/app/components/ui/dialog";
import { DocsTabs } from "@/app/components/ui/docs-tab";
import {
	FileUpload,
	FileUploadItem,
	FileUploadProgress,
	FileUploadZone,
} from "@/app/components/ui/file-upload";
import {
	Form,
	FormActions,
	FormControl,
	FormDescription,
	FormField,
	FormLabel,
	FormMessage,
} from "@/app/components/ui/form";
import { FrameworkSelector } from "@/app/components/ui/framework-selector";
import { Input } from "@/app/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/components/ui/popover";
import { Progress } from "@/app/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/app/components/ui/sheet";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { Spinner } from "@/app/components/ui/spinner";
import { Switch } from "@/app/components/ui/switch";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHeader,
	TableRow,
} from "@/app/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import { Toaster, toast } from "@/app/components/ui/toast";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/app/components/ui/tooltip";

const wrap = (Tag: any, className?: string) => (props: any) => (
	<Tag className={className} {...props} />
);

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		p: wrap("p", " !text-foreground-muted/75 leading-relaxed font-light"),
		code: wrap("code", " !text-foreground-muted"),
		li: wrap("li", ""),
		blockquote: wrap("blockquote", "!text-foreground italic border-l-2 pl-4"),
		h1: wrap("h1", "!text-foreground !font-regular text-3xl mt-6 mb-3"),
		h2: wrap("h2", "!text-foreground !font-normal text-2xl mt-5 mb-2"),
		h3: wrap("h3", "!text-foreground/80 !font-normal text-lg mt-4 mb-1"),
		h4: wrap("h4", "!text-foreground/50 !font-normal !text-lg mt-3 mb-1"),
		h5: wrap("h5", "!text-foreground/50 !font-normal !text-base mt-2 mb-1"),
		h6: wrap("h6", "!text-foreground/50 !font-normal text-sm mt-1 mb-1"),
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
		ChatHeader,
		ChatTitle,
		ChatDescription,
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
		pre: ({ ref: _ref, ...props }) => (
			<YourCustomCodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</YourCustomCodeBlock>
		),
		...components,
	};
}
