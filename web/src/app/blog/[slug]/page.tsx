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

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await client.fetch(POST_QUERY, { slug });

    if (!post) {
        notFound();
    }

    return (
        <article className="py-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto w-full flex flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col gap-6 text-center items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-secondary uppercase tracking-wider">
                    {post.categories?.[0]?.title || 'Blog'} • {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
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
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500">
                {post.body ? <PortableText value={post.body} /> : <p className="text-gray-500 italic">No content...</p>}
            </div>
        </article>
    );
}
