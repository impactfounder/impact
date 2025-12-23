import { getPost } from '@/lib/keystatic/reader'
import Image from 'next/image'
import { PostBody } from '@/components/features/PostBody'

export const revalidate = 60

export default async function AboutPage() {
    const page = await getPost('about')

    if (!page) {
        return (
            <div className="py-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">About</h1>
                <p className="text-lg text-secondary">페이지를 불러올 수 없습니다.</p>
            </div>
        )
    }

    return (
        <article className="py-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto w-full flex flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col gap-6 items-center">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
                    {page.title}
                </h1>
            </header>

            {/* Main Image */}
            {page.mainImage && (
                <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden">
                    <Image
                        src={page.mainImage}
                        alt={page.mainImageAlt || page.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col max-w-none">
                <PostBody slug="about" />
            </div>
        </article>
    )
}
