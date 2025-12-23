import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

// Sanity Client
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-11-30',
  useCdn: false,
})

// Helper to build Sanity image URL manually
function getSanityImageUrl(imageRef: any): string | null {
  if (!imageRef || !imageRef.asset || !imageRef.asset._ref) return null

  // Parse the asset reference: image-{id}-{dimensions}-{format}
  const ref = imageRef.asset._ref
  const [, id, dimensions, format] = ref.split('-')

  if (!id || !dimensions || !format) return null

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}

// Helper to create slug from string
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper to download image
async function downloadImage(
  imageRef: any,
  destDir: string,
  filename: string
): Promise<string | null> {
  if (!imageRef || !imageRef.asset) return null

  try {
    const imageUrl = getSanityImageUrl(imageRef)
    if (!imageUrl) {
      console.error(`  Could not generate image URL`)
      return null
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.error(`  Failed to fetch image: ${imageUrl}`)
      return null
    }

    const buffer = await response.arrayBuffer()

    // Extract extension from URL
    const urlPath = new URL(imageUrl).pathname
    const ext = path.extname(urlPath) || '.jpg'
    const finalFilename = `${filename}${ext}`
    const destPath = path.join(destDir, finalFilename)

    // Ensure directory exists
    fs.mkdirSync(destDir, { recursive: true })

    fs.writeFileSync(destPath, Buffer.from(buffer))
    console.log(`  Downloaded: ${finalFilename}`)

    return finalFilename
  } catch (error) {
    console.error(`  Error downloading image:`, error)
    return null
  }
}

// Convert Sanity Portable Text to Markdown
function portableTextToMarkdown(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (block._type !== 'block') {
        // Handle other block types (images, etc.)
        if (block._type === 'image') {
          const url = getSanityImageUrl(block)
          return url ? `![](${url})\n` : ''
        }
        return ''
      }

      const style = block.style || 'normal'
      let text = ''

      if (block.children) {
        text = block.children
          .map((child: any) => {
            let content = child.text || ''

            // Apply marks (bold, italic, etc.)
            if (child.marks && child.marks.length > 0) {
              // Get mark definitions for links
              const markDefs = block.markDefs || []

              child.marks.forEach((mark: string) => {
                if (mark === 'strong') {
                  content = `**${content}**`
                } else if (mark === 'em') {
                  content = `*${content}*`
                } else if (mark === 'code') {
                  content = `\`${content}\``
                } else if (mark === 'underline') {
                  content = `<u>${content}</u>`
                } else if (mark === 'strike-through') {
                  content = `~~${content}~~`
                } else {
                  // Check if it's a link
                  const linkDef = markDefs.find((def: any) => def._key === mark)
                  if (linkDef && linkDef._type === 'link') {
                    content = `[${content}](${linkDef.href})`
                  }
                }
              })
            }

            return content
          })
          .join('')
      }

      // Handle lists
      if (block.listItem) {
        const indent = '  '.repeat((block.level || 1) - 1)
        if (block.listItem === 'bullet') {
          return `${indent}- ${text}`
        } else if (block.listItem === 'number') {
          return `${indent}1. ${text}`
        }
      }

      // Apply block styles
      switch (style) {
        case 'h1':
          return `# ${text}\n`
        case 'h2':
          return `## ${text}\n`
        case 'h3':
          return `### ${text}\n`
        case 'h4':
          return `#### ${text}\n`
        case 'h5':
          return `##### ${text}\n`
        case 'h6':
          return `###### ${text}\n`
        case 'blockquote':
          return `> ${text}\n`
        case 'normal':
        default:
          return text ? `${text}\n` : ''
      }
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
}

// Ensure directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Paths
const basePath = process.cwd()
const contentPath = path.join(basePath, 'src', 'content')
const publicImagesPath = path.join(basePath, 'public', 'images')

// Store mappings for references
const authorMap: Record<string, string> = {}
const categoryMap: Record<string, string> = {}

async function migrateAuthors() {
  console.log('\n📝 Migrating Authors...')
  const authors = await client.fetch(`*[_type == "author"] {
    _id,
    name,
    slug,
    image,
    bio
  }`)

  const authorsPath = path.join(contentPath, 'authors')
  const authorsImagesPath = path.join(publicImagesPath, 'authors')
  ensureDir(authorsPath)
  ensureDir(authorsImagesPath)

  for (const author of authors) {
    const slug = author.slug?.current || slugify(author.name || 'unknown')
    authorMap[author._id] = slug

    // Download image
    let imagePath = null
    if (author.image) {
      imagePath = await downloadImage(author.image, authorsImagesPath, slug)
    }

    // Convert bio (if it's Portable Text)
    const bio =
      typeof author.bio === 'string'
        ? author.bio
        : portableTextToMarkdown(author.bio || []).trim()

    const authorData = {
      name: author.name || '',
      image: imagePath ? `/images/authors/${imagePath}` : null,
      bio: bio,
    }

    const authorDir = path.join(authorsPath, slug)
    ensureDir(authorDir)
    fs.writeFileSync(
      path.join(authorDir, 'index.json'),
      JSON.stringify(authorData, null, 2)
    )
    console.log(`  Created author: ${slug}`)
  }
}

async function migrateCategories() {
  console.log('\n📁 Migrating Categories...')
  const categories = await client.fetch(`*[_type == "category"] {
    _id,
    title,
    slug,
    description
  }`)

  const categoriesPath = path.join(contentPath, 'categories')
  ensureDir(categoriesPath)

  for (const category of categories) {
    const slug = category.slug?.current || slugify(category.title || 'unknown')
    categoryMap[category._id] = slug

    const categoryData = {
      title: category.title || '',
      description: category.description || '',
    }

    const categoryDir = path.join(categoriesPath, slug)
    ensureDir(categoryDir)
    fs.writeFileSync(
      path.join(categoryDir, 'index.json'),
      JSON.stringify(categoryData, null, 2)
    )
    console.log(`  Created category: ${slug}`)
  }
}

