import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const haskoy = localFont({
  src: './assets/fonts/Haskoy-variable.woff2',
  variable: '--font-haskoy',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Nocta UI',
    default: 'Nocta UI - Modern React Component Library'
  },
  description: 'A modern, accessible React component library built with simplicity, performance, and developer experience at its core. Copy-paste components with full TypeScript support.',
  keywords: [
    'React',
    'Components',
    'UI Library',
    'TypeScript',
    'Tailwind CSS',
    'Accessible',
    'Copy Paste',
    'shadcn/ui',
    'Design System',
    'Frontend',
    'Web Development'
  ],
  authors: [
    {
      name: 'Nocta UI Team',
    }
  ],
  creator: 'Nocta UI Team',
  publisher: 'Nocta UI',
  metadataBase: new URL('https://nocta-ui-beryl.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nocta-ui-beryl.vercel.app',
    title: 'Nocta UI - Modern React Component Library',
    description: 'A modern, accessible React component library built with simplicity, performance, and developer experience at its core. Copy-paste components with full TypeScript support.',
    siteName: 'Nocta UI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nocta UI - Modern React Component Library',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nocta UI - Modern React Component Library',
    description: 'A modern, accessible React component library built with simplicity, performance, and developer experience at its core.',
    images: ['/og-image.jpg'],
    creator: '@nocta_ui',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'technology',
  classification: 'React Component Library',
  other: {
    'theme-color': '#ffffff',
    'color-scheme': 'light dark',
    'mobile-web-app-capable': 'yes',
    'mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={haskoy.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
