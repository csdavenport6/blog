import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export default function Home() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">My Personal Blog</h1>
          <p className="mt-2 text-gray-600">Web development, WebAssembly, and more</p>
          <nav className="mt-4">
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
              <li><Link href="/wasm" className="text-blue-600 hover:text-blue-800">WebAssembly</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Latest Posts</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-100 pb-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <time className="text-sm text-gray-500">{post.date}</time>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
