import { client } from '@/sanity/lib/client'
import { LINKS_QUERY } from '@/sanity/lib/queries'
import { LinkCard } from '@/components/features/LinkCard'

export const revalidate = 60

export default async function MediaPage() {
    const links = await client.fetch(LINKS_QUERY)

    return (
        <main className="flex flex-col gap-12 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Media</h1>
                <p className="text-lg text-secondary">뉴스 기사 및 언론 보도</p>
            </header>

            {/* Links Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map((link: any) => (
                    <LinkCard key={link._id} link={link} />
                ))}
            </section>

            {/* Empty State */}
            {links.length === 0 && (
                <div className="text-center py-12 text-secondary">
                    아직 등록된 미디어가 없습니다.
                </div>
            )}
        </main>
    )
}
