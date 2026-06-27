'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'

const PAGE_SIZE = 9
const SVR_ADMIN_URL = process.env.NEXT_PUBLIC_SVR_ADMIN_URL || ''

const TAG_COLORS: Record<string, string> = {
  '安全实践': 'bg-red-50 text-red-600',
  '运维指南': 'bg-blue-50 text-blue-600',
  '产品更新': 'bg-brand-cyan/10 text-brand-cyan',
  '技术分享': 'bg-purple-50 text-purple-600',
}

function tagClass(tag: string) {
  return TAG_COLORS[tag] || 'bg-surface-100 text-ink-600'
}

function BlogCard({ post }: { post: BlogPost }) {
  const tags = (post.tags || '').split(',').filter(Boolean)
  const primaryTag = tags[0] || ''
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="blog-card group flex flex-col rounded-2xl border border-surface-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Cover */}
      {post.cover_image ? (
        <div className="h-44 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand-cyan/5 via-brand-indigo/5 to-brand-purple/5">
          <svg
            className="h-12 w-12 text-brand-cyan/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v4m2 6v6m0 0l-3-3m3 3l3-3" />
          </svg>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          {primaryTag ? (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${tagClass(primaryTag)}`}>
              {primaryTag}
            </span>
          ) : (
            <span />
          )}
          {post.view_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-ink-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.view_count}
            </span>
          )}
        </div>

        <h2 className="text-base font-bold text-ink-900 leading-snug group-hover:text-brand-cyan transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500 line-clamp-3">
            {post.summary}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-indigo/20 text-xs font-semibold text-brand-cyan">
              {(post.author_name || 'A').charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-ink-500">{post.author_name || '匿名'}</span>
          </div>
          <span className="text-xs text-ink-400">{dateStr}</span>
        </div>
      </div>
    </Link>
  )
}

interface Props {
  initialPosts: BlogPost[]
  initialTotal: number
  initialPage: number
}

export default function BlogList({ initialPosts, initialTotal, initialPage }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [total] = useState(initialTotal)
  const [loading, setLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const loadPage = async (page: number) => {
    if (page === currentPage || loading) return
    setLoading(true)
    try {
      const res = await fetch(`${SVR_ADMIN_URL}/api/v1/public/blogs?page=${page}&page_size=${PAGE_SIZE}`)
      const json = await res.json()
      if (json.code === 0 && json.data?.list) {
        setPosts(json.data.list)
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (e) {
      console.error('加载分页失败', e)
    } finally {
      setLoading(false)
    }
  }

  // 构建分页数组（含省略号）
  const buildPages = (): (number | '...')[] => {
    const visible = new Set<number>()
    for (let i = 1; i <= Math.min(2, totalPages); i++) visible.add(i)
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) visible.add(i)
    for (let i = Math.max(1, totalPages - 1); i <= totalPages; i++) visible.add(i)

    const sorted = Array.from(visible).sort((a, b) => a - b)
    const result: (number | '...')[] = []
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
      result.push(sorted[i])
    }
    return result
  }

  return (
    <div>
      {/* 加载遮罩 */}
      {loading && (
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-ink-500">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
          加载中…
        </div>
      )}

      {/* 卡片网格 */}
      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <svg className="mx-auto h-16 w-16 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-ink-500">暂无文章，敬请期待。</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {/* Prev */}
          <button
            onClick={() => loadPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="上一页"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {buildPages().map((p, i) =>
            p === '...' ? (
              <span key={`gap-${i}`} className="px-2 text-sm text-ink-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => loadPage(p)}
                disabled={p === currentPage || loading}
                className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-brand-cyan text-white shadow-sm'
                    : 'text-ink-600 hover:bg-surface-100'
                } disabled:cursor-not-allowed`}
              >
                {p}
              </button>
            ),
          )}

          {/* Next */}
          <button
            onClick={() => loadPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="下一页"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
