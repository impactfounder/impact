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
        // **********************
        // 카테고리 필터링 UI가 누락되어 있습니다.
        // PostList 컴포넌트 내부에는 보통 카테고리 버튼을 나열하는 UI도 포함되어야 합니다.
        // 현재는 포스팅 그리드만 반환합니다.

        <div className="flex flex-col gap-8">
            {/* 임시 카테고리 버튼 추가 (선택 사항이지만 필수) */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedCategory === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                    전체
                </button>
                {categories.map(cat => (
                    <button
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat.title)}
                        className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedCategory === cat.title ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
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