async function migrateLinks() {
  console.log('\n🔗 Migrating Curated Links...')
  const links = await client.fetch(`*[_type == "link"] {
    _id,
    url,
    title,
    description,
    image,
    publishedAt
  }`)

  const linksPath = path.join(contentPath, 'links')
  const linksImagesPath = path.join(publicImagesPath, 'links')
  ensureDir(linksPath)
  ensureDir(linksImagesPath)

  for (const link of links) {
    const slug = slugify(link.title || link._id)
    if (!slug) {
      console.log(`  Skipping link with empty slug`)
      continue
    }

    // Download image
    let imagePath = null
    if (link.image) {
      imagePath = await downloadImage(link.image, linksImagesPath, slug)
    }

    const linkData = {
      title: link.title || '',
      url: link.url || '',
      description: link.description || '',
      image: imagePath ? `/images/links/${imagePath}` : null,
      publishedAt: link.publishedAt || null,
    }

    const linkDir = path.join(linksPath, slug)
    ensureDir(linkDir)
    fs.writeFileSync(
      path.join(linkDir, 'index.json'),
      JSON.stringify(linkData, null, 2)
    )
    console.log(`  Created link: ${slug}`)
  }
}

async function migratePosts() {
  console.log('\n📄 Migrating Posts...')
  const posts = await client.fetch(`*[_type == "post"] {
    _id,
    title,
    slug,
    author->{_id},
    mainImage,
    categories[]->{_id},
    publishedAt,
    body
  }`)

  const postsPath = path.join(contentPath, 'posts')
  const postsImagesPath = path.join(publicImagesPath, 'posts')
  ensureDir(postsPath)
  ensureDir(postsImagesPath)

  for (const post of posts) {
    const slug = post.slug?.current || slugify(post.title || post._id)
    if (!slug) {
      console.log(`  Skipping post with empty slug`)
      continue
    }

    console.log(`  Processing: ${post.title}`)

    // Download main image
    let mainImagePath = null
    let mainImageAlt = ''
    if (post.mainImage) {
      mainImagePath = await downloadImage(post.mainImage, postsImagesPath, slug)
      mainImageAlt = post.mainImage.alt || ''
    }

    // Convert body (Portable Text to Markdown)
    const bodyContent = portableTextToMarkdown(post.body || [])

    // Map author and categories
    const authorSlug = post.author?._id ? authorMap[post.author._id] : null
    const categoryIds = (post.categories || [])
      .map((cat: any) => (cat?._id ? categoryMap[cat._id] : null))
      .filter(Boolean)

    // Build frontmatter
    // Note: Keystatic expects specific YAML format
    const frontmatter: Record<string, any> = {
      title: post.title || '',
    }

    if (authorSlug) {
      frontmatter.author = authorSlug
    }

    if (mainImagePath) {
      frontmatter.mainImage = `/images/posts/${mainImagePath}`
    }

    if (mainImageAlt) {
      frontmatter.mainImageAlt = mainImageAlt
    }

    if (categoryIds.length > 0) {
      frontmatter.categories = categoryIds
    }

    if (post.publishedAt) {
      frontmatter.publishedAt = post.publishedAt
    }

    // Create .mdoc file with YAML frontmatter
    const yamlLines = Object.entries(frontmatter).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - ${v}`).join('\n')}`
      } else if (typeof value === 'string') {
        // Escape quotes in strings
        const escaped = value.replace(/"/g, '\\"')
        return `${key}: "${escaped}"`
      } else if (value === null) {
        return `${key}: null`
      } else {
        return `${key}: ${value}`
      }
    })

    const mdocContent = `---
${yamlLines.join('\n')}
---

${bodyContent}`

    const postDir = path.join(postsPath, slug)
    ensureDir(postDir)
    fs.writeFileSync(path.join(postDir, 'index.mdoc'), mdocContent)
    console.log(`  Created post: ${slug}`)
  }
}

async function migrateNavigation() {
  console.log('\n🧭 Migrating Navigation...')
  const navigation = await client.fetch(`*[_type == "navigation"][0] {
    title,
    items[] {
      label,
      link
    }
  }`)

  if (!navigation) {
    console.log('  No navigation found')
    return
  }

  const navigationPath = path.join(contentPath, 'navigation')
  ensureDir(navigationPath)

  const navData = {
    title: navigation.title || 'Main Menu',
    items: (navigation.items || []).map((item: any) => ({
      label: item.label || '',
      link: item.link || '',
    })),
  }

  fs.writeFileSync(
    path.join(navigationPath, 'index.json'),
    JSON.stringify(navData, null, 2)
  )
  console.log('  Created navigation')
}

async function main() {
  console.log('🚀 Starting Sanity to Keystatic Migration...\n')
  console.log(`Project ID: ${projectId}`)
  console.log(`Dataset: ${dataset}`)

  if (!projectId || !dataset) {
    console.error(
      '❌ Missing environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET'
    )
    process.exit(1)
  }

  try {
    // Ensure base directories exist
    ensureDir(contentPath)
    ensureDir(publicImagesPath)

    // Migrate in order (authors and categories first for references)
    await migrateAuthors()
    await migrateCategories()
    await migrateLinks()
    await migratePosts()
    await migrateNavigation()

    console.log('\n✅ Migration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Run `npm run dev` to start the development server')
    console.log('2. Visit http://localhost:3000/keystatic to manage content')
    console.log('3. Review migrated content in src/content/')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
