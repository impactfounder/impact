import { client } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "post" && slug.current == "about"][0] {
  _id,
  title,
  body,
  mainImage
}`)

export const revalidate = 60

// Portable Text components for proper styling
const portableTextComponents = {
    block: {
        h1: ({ children }: any) => (
            <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-primary">{children}</h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-primary">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-primary">{children}</h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-lg md:text-xl font-semibold mt-6 mb-2 text-primary">{children}</h4>
        ),
        normal: ({ children }: any) => (
            <p className="mb-5 leading-relaxed text-foreground whitespace-pre-wrap">{children}</p>
        ),
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-bold text-primary">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
        link: ({ value, children }: any) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
            >
                {children}
            </a>
        ),
    },
    list: {
        bullet: ({ children }: any) => (
            <ul className="list-disc list-inside mb-5 space-y-1 text-foreground">{children}</ul>
        ),
        number: ({ children }: any) => (
            <ol className="list-decimal list-inside mb-5 space-y-1 text-foreground">{children}</ol>
        ),
    },
    listItem: {
        bullet: ({ children }: any) => (
            <li className="mb-1">{children}</li>
        ),
        number: ({ children }: any) => (
            <li className="mb-1">{children}</li>
        ),
    },
}

export default async function AboutPage() {
    const page = await client.fetch(ABOUT_PAGE_QUERY)

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
                        src={urlFor(page.mainImage).width(1200).height(675).url()}
                        alt={page.mainImage.alt || page.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            {page.body && (
                <div className="flex flex-col max-w-none">
                    <PortableText value={page.body} components={portableTextComponents} />
                </div>
            )}
        </article>
    )
}
