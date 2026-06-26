import Link from 'next/link'

const footerLinks = [
  { label: '博客', href: '/blog' },
  { label: '文档', href: '/docs' },
  { label: '无栈云引', href: 'https://nostack.cn' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-cyan to-brand-indigo">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-ink-900">无栈云引</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-ink-500 transition-colors hover:text-brand-cyan">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-surface-100 pt-6 text-center">
          <p className="text-xs text-ink-400">© {year} 无栈云引 · 保留所有权利</p>
        </div>
      </div>
    </footer>
  )
}
