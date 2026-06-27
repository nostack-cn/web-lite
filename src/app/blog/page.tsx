'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogList from '@/components/BlogList'
import BlogContent from '@/components/BlogContent'
import { getBlogList, getBlogBySlug, PAGE_SIZE, type BlogPost } from '@/lib/blog'

export default function BlogPage() {
  const pathname = usePathname()
  // /blog → 列表, /blog/xxx → 详情
  const segments = pathname.split('/').filter(Boolean)
  const slug = segments.length > 1 ? segments[1] : undefined

  if (slug) {
    return <BlogDetailView slug={slug} />
  }
  return <BlogListView />
}

function BlogListView() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogList(1, PAGE_SIZE).then((result) => {
      setPosts(result?.list ?? [])
      setTotal(result?.total ?? 0)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
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

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-24 gap-2 text-sm text-ink-500">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
                加载中…
              </div>
            ) : (
              <BlogList initialPosts={posts} initialTotal={total} initialPage={1} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function BlogDetailView({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getBlogBySlug(slug).then((data) => {
      if (!data) setNotFound(true)
      else setPost(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
            加载中…
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (notFound || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-16 flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-ink-500">文章不存在或已下架</p>
          <Link href="/blog" className="text-brand-cyan hover:underline">返回博客列表</Link>
        </main>
        <Footer />
      </>
    )
  }

  const tags = (post.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <article>
          <section className="relative overflow-hidden py-14 sm:py-20">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-cyan/10 via-brand-indigo/5 to-transparent blur-3xl" />
            </div>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <nav className="mb-6 flex items-center gap-2 text-sm text-ink-400">
                <Link href="/blog" className="transition-colors hover:text-brand-cyan">博客</Link>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="truncate text-ink-600">{post.title}</span>
              </nav>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan">{tag}</span>
                ))}
              </div>

              <h1 className="text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">{post.title}</h1>
              {post.summary && <p className="mt-4 text-lg leading-relaxed text-ink-500">{post.summary}</p>}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-400">
                {post.author_name && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-indigo/20 text-xs font-semibold text-brand-cyan">
                      {post.author_name.charAt(0).toUpperCase()}
                    </div>
                    <span>{post.author_name}</span>
                  </div>
                )}
                {dateStr && <span>{dateStr}</span>}
                {post.view_count > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.view_count} 阅读
                  </span>
                )}
              </div>
            </div>
          </section>

          {post.cover_image && (
            <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl px-4 sm:px-6 lg:px-8">
              <img src={post.cover_image} alt={post.title} className="w-full max-h-96 object-cover rounded-2xl" />
            </div>
          )}

          <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
            <BlogContent content={post.content} />
            <div className="mt-16 border-t border-surface-200 pt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-cyan-dark">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                返回博客列表
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
