import { GlobeIcon, ViewVerticalIcon } from '@radix-ui/react-icons';
import { HideIfEmpty } from 'fumadocs-core/hide-if-empty';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { NavProvider } from 'fumadocs-ui/contexts/layout';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import {
	type GetSidebarTabsOptions,
	getSidebarTabs,
} from 'fumadocs-ui/utils/get-sidebar-tabs';
import {
	type ComponentProps,
	type HTMLAttributes,
	type ReactNode,
	useMemo,
} from 'react';
import { cn } from '../../../lib/cn';
import { LanguageToggle, LanguageToggleText } from '../../language-toggle';
import { type Option, RootToggle } from '../../root-toggle';
import { LargeSearchToggle, SearchToggle } from '../../search-toggle';
import {
	Sidebar,
	SidebarCollapseTrigger,
	type SidebarComponents,
	SidebarContent,
	SidebarContentMobile,
	SidebarFolder,
	SidebarFolderContent,
	SidebarFolderLink,
	SidebarFolderTrigger,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarPageTree,
	type SidebarProps,
	SidebarTrigger,
	SidebarViewport,
} from '../../sidebar';
import { ThemeToggle } from '../../theme-toggle';
import { buttonVariants } from '../../ui/button';
import {
	type BaseLayoutProps,
	BaseLinkItem,
	getLinks,
	type IconItemType,
	type LinkItemType,
} from '../shared/index';
import { CollapsibleControl, LayoutBody, Navbar } from './client';

export interface DocsLayoutProps extends BaseLayoutProps {
	tree: PageTree.Root;

	sidebar?: SidebarOptions;

	/**
	 * Props for the `div` container
	 */
	containerProps?: HTMLAttributes<HTMLDivElement>;
}

interface SidebarOptions
	extends ComponentProps<'aside'>,
		Pick<SidebarProps, 'defaultOpenLevel' | 'prefetch'> {
	enabled?: boolean;
	component?: ReactNode;
	components?: Partial<SidebarComponents>;

	/**
	 * Root Toggle options
	 */
	tabs?: Option[] | GetSidebarTabsOptions | false;

	banner?: ReactNode;
	footer?: ReactNode;

	/**
	 * Support collapsing the sidebar on desktop mode
	 *
	 * @defaultValue true
	 */
	collapsible?: boolean;
}

