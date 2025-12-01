import { client } from "@/sanity/lib/client";
import { LINKS_QUERY } from "@/sanity/lib/queries";
import { LinkCard } from "@/components/features/LinkCard";

export const revalidate = 60;

export default async function InsightsPage() {
    const links = await client.fetch(LINKS_QUERY);

    return (
        <main className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Insights</h1>
                    <p className="text-lg text-secondary max-w-2xl">
                        A curated collection of articles, news, and resources that inspire.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.length > 0 ? (
                        links.map((link: any) => (
                            <LinkCard key={link._id} link={link} />
                        ))
                    ) : (
                        <p className="text-secondary col-span-full py-12 text-center bg-gray-50 rounded-lg">
                            No curated links yet.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
