import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-800 mb-3 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-gray-700 mb-2 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
    ),
    ...components,
  }
}