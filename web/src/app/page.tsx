import { client } from '@/sanity/lib/client'
import { LATEST_POSTS_QUERY, LATEST_LINKS_QUERY } from '@/sanity/lib/queries'
import { BlogCard } from '@/components/features/BlogCard'
import { LinkCard } from '@/components/features/LinkCard'

export const revalidate = 60

export default async function Home() {
    const posts = await client.fetch(LATEST_POSTS_QUERY)
    const links = await client.fetch(LATEST_LINKS_QUERY)

    return (
        <main className="flex flex-col gap-24 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="flex flex-col gap-6 py-12 md:py-24">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
                    Building Impact, <br className="hidden md:block" />
                    <span className="text-secondary font-normal">One Step at a Time.</span>
                </h1>
                <p className="text-lg md:text-xl text-secondary max-w-2xl leading-relaxed">
                    Exploring the intersection of technology, business, and social impact.
                    Sharing insights and curating knowledge for the next generation of founders.
                </p>
            </section>

            {/* Latest Posts */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-primary">최신 글</h2>
                    <a href="/blog" className="text-accent hover:underline">
                        전체 보기 →
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <BlogCard key={post._id} post={post} />
                    ))}
                </div>
            </section>

            {/* Curated Links */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-primary">인사이트 큐레이션</h2>
                    <a href="/insights" className="text-accent hover:underline">
                        전체 보기 →
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {links.map((link: any) => (
                        <LinkCard key={link._id} link={link} />
                    ))}
                </div>
            </section>
        </main>
    )
}
