/**
 * 博客数据层 — 从 svr-admin 内部 API 拉取
 * Server Components / Route Handlers 使用（不暴露到客户端）
 */

const SVR_ADMIN_URL = process.env.SVR_ADMIN_URL || 'http://localhost:8080'
const INTERNAL_KEY = process.env.BLOG_INTERNAL_KEY || ''

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  cover_image: string
  tags: string
  status: string
  author_id: number
  author_name: string
  published_at: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface BlogListResult {
  list: BlogPost[]
  total: number
  page: number
  page_size: number
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

async function fetchInternal<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = 3600,
): Promise<T | null> {
  if (!INTERNAL_KEY) {
    console.warn('[Blog] BLOG_INTERNAL_KEY 未配置，跳过远程获取')
    return null
  }

  const url = new URL(path, SVR_ADMIN_URL)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { 'X-Internal-Key': INTERNAL_KEY },
      next: { revalidate },
    })
    if (!res.ok) {
      console.warn(`[Blog] API 返回 ${res.status}: ${path}`)
      return null
    }
    const json: ApiResponse<T> = await res.json()
    if (json.code !== 0) {
      console.warn(`[Blog] API 错误: ${json.message}`)
      return null
    }
    return json.data
  } catch (e) {
    console.warn(`[Blog] 请求失败: ${path}`, e)
    return null
  }
}

export const PAGE_SIZE = 9

/** 分页列表（仅 published） */
export async function getBlogList(page = 1, pageSize = PAGE_SIZE): Promise<BlogListResult | null> {
  return fetchInternal<BlogListResult>('/internal/blogs', {
    status: 'published',
    page: String(page),
    page_size: String(pageSize),
  })
}

/** 单篇详情（by slug） */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return fetchInternal<BlogPost>(`/internal/blogs/slug/${encodeURIComponent(slug)}`)
}

/** 获取所有已发布 slug（用于 generateStaticParams，可选） */
export async function getAllPublishedSlugs(limit = 200): Promise<string[]> {
  const result = await fetchInternal<BlogListResult>('/internal/blogs', {
    status: 'published',
    page: '1',
    page_size: String(limit),
  })
  return result?.list.map((b) => b.slug) ?? []
}

/** 所有标签 */
export async function getAllTags(): Promise<string[]> {
  const result = await fetchInternal<string[]>('/internal/blogs/tags')
  return result ?? []
}