export function DocsLayout({
	nav: { transparentMode, ...nav } = {},
	sidebar: {
		tabs: sidebarTabs,
		enabled: sidebarEnabled = true,
		...sidebarProps
	} = {},
	searchToggle = {},
	disableThemeSwitch = false,
	themeSwitch = { enabled: !disableThemeSwitch },
	i18n = false,
	children,
	...props
}: DocsLayoutProps) {
	const tabs = useMemo(() => {
		if (Array.isArray(sidebarTabs)) {
			return sidebarTabs;
		}
		if (typeof sidebarTabs === 'object') {
			return getSidebarTabs(props.tree, sidebarTabs);
		}
		if (sidebarTabs !== false) {
			return getSidebarTabs(props.tree);
		}
		return [];
	}, [sidebarTabs, props.tree]);
	const links = getLinks(props.links ?? [], props.githubUrl);
	const sidebarVariables = cn(
		'md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px]',
	);

	function sidebar() {
		const {
			footer,
			banner,
			collapsible = true,
			component,
			components,
			defaultOpenLevel,
			prefetch,
			...rest
		} = sidebarProps;
		if (component) return component;

		const iconLinks = links.filter(
			(item): item is IconItemType => item.type === 'icon',
		);

		const viewport = (
			<SidebarViewport>
				{links
					.filter((v) => v.type !== 'icon')
					.map((item, i, list) => (
						<SidebarLinkItem
							key={i}
							item={item}
							className={cn(i === list.length - 1 && 'mb-4')}
						/>
					))}
				<SidebarPageTree components={components} />
			</SidebarViewport>
		);

		const mobile = (
			<SidebarContentMobile {...rest}>
				<SidebarHeader>
					<div className="flex items-center gap-1.5 text-foreground/70">
						<div className="flex flex-1">
							{iconLinks.map((item, i) => (
								<BaseLinkItem
									key={i}
									item={item}
									className={cn(
										buttonVariants({
											size: 'icon-sm',
											color: 'ghost',
											className: 'p-2',
										}),
									)}
									aria-label={item.label}
								>
									{item.icon}
								</BaseLinkItem>
							))}
						</div>
						{i18n ? (
							<LanguageToggle>
								<GlobeIcon aria-hidden="true" className="size-4.5" />
								<LanguageToggleText />
							</LanguageToggle>
						) : null}
						{themeSwitch.enabled !== false &&
							(themeSwitch.component ?? (
								<ThemeToggle mode={themeSwitch.mode} />
							))}
						<SidebarTrigger
							className={cn(
								buttonVariants({
									color: 'ghost',
									size: 'icon-sm',
									className: 'p-2',
								}),
							)}
						>
							<ViewVerticalIcon aria-hidden="true" />
						</SidebarTrigger>
					</div>
					{tabs.length > 0 && <RootToggle options={tabs} />}
					{banner}
				</SidebarHeader>
				{viewport}
				<SidebarFooter className="empty:hidden">{footer}</SidebarFooter>
			</SidebarContentMobile>
		);

		const content = (
			<SidebarContent {...rest}>
				<SidebarHeader>
					<div className="flex">
						<Link
							href={nav.url ?? '/'}
							className="me-auto inline-flex items-center gap-2.5 text-[15px] font-medium focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50"
						>
							{nav.title}
						</Link>
						{nav.children}
						{collapsible && (
							<SidebarCollapseTrigger
								className={cn(
									buttonVariants({
										color: 'ghost',
										className:
											'mb-auto text-foreground/70 p-1.5 [&_svg]:size-4.5 cursor-pointer',
									}),
								)}
							>
								<ViewVerticalIcon aria-hidden="true" />
							</SidebarCollapseTrigger>
						)}
					</div>
					{searchToggle.enabled !== false &&
						(searchToggle.components?.lg ?? (
							<LargeSearchToggle hideIfDisabled />
						))}
					{tabs.length > 0 && <RootToggle options={tabs} />}

					{banner}
				</SidebarHeader>
				{viewport}
				<HideIfEmpty as={SidebarFooter}>
					<div className="flex items-center text-foreground/70 empty:hidden">
						{i18n ? (
							<LanguageToggle>
								<GlobeIcon aria-hidden="true" className="size-4.5" />
							</LanguageToggle>
						) : null}
						{iconLinks.map((item, i) => (
							<BaseLinkItem
								key={i}
								item={item}
								className={cn(
									buttonVariants({ size: 'icon-sm', color: 'ghost' }),
								)}
								aria-label={item.label}
							>
								{item.icon}
							</BaseLinkItem>
						))}
						{themeSwitch.enabled !== false &&
							(themeSwitch.component ?? (
								<ThemeToggle className="ms-auto" mode={themeSwitch.mode} />
							))}
					</div>
					{footer}
				</HideIfEmpty>
			</SidebarContent>
		);

		return (
			<Sidebar
				defaultOpenLevel={defaultOpenLevel}
				prefetch={prefetch}
				Mobile={mobile}
				Content={
					<>
						{collapsible && <CollapsibleControl />}
						{content}
					</>
				}
			/>
		);
	}

	return (
		<TreeContextProvider tree={props.tree}>
			<NavProvider transparentMode={transparentMode}>
				{nav.enabled !== false &&
					(nav.component ?? (
						<Navbar className="h-(--fd-nav-height) md:hidden on-root:[--fd-nav-height:56px] md:on-root:[--fd-nav-height:0px]">
							<Link
								href={nav.url ?? '/'}
								className="inline-flex items-center gap-2.5 font-medium"
							>
								{nav.title}
							</Link>
							<div className="flex-1">{nav.children}</div>
							{searchToggle.enabled !== false &&
								(searchToggle.components?.sm ?? (
									<SearchToggle className="p-2" hideIfDisabled />
								))}
							{sidebarEnabled && (
								<SidebarTrigger
									className={cn(
										buttonVariants({
											color: 'ghost',
											size: 'icon-sm',
											className: 'p-2',
										}),
									)}
								>
									<ViewVerticalIcon aria-hidden="true" />
								</SidebarTrigger>
							)}
						</Navbar>
					))}
				<LayoutBody
					{...props.containerProps}
					className={cn(
						'xl:[--fd-toc-width:286px] md:[&_#nd-page_article]:pt-12 xl:[&_#nd-page_article]:px-8',
						sidebarEnabled && sidebarVariables,
						props.containerProps?.className,
					)}
				>
					{sidebarEnabled && sidebar()}
					{children}
				</LayoutBody>
			</NavProvider>
		</TreeContextProvider>
	);
}

function SidebarLinkItem({
	item,
	...props
}: {
	item: Exclude<LinkItemType, { type: 'icon' }>;
	className?: string;
}) {
	if (item.type === 'menu')
		return (
			<SidebarFolder {...props}>
				{item.url ? (
					<SidebarFolderLink href={item.url} external={item.external}>
						{item.icon}
						{item.text}
					</SidebarFolderLink>
				) : (
					<SidebarFolderTrigger>
						{item.icon}
						{item.text}
					</SidebarFolderTrigger>
				)}
				<SidebarFolderContent>
					{item.items.map((child, i) => (
						<SidebarLinkItem key={i} item={child} />
					))}
				</SidebarFolderContent>
			</SidebarFolder>
		);

	if (item.type === 'custom') return <div {...props}>{item.children}</div>;

	return (
		<SidebarItem
			href={item.url}
			icon={item.icon}
			external={item.external}
			{...props}
		>
			{item.text}
		</SidebarItem>
	);
}

export { CollapsibleControl, Navbar, SidebarTrigger, type LinkItemType };
