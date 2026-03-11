import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Arabic } from 'next/font/google'
import ErrorBoundary from '@/components/ui/error-boundary'
import CommandPalette from '@/components/ui/command-palette'
import ShortcutsProvider from '@/components/ui/shortcuts-provider'
import ScrollToTop from '@/components/ui/scroll-to-top'
import './globals.css'

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-arabic',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#060b18',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'ProMedia CRM - نظام إدارة العملاء الذكي',
  description:
    'نظام إدارة علاقات العملاء الذكي من برو ميديا - حلول متكاملة لإدارة العملاء والمشاريع والفواتير بالذكاء الاصطناعي',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={`${notoSansArabic.variable} ${notoSansArabic.className} antialiased noise-overlay`}>
        <ErrorBoundary>
          <ShortcutsProvider>
            <CommandPalette />
            {children}
            <ScrollToTop />
          </ShortcutsProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
