import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
          <time className="text-gray-500 mt-2 block">{post.date}</time>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="blog-content max-w-none">
          <MDXRemote source={post.content} />
        </article>
      </main>
    </div>
  )
}