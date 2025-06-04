import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDirectory = path.join(process.cwd(), 'src/content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export function getAllBlogPosts(): BlogPost[] {
  const filenames = fs.readdirSync(blogDirectory)
  const posts = filenames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const fullPath = path.join(blogDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug: name.replace(/\.mdx$/, ''),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content,
    }
  } catch {
    return null
  }
}