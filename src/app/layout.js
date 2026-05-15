import { Inter } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Aura Engine | Enterprise Inventory Suite',
  description:
    'Lightning-fast enterprise inventory management dashboard. Real-time analytics, intelligent stock tracking, and advanced data visualization for warehouse operations.',
  keywords: 'inventory management, warehouse, analytics, stock tracking, enterprise',
  authors: [{ name: 'Prodesk IT' }],
  openGraph: {
    title: 'Aura Engine | Enterprise Inventory Suite',
    description: 'Modern inventory management for enterprise logistics operations.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
