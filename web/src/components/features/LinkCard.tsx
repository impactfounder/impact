import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface LinkCardProps {
    link: {
        url: string
        title: string
        description?: string
        image?: any
        publishedAt: string
    }
}

export function LinkCard({ link }: LinkCardProps) {
    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-4 rounded-lg border border-border bg-white hover:shadow-lg transition-all duration-300"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-muted">
                {link.image ? (
                    <Image
                        src={urlFor(link.image).width(800).height(450).url()}
                        alt={link.title}
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
                <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                    {new Date(link.publishedAt).toLocaleDateString()}
                </span>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {link.title}
                </h3>
                {link.description && (
                    <p className="text-sm text-secondary line-clamp-2">
                        {link.description}
                    </p>
                )}
            </div>
        </a>
    )
}
