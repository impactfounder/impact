"use client"

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'

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
    const [ogImage, setOgImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(!link.image)

    // Sanity 이미지가 있으면 그걸 우선 사용
    const sanityImage = link.image ? urlFor(link.image).width(800).height(450).url() : null
    const displayImage = sanityImage || ogImage

    useEffect(() => {
        // 이미지가 없고 URL이 있을 때만 스크래핑 시도
        if (!sanityImage && link.url) {
            setLoading(true)
            fetch(`/api/og?url=${encodeURIComponent(link.url)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.image) {
                        setOgImage(data.image)
                    }
                })
                .catch(err => console.error('Failed to load OG image', err))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [sanityImage, link.url])

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-4 rounded-lg border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 h-full"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-gray-100">
                {displayImage ? (
                    <Image
                        src={displayImage}
                        alt={link.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={!sanityImage} // 외부 이미지는 최적화 제외 (도메인 설정 회피)
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50 text-sm">
                        {loading ? 'Loading...' : 'No Image'}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {new Date(link.publishedAt).toLocaleDateString()}
                </span>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {link.title}
                </h3>
                {link.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {link.description}
                    </p>
                )}
            </div>
        </a>
    )
}
