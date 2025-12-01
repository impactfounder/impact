"use client"

import { useState } from "react"
import { BlogCard } from "./BlogCard"

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

    return (
        <div className="flex flex-col gap-8">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === "all"
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category._id}
                        onClick={() => setSelectedCategory(category.title)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === category.title
                            ? "bg-gray-800 text-white shadow-sm"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        {category.title}
                    </button>
                ))}
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <BlogCard key={post._id} post={post} />
                    ))
                ) : (
                    <div className="col-span-full flex items-center justify-center text-secondary">
                        해당 카테고리에 글이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}
