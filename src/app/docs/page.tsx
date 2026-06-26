import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '文档',
  description: '无栈云引产品文档，帮助您快速上手域名监控、SSL 证书管理等功能。',
  alternates: { canonical: '/docs' },
}

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-indigo/10 via-brand-cyan/5 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block rounded-full bg-brand-indigo/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-indigo">
              文档
            </span>
            <h1 className="mt-4 text-4xl font-bold text-ink-900 sm:text-5xl">
              产品<span className="text-gradient">使用文档</span>
            </h1>
            <p className="mt-4 text-lg text-ink-500">
              帮助您快速上手无栈云引的各项功能
            </p>
          </div>
        </section>

        {/* Coming soon */}
        <section className="pb-32">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-surface-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-indigo/10 to-brand-cyan/10">
                <svg className="h-8 w-8 text-brand-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-ink-900">文档建设中</h2>
              <p className="mt-3 text-ink-500">
                我们正在整理和完善产品文档，敬请期待。
              </p>
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                >
                  浏览技术博客
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
