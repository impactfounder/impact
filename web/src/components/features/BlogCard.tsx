import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface BlogCardProps {
    post: {
        title: string
        slug: { current: string }
        mainImage?: any
        publishedAt: string
        categories?: { title: string }[]
    }
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug.current}`} className="group flex flex-col gap-4 p-4 rounded-lg border border-border bg-white hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-muted">
                {post.mainImage ? (
                    <Image
                        src={urlFor(post.mainImage).width(800).height(450).url()}
                        alt={post.mainImage.alt || post.title}
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
                    {post.categories?.[0]?.title || 'Blog'} • {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                </h3>
            </div>
        </Link>
    )
}
