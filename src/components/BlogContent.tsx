'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function BlogContent({ content }: Props) {
  return (
    <div className="prose prose-lg max-w-none
      prose-headings:font-bold prose-headings:text-ink-900
      prose-p:text-ink-600 prose-p:leading-relaxed
      prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:underline
      prose-strong:text-ink-800
      prose-blockquote:border-l-brand-cyan prose-blockquote:text-ink-500
      prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:rounded-xl
      prose-img:rounded-xl prose-img:my-6
      prose-th:bg-surface-100 prose-th:text-ink-700
      prose-hr:border-surface-200
      prose-li:text-ink-600
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
