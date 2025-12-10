'use client';

import * as React from 'react';
import { Button } from '@/registry/ui/button';
import * as RadixIcons from '@radix-ui/react-icons';
import type { CommandKItem } from '@/registry/ui/command-k';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/registry/ui/sidebar';

type WorkspaceNavChild = {
	id: string;
	title: string;
	icon: keyof typeof RadixIcons;
	tooltip?: string;
};

type WorkspaceNavItem = {
	id: string;
	title: string;
	icon: keyof typeof RadixIcons;
	tooltip?: string;
	defaultOpen?: boolean;
	children?: WorkspaceNavChild[];
};

const workspaceNavigation: WorkspaceNavItem[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: 'HomeIcon',
    tooltip: 'Start with an overview of the system',
  },
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: 'FileTextIcon',
    tooltip: 'Learn the first steps to use Nocta UI',
    defaultOpen: true,
    children: [
      {
        id: 'installation',
        title: 'Installation',
        icon: 'FileTextIcon',
        tooltip: 'Install dependencies in a few commands',
      },
      {
        id: 'project-setup',
        title: 'Project setup',
        icon: 'LayersIcon',
        tooltip: 'Configure a new workspace layout',
      },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    icon: 'Component1Icon',
    tooltip: 'Browse reusable UI building blocks',
    children: [
      {
        id: 'layout-primitives',
        title: 'Layout primitives',
        icon: 'Component1Icon',
        tooltip: 'Arrange pages with foundational sections',
      },
      {
        id: 'data-display',
        title: 'Data display',
        icon: 'Component1Icon',
        tooltip: 'Visualize stats and metrics clearly',
      },
      {
        id: 'overlays',
        title: 'Overlays & dialogs',
        icon: 'Component1Icon',
        tooltip: 'Work with modals, sheets, and popovers',
      },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    icon: 'QuestionMarkCircledIcon',
    tooltip: 'Follow inclusive design best practices',
  },
  {
    id: 'api-reference',
    title: 'API reference',
    icon: 'GearIcon',
    tooltip: 'Review props and available configuration',
  },
];

const sidebarCommandItems: CommandKItem[] = [
  {
    label: 'Introduction',
    group: 'Documentation',
    description: 'Overview of Nocta UI',
    icon: <RadixIcons.HomeIcon aria-hidden="true" className="size-4" />,
  },
  {
    label: 'Getting started',
    group: 'Documentation',
    description: 'Installation & project setup',
    icon: <RadixIcons.FileTextIcon aria-hidden="true" className="size-4" />,
  },
  {
    label: 'Components',
    group: 'Documentation',
    description: 'Browse component primitives',
    icon: <RadixIcons.Component1Icon aria-hidden="true" className="size-4" />,
  },
  {
    label: 'API reference',
    group: 'Documentation',
    description: 'Props & configuration',
    icon: <RadixIcons.GearIcon aria-hidden="true" className="size-4" />,
  },

  {
    label: 'Open repository',
    group: 'Project',
    description: 'View Nocta UI on GitHub',
    icon: <RadixIcons.GitHubLogoIcon aria-hidden="true" className="size-4" />,
  },
  {
    label: 'View release notes',
    group: 'Project',
    description: 'See what’s new in this version',
    icon: <RadixIcons.UpdateIcon aria-hidden="true" className="size-4" />,
  },
];


export function SidebarWorkspaceDemo() {
  const [activeItem, setActiveItem] = React.useState('introduction');
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    () =>
      workspaceNavigation.reduce<Record<string, boolean>>((acc, item) => {
        if (item.defaultOpen) {
          acc[item.id] = true;
        }
        return acc;
      }, {}),
  );

  const handleSectionOpenChange = React.useCallback(
    (sectionId: string, nextOpen: boolean) => {
      setOpenSections((previous) => ({ ...previous, [sectionId]: nextOpen }));
    },
    [],
  );

  const isItemActive = React.useCallback(
    (item: (typeof workspaceNavigation)[number]) => {
      if (activeItem === item.id) {
        return true;
      }
      if (!item.children) {
        return false;
      }
      return item.children.some((child) => child.id === activeItem);
    },
    [activeItem],
  );

  return (
    <div className="w-full overflow-hidden sidebar">
      <SidebarProvider className="relative flex">
        <Sidebar>
          <SidebarHeader>
            <div className='flex items-center justify-start gap-1.5'>
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 0C13.0265 0 14.0227 0.129607 14.9736 0.37207L19 9V2.25586C22.0271 4.43433 24 7.98574 24 12C24 18.6274 18.6274 24 12 24C10.9731 24 9.97671 23.8696 9.02539 23.627L5 15V21.7432C1.97313 19.5647 0 16.0141 0 12C0 5.37258 5.37258 0 12 0ZM12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-base font-medium text-foreground">Nocta UI</p>
            </div>
            <SidebarInput items={sidebarCommandItems} placeholder="Search docs..." />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <div className="relative">
                <SidebarGroupLabel>Documentation</SidebarGroupLabel>
                <SidebarGroupAction aria-label="Add section">
                  <RadixIcons.PlusIcon className="size-4" aria-hidden="true" />
                </SidebarGroupAction>
              </div>

              <SidebarGroupContent>
                <SidebarMenu>
                  {workspaceNavigation.map((item) => {
                    const hasChildren = Boolean(item.children?.length);
                    const collapsibleProps = hasChildren
                      ? {
                          open: Boolean(openSections[item.id]),
                          onOpenChange: (open: boolean) =>
                            handleSectionOpenChange(item.id, open),
                        }
                      : null;

                    const Icon = RadixIcons[item.icon];

                    return (
                      <SidebarMenuItem
                        key={item.id}
                        collapsible={hasChildren}
                        {...(collapsibleProps ?? {})}
                      >
                        <SidebarMenuButton
                          isActive={isItemActive(item)}
                          onClick={() => {
                            if (!hasChildren) {
                              setActiveItem(item.id);
                            }
                          }}
                          tooltip={item.tooltip}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="size-4" aria-hidden="true" />
                            <span>{item.title}</span>
                          </span>
                        </SidebarMenuButton>

                        {hasChildren ? (
                          <SidebarMenuSub>
                            {item.children?.map((child) => {
                              const ChildIcon = RadixIcons[child.icon];

                              return (
                                <SidebarMenuSubItem key={child.id}>
                                  <SidebarMenuSubButton
                                    isActive={activeItem === child.id}
                                    onClick={() => setActiveItem(child.id)}
                                    tooltip={child.tooltip}
                                  >
                                    <span className="flex items-center gap-2">
                                      <ChildIcon className="size-4" aria-hidden="true" />
                                      <span>{child.title}</span>
                                    </span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Project</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeItem === "repository"}
                      onClick={() => setActiveItem("repository")}
                      tooltip="View the GitHub project workspace"
                    >
                      <span className="flex items-center gap-2">
                        <RadixIcons.GitHubLogoIcon className="size-4" aria-hidden="true" />
                        <span>Repository</span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <Button size="sm" className="w-full">
              View release notes
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarTrigger />

        <SidebarInset className="bg-background rounded-md grid grid-cols-3 grid-rows-3 gap-2 p-2 h-160">
          <div className="row-span-1 col-span-3 grid grid-cols-3 gap-2 w-full">
            <div className="h-full bg-card rounded-md" />
            <div className="h-full bg-card rounded-md" />
            <div className="h-full bg-card rounded-md" />
          </div>
          <div className="col-span-3 row-span-2 bg-card rounded-md" />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
