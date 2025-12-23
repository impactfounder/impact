import { client } from "@/sanity/lib/client";
import { POSTS_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { PostList } from "@/components/features/PostList";

export const revalidate = 60;

export default async function BlogPage() {
    const posts = await client.fetch(POSTS_QUERY);
    const categories = await client.fetch(CATEGORIES_QUERY);

    return (
        <main className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Blog</h1>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Thoughts on technology, leadership, and building products that matter.
                    </p>
                </div>

                <PostList posts={posts} categories={categories} />
            </div>
        </main>
    );
}
