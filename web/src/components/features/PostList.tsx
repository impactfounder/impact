"use client"

import { useState } from "react"
import { BlogCard } from "./BlogCard"

// (Category, Post, PostListProps 인터페이스는 생략)

interface Category {
    _id: string
    title: string
    slug: {
        current: string
    }
}

interface Post {
    _id: string
    title: string
    slug: {
        current: string
    }
    publishedAt: string
    mainImage: any
    categories: {
        title: string
    }[]
}

interface PostListProps {
    posts: Post[]
    categories: Category[]
}

export function PostList({ posts, categories }: PostListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const filteredPosts = selectedCategory === "all"
        ? posts
        : posts.filter(post =>
            post.categories?.some(cat => cat.title === selectedCategory)
        )

    // !!! 이 부분에 return 키워드를 추가합니다. !!!
    return (
        <div className="flex flex-col gap-8">
            {/* 카테고리 필터 */}
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
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat.title)}
                        className={`
                            px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border
                            ${selectedCategory === cat.title 
                                ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"}
                        `}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <BlogCard key={post._id} post={post} />
                    ))
                ) : (
                    <div className="col-span-full flex items-center justify-center text-gray-500 py-12">
                        해당 카테고리에 글이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}