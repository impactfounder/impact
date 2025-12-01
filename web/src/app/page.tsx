import { client } from '@/sanity/lib/client'
import { POSTS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'
import { PostList } from '@/components/features/PostList'

export const revalidate = 60

export default async function Home() {
    const posts = await client.fetch(POSTS_QUERY)
    const categories = await client.fetch(CATEGORIES_QUERY)

    return (
        <main className="flex flex-col gap-24 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            {/* Latest Posts with Category Filter */}
            <section className="flex flex-col gap-8">
                <PostList posts={posts} categories={categories} />
            </section>
        </main>
    )
}
