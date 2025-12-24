import { getPost, getAuthor, getCategoryTitle, reader } from "@/lib/keystatic/reader"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PostBody } from "@/components/features/PostBody"

// Static generation - rebuild on deploy only
export const dynamic = 'force-static'

// Generate static params for all posts at build time
export async function generateStaticParams() {
    const slugs = await reader.collections.posts.list()
    return slugs
        .filter(slug => slug !== 'about')
        .map((slug) => ({ slug }))
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    // Get author details if available
    const author = post.author ? await getAuthor(post.author) : null

    // Get category titles
    const categoryTitles = await Promise.all(
        (post.categories || [])
            .filter((c): c is string => c !== null)
            .map(slug => getCategoryTitle(slug))
    )

    return (
        <article className="py-20 px-6 max-w-3xl mx-auto w-full flex flex-col gap-10">
            {/* Header */}
            <header className="flex flex-col gap-6 items-start text-left">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {categoryTitles[0] || 'Blog'} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                    {post.title}
                </h1>
                {author && (
                    <div className="flex items-center gap-3 mt-2">
                        {author.image && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                <Image
                                    src={author.image}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="text-left">
                            <p className="text-sm font-semibold text-primary">{author.name}</p>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Image */}
            {post.mainImage && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100 my-4">
                    <Image
                        src={post.mainImage}
                        alt={post.mainImageAlt || post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col max-w-none">
                <PostBody slug={slug} />
            </div>
        </article>
    )
}
