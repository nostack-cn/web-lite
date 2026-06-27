/**
 * 博客数据层 — 从 svr-admin 公开 API 拉取
 * 全客户端使用
 */

const SVR_ADMIN_URL = process.env.NEXT_PUBLIC_SVR_ADMIN_URL || ''

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

async function fetchPublic<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  if (!SVR_ADMIN_URL) {
    console.warn('[Blog] NEXT_PUBLIC_SVR_ADMIN_URL 未配置')
    return null
  }

  const url = new URL(path, SVR_ADMIN_URL)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  try {
    const res = await fetch(url.toString())
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
  return fetchPublic<BlogListResult>('/api/v1/public/blogs', {
    page: String(page),
    page_size: String(pageSize),
  })
}

/** 单篇详情（by slug） */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return fetchPublic<BlogPost>(`/api/v1/public/blogs/slug/${encodeURIComponent(slug)}`)
}
