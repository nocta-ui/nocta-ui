import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardActions } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button/';
import { DocsTabs } from '@/app/components/ui/docs-tab';
import { Input } from '@/app/components/ui/input';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Custom paragraph component that doesn't create nested p tags
    p: ({ children, className, ...props }) => {
      // If we're inside a Card component context, render as div to avoid nested p tags
      if (className?.includes('text-sm') || typeof children === 'string') {
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
    ...components,
  };
}
