"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface BlueprintViewerProps {
  markdown: string
}

export default function BlueprintViewer({ markdown }: BlueprintViewerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-[600px] rounded-md"></div>
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 overflow-auto max-h-[600px] shadow-inner">
      <div className="prose dark:prose-invert prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold mt-6 mb-4 pb-2 border-b bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-bold mt-5 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-600 dark:text-purple-400" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-lg font-semibold mt-3 mb-2 text-blue-600 dark:text-blue-400" {...props} />
            ),
            p: ({ node, ...props }) => <p className="my-3" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
            li: ({ node, ...props }) => <li className="my-1" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-purple-300 dark:border-purple-700 pl-4 italic my-4" {...props} />
            ),
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <div className="bg-slate-800 rounded-md p-4 my-4 overflow-x-auto">
                  <pre className="text-slate-100 text-sm">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              ) : (
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              )
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => <thead className="bg-slate-50 dark:bg-slate-800" {...props} />,
            th: ({ node, ...props }) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                {...props}
              />
            ),
            td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />,
            hr: ({ node, ...props }) => <hr className="my-6 border-slate-200 dark:border-slate-800" {...props} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}
