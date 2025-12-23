import Link from 'next/link'
import Image from 'next/image'

interface BlogCardProps {
    post: {
        title: string
        slug: string
        mainImage?: string | null
        mainImageAlt?: string | null
        publishedAt?: string | null
        categories?: (string | null)[]
    }
}

export function BlogCard({ post }: BlogCardProps) {
    const categoryLabel = post.categories?.[0] || 'Blog'
    const dateStr = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString()
        : ''

    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4 p-4 rounded-lg border border-border bg-white hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-muted">
                {post.mainImage ? (
                    <Image
                        src={post.mainImage}
                        alt={post.mainImageAlt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-secondary">
                        No Image
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-secondary uppercase tracking-wider">
                    {categoryLabel} {dateStr && `• ${dateStr}`}
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                </h3>
            </div>
        </Link>
    )
}
