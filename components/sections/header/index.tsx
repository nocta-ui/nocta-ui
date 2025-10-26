import { ChevronDownIcon, GlobeIcon } from '@radix-ui/react-icons';
import Link from 'fumadocs-core/link';
import {
	LanguageToggle,
	LanguageToggleText,
} from 'fumadocs-ui/components/layout/language-toggle';
import { NavigationMenuList } from 'fumadocs-ui/components/ui/navigation-menu';
import { SearchOnly } from 'fumadocs-ui/contexts/search';
import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { HomeLayoutProps } from '@/components/layout/home';
import {
	NavbarLink,
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuTrigger,
} from '@/components/layout/home/navbar';
import { LargeSearchToggle, SearchToggle } from '@/components/search-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, MenuContent, MenuLinkItem, MenuTrigger } from './menu';
import { Navbar, NavbarMenuLink } from './navbar';

export const Header = ({
	nav: { ...nav } = {},
	i18n = false,
	finalLinks,
}: HomeLayoutProps & {
	finalLinks: LinkItemType[];
}) => {
	const navItems = finalLinks.filter((item) =>
		['nav', 'all'].includes(item.on ?? 'all'),
	);
	const menuItems = finalLinks.filter((item) =>
		['menu', 'all'].includes(item.on ?? 'all'),
	);

	return (
		<Navbar>
			<Link
				href={nav.url ?? '/'}
				className="inline-flex items-center gap-2.5 font-semibold"
			>
				{nav.title}
			</Link>
			{nav.children}
			<NavigationMenuList className="ml-2 flex flex-row items-center gap-2 max-sm:hidden">
				{navItems
					.filter((item) => !isSecondary(item))
					.map((item, i) => (
						<NavbarLinkItem
							key={i.toString()}
							item={item}
							className="text-sm"
						/>
					))}
			</NavigationMenuList>
			<div className="flex flex-1 flex-row items-center justify-end lg:gap-1.5">
				<SearchOnly>
					<SearchToggle className="lg:hidden" />
					<LargeSearchToggle className="w-full max-w-60 rounded-md text-foreground/35 hover:text-foreground/70 max-lg:hidden cursor-pointer" />
				</SearchOnly>
				<ThemeToggle />
				{navItems.filter(isSecondary).map((item, i) => (
					<NavbarLinkItem
						key={i.toString()}
						item={item}
						className="-me-1.5 max-lg:hidden"
					/>
				))}
				<Menu className="lg:hidden">
					<MenuTrigger className="group -me-2">
						<ChevronDownIcon
							aria-hidden="true"
							className="size-3 transition-transform duration-300 group-data-[state=open]:rotate-180"
						/>
					</MenuTrigger>
					<MenuContent className="sm:flex-row sm:items-center sm:justify-end">
						{menuItems
							.filter((item) => !isSecondary(item))
							.map((item, i) => (
								<MenuLinkItem
									key={i.toString()}
									item={item}
									className="sm:hidden"
								/>
							))}
						<div className="-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2">
							{menuItems.filter(isSecondary).map((item, i) => (
								<MenuLinkItem
									key={i.toString()}
									item={item}
									className="-me-1.5"
								/>
							))}
							<div className="flex-1" />
							{i18n ? (
								<LanguageToggle>
									<GlobeIcon aria-hidden="true" className="size-5" />
									<LanguageToggleText />
									<ChevronDownIcon
										aria-hidden="true"
										className="size-3 text-foreground/70"
									/>
								</LanguageToggle>
							) : null}
						</div>
					</MenuContent>
				</Menu>
			</div>
		</Navbar>
	);
};

const NavbarLinkItem = ({
	item,
	...props
}: {
	item: LinkItemType;
	className?: string;
}) => {
	if (item.type === 'custom') return <div {...props}>{item.children}</div>;

	if (item.type === 'menu') {
		const children = item.items.map((child, j) => {
			if (child.type === 'custom')
				return <div key={j.toString()}>{child.children}</div>;

			const { banner, ...rest } = child.menu ?? {};

			return (
				<NavbarMenuLink key={j.toString()} href={child.url} {...rest}>
					{banner ??
						(child.icon ? (
							<div className="w-fit rounded-md border bg-card-muted p-1 [&_svg]:size-4">
								{child.icon}
							</div>
						) : null)}
					<p className="-mb-1 text-sm font-medium">{child.text}</p>
					{child.description ? (
						<p className="text-[13px]">{child.description}</p>
					) : null}
				</NavbarMenuLink>
			);
		});

		return (
			<NavbarMenu>
				<NavbarMenuTrigger {...props}>
					{item.url ? <Link href={item.url}>{item.text}</Link> : item.text}
				</NavbarMenuTrigger>
				<NavbarMenuContent className="container border-fd-border sm:border-x">
					{children}
				</NavbarMenuContent>
			</NavbarMenu>
		);
	}

	return (
		<NavbarLink
			{...props}
			item={item}
			variant={item.type}
			aria-label={item.type === 'icon' ? item.label : undefined}
		>
			{item.type === 'icon' ? item.icon : item.text}
		</NavbarLink>
	);
};

const isSecondary = (item: LinkItemType): boolean => {
	return (
		('secondary' in item && item.secondary === true) || item.type === 'icon'
	);
};
