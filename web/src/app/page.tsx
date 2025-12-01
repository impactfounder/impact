import { client } from '@/sanity/lib/client'
import { POSTS_QUERY, CATEGORIES_QUERY, LATEST_LINKS_QUERY } from '@/sanity/lib/queries'
import { PostList } from '@/components/features/PostList'
import { LinkCard } from '@/components/features/LinkCard'
import Link from 'next/link'

export const revalidate = 60

export default async function Home() {
    const posts = await client.fetch(POSTS_QUERY)
    const categories = await client.fetch(CATEGORIES_QUERY)
    const links = await client.fetch(LATEST_LINKS_QUERY)

    return (
        <main className="flex flex-col gap-24 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            {/* Latest Posts with Category Filter */}
            <section className="flex flex-col gap-8">
                <PostList posts={posts} categories={categories} />
            </section>

            {/* Media Section */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-foreground">MEDIA</h2>
                    <Link href="/media" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
                        전체 보기 →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((link: any) => (
                        <LinkCard key={link._id} link={link} />
                    ))}
                </div>
            </section>
        </main>
    )
}
