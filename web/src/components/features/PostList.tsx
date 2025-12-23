"use client"

import { useState } from "react"
import { BlogCard } from "./BlogCard"

interface Category {
    slug: string
    title: string
}

interface Post {
    slug: string
    title: string
    publishedAt: string | null
    mainImage: string | null
    mainImageAlt: string | null
    categories: (string | null)[]
}

interface PostListProps {
    posts: Post[]
    categories?: Category[]
}

export function PostList({ posts, categories = [] }: PostListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const filteredPosts = selectedCategory === "all"
        ? posts
        : posts.filter(post =>
            post.categories?.some(cat => cat === selectedCategory)
        )

    return (
        <div className="flex flex-col gap-8">
            {/* 카테고리가 있을 때만 필터 렌더링 */}
            {categories.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 items-center scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`
                            px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border
                            ${selectedCategory === "all"
                                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"}
                        `}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`
                                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border
                                ${selectedCategory === cat.slug
                                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"}
                            `}
                        >
                            {cat.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))
                ) : (
                    <div className="col-span-full flex items-center justify-center text-gray-500 py-12">
                        글이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}
