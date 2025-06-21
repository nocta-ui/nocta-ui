import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

const haskoy = localFont({
  src: './assets/fonts/Haskoy-variable.woff2',
  variable: '--font-haskoy',
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={haskoy.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
