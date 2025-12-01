import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { BlogCard } from "@/components/features/BlogCard";

export const revalidate = 60;

export default async function BlogPage() {
    const posts = await client.fetch(POSTS_QUERY);

    return (
        <main className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Blog</h1>
                    <p className="text-lg text-secondary max-w-2xl">
                        Thoughts on technology, leadership, and building products that matter.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {posts.length > 0 ? (
                        posts.map((post: any) => (
                            <BlogCard key={post._id} post={post} />
                        ))
                    ) : (
                        <p className="text-secondary col-span-full py-12 text-center bg-gray-50 rounded-lg">
                            No posts found.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
