import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

const ppNeueMontreal = localFont({
  src: [
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-Thin.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-ThinItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-SemiBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-SemiBoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-Bold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontreal/PPNeueMontreal-BoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-ppneuemontreal",
  display: "swap",
});

const ppNeueMontrealMono = localFont({
  src: [
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/PPNeueMontrealMono/PPNeueMontrealMono-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-ppneuemontrealmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nocta UI",
    default: "Nocta UI - Modern React Component Library",
  },
  description:
    "A modern, accessible React component library built with simplicity, performance, and developer experience at its core. Copy-paste components with full TypeScript support.",
  keywords: [
    "React",
    "Components",
    "UI Library",
    "TypeScript",
    "Tailwind CSS",
    "Accessible",
    "Copy Paste",
    "shadcn/ui",
    "Design System",
    "Frontend",
    "Web Development",
  ],
  authors: [
    {
      name: "Marek Jóźwiak",
    },
  ],
  creator: "Marek Jóźwiak",
  publisher: "Nocta UI",
  metadataBase: new URL("https://nocta-ui.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nocta-ui.com",
    title: "Nocta UI - Modern React Component Library",
    description:
      "A modern, accessible React component library built with simplicity, performance, and developer experience at its core. Copy-paste components with full TypeScript support.",
    siteName: "Nocta UI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nocta UI - Modern React Component Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nocta UI - Modern React Component Library",
    description:
      "A modern, accessible React component library built with simplicity, performance, and developer experience at its core.",
    images: ["/og-image.jpg"],
    creator: "@nocta_ui",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "React Component Library",
  other: {
    "theme-color": "#ffffff",
    "color-scheme": "light dark",
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "apple-mobile-web-app-title": "Nocta UI",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ppNeueMontreal.variable} ${ppNeueMontrealMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
