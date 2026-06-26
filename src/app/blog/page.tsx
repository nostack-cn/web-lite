import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogList from '@/components/BlogList'
import { getBlogList, PAGE_SIZE } from '@/lib/blog'

export const metadata: Metadata = {
  title: '博客',
  description: '无栈云引技术博客，分享云计算、域名管理、SSL 证书监控的实践经验与技术思考。',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const result = await getBlogList(1, PAGE_SIZE)
  const posts = result?.list ?? []
  const total = result?.total ?? 0

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-cyan/10 via-brand-indigo/5 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-cyan">
                博客
              </span>
              <h1 className="mt-4 text-4xl font-bold text-ink-900 sm:text-5xl">
                技术思考与<span className="text-gradient">实践经验</span>
              </h1>
              <p className="mt-4 text-lg text-ink-500">
                分享域名管理、SSL 证书、网站监控与运维安全的深度文章
              </p>
              {total > 0 && (
                <p className="mt-2 text-sm text-ink-400">共 {total} 篇文章</p>
              )}
            </div>
          </div>
        </section>

        {/* Blog grid */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BlogList initialPosts={posts} initialTotal={total} initialPage={1} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
