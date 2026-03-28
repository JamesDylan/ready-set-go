import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import '../styles/globals.css';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';

const fredoka = Fredoka({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-fredoka-one',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Unicorn Sparkles',
  description: 'Morning and bedtime routines for kids',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Unicorn Sparkles',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className={`${nunito.className} h-full`}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
