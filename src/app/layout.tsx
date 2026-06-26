import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nostack.cn'
const siteName = '无栈云引'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — 博客`,
    template: `%s | ${siteName}`,
  },
  description: '无栈云引技术博客，分享云计算、域名管理、SSL 证书监控的实践经验与技术思考。',
  authors: [{ name: '无栈云引' }],
  creator: '无栈云引',
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export const viewport = {
  themeColor: '#0891B2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
