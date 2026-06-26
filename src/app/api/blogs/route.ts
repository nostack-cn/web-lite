import { type NextRequest, NextResponse } from 'next/server'
import { getBlogList, PAGE_SIZE } from '@/lib/blog'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const pageSize = Math.min(50, Number(searchParams.get('page_size') ?? String(PAGE_SIZE)))

  const result = await getBlogList(page, pageSize)
  if (!result) {
    return NextResponse.json({ code: 1, message: '获取失败', data: null }, { status: 502 })
  }
  return NextResponse.json({ code: 0, message: 'ok', data: result })
}
