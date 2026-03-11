import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-arabic',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
}

export const metadata: Metadata = {
  title: 'ProMedia CRM - نظام إدارة العملاء الذكي',
  description:
    'نظام إدارة علاقات العملاء الذكي من برو ميديا - حلول متكاملة لإدارة العملاء والمشاريع والفواتير بالذكاء الاصطناعي',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${notoSansArabic.variable} ${notoSansArabic.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
