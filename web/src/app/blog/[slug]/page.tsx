import { client } from "@/sanity/lib/client";
import { POST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Portable Text components for proper styling
const portableTextComponents = {
    block: {
        h1: ({ children }: any) => (
            <h1 className="text-3xl md:text-4xl font-bold mt-16 mb-6 text-gray-900 leading-tight">{children}</h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-14 mb-5 text-gray-900 leading-tight">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-gray-900 leading-tight">{children}</h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-lg md:text-xl font-bold mt-8 mb-3 text-gray-900 leading-tight">{children}</h4>
        ),
        normal: ({ children }: any) => (
            <p className="mb-7 leading-8 text-lg text-gray-800 whitespace-pre-wrap break-keep">{children}</p>
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

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await client.fetch(POST_QUERY, { slug });

    if (!post) {
        notFound();
    }

    return (
        <article className="py-20 px-6 max-w-3xl mx-auto w-full flex flex-col gap-10">
            {/* Header */}
            <header className="flex flex-col gap-6 items-start text-left">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {post.categories?.[0]?.title || 'Blog'} • {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                    {post.title}
                </h1>
                {post.author && (
                    <div className="flex items-center gap-3 mt-2">
                        {post.author.image && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                <Image
                                    src={urlFor(post.author.image).width(100).height(100).url()}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="text-left">
                            <p className="text-sm font-semibold text-primary">{post.author.name}</p>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Image */}
            {post.mainImage && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100 my-4">
                    <Image
                        src={urlFor(post.mainImage).width(1200).height(675).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col max-w-none">
                {post.body ? <PortableText value={post.body} components={portableTextComponents} /> : <p className="text-gray-500 italic">No content...</p>}
            </div>
        </article>
    );
}
