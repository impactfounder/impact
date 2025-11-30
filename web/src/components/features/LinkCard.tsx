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
            className="group flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
        >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {link.image ? (
                    <Image
                        src={urlFor(link.image).width(200).height(200).url()}
                        alt={link.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 text-xs">
                        Link
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center gap-1">
                <h3 className="text-sm font-semibold text-primary group-hover:text-blue-600 transition-colors line-clamp-1">
                    {link.title}
                </h3>
                <p className="text-xs text-secondary line-clamp-2">
                    {link.description || link.url}
                </p>
                <span className="text-[10px] text-gray-400 mt-1">
                    {new Date(link.publishedAt).toLocaleDateString()}
                </span>
            </div>
        </a>
    )
}
