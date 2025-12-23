import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../keystatic.config'

export const reader = createReader(process.cwd(), keystaticConfig)

// Types
export interface PostMeta {
  slug: string
  title: string
  author: string | null
  mainImage: string | null
  mainImageAlt: string | null
  categories: (string | null)[]
  publishedAt: string | null
}

// For backwards compatibility
export type Post = PostMeta

export interface Category {
  slug: string
  title: string
  description: string | null
}

export interface Link {
  slug: string
  title: string
  url: string
  description: string | null
  image: string | null
  publishedAt: string | null
}

export interface Author {
  slug: string
  name: string
  image: string | null
  bio: string | null
}

export interface NavigationItem {
  label: string
  link: string
}

export interface Navigation {
  title: string
  items: NavigationItem[]
}

// Helper to get all posts (excluding about) - returns metadata only, no body
export async function getPosts(): Promise<PostMeta[]> {
  const slugs = await reader.collections.posts.list()
  const posts = await Promise.all(
    slugs
      .filter(slug => slug !== 'about')
      .map(async (slug) => {
        const post = await reader.collections.posts.read(slug)
        if (!post) return null

        return {
          slug,
          title: post.title || '',
          author: post.author,
          mainImage: post.mainImage,
          mainImageAlt: post.mainImageAlt,
          categories: post.categories || [],
          publishedAt: post.publishedAt,
        }
      })
  )

  return posts
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => {
      if (!a.publishedAt || !b.publishedAt) return 0
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

// Helper to get latest N posts
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  const posts = await getPosts()
  return posts.slice(0, limit)
}

// Helper to get a single post metadata by slug (no body)
export async function getPost(slug: string): Promise<PostMeta | null> {
  const post = await reader.collections.posts.read(slug)
  if (!post) return null

  return {
    slug,
    title: post.title || '',
    author: post.author,
    mainImage: post.mainImage,
    mainImageAlt: post.mainImageAlt,
    categories: post.categories || [],
    publishedAt: post.publishedAt,
  }
}

// Helper to get post body content - to be used only in Server Components
export async function getPostBody(slug: string): Promise<{ node: any } | null> {
  const post = await reader.collections.posts.read(slug)
  if (!post) return null

  // Resolve body content (Keystatic returns a function for document fields)
  const bodyContent = typeof post.body === 'function' ? await post.body() : post.body
  return bodyContent
}

// Helper to get all categories
export async function getCategories(): Promise<Category[]> {
  const slugs = await reader.collections.categories.list()
  const categories = await Promise.all(
    slugs.map(async (slug) => {
      const category = await reader.collections.categories.read(slug)
      if (!category) return null
      return {
        slug,
        title: category.title || '',
        description: category.description,
      }
    })
  )

  return categories
    .filter((cat): cat is Category => cat !== null)
    .sort((a, b) => a.title.localeCompare(b.title))
}

// Helper to get category title by slug
export async function getCategoryTitle(slug: string): Promise<string> {
  const category = await reader.collections.categories.read(slug)
  return category?.title || slug
}

// Helper to get all links
export async function getLinks(): Promise<Link[]> {
  const slugs = await reader.collections.links.list()
  const links = await Promise.all(
    slugs.map(async (slug) => {
      const link = await reader.collections.links.read(slug)
      if (!link) return null
      return {
        slug,
        title: link.title || '',
        url: link.url || '',
        description: link.description,
        image: link.image,
        publishedAt: link.publishedAt,
      }
    })
  )

  return links
    .filter((link): link is Link => link !== null)
    .sort((a, b) => {
      if (!a.publishedAt || !b.publishedAt) return 0
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

// Helper to get latest N links
export async function getLatestLinks(limit: number = 6): Promise<Link[]> {
  const links = await getLinks()
  return links.slice(0, limit)
}

// Helper to get an author by slug
export async function getAuthor(slug: string): Promise<Author | null> {
  const author = await reader.collections.authors.read(slug)
  if (!author) return null

  return {
    slug,
    name: author.name || '',
    image: author.image,
    bio: author.bio,
  }
}

// Helper to get navigation
export async function getNavigation(): Promise<Navigation> {
  const nav = await reader.singletons.navigation.read()

  if (!nav) {
    return {
      title: 'Main Menu',
      items: [
        { label: 'About', link: '/about' },
        { label: 'Blog', link: '/blog' },
        { label: 'Media', link: '/media' },
      ],
    }
  }

  return {
    title: nav.title || 'Main Menu',
    items: (nav.items || []).map(item => ({
      label: item.label || '',
      link: item.link || '',
    })),
  }
}
