import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { NAVIGATION_QUERY } from '@/sanity/lib/queries'

export async function Header() {
    const navData = await client.fetch(NAVIGATION_QUERY)
    const menuItems = navData?.items || [
        { label: 'About', link: '/about' },
        { label: 'Blog', link: '/blog' },
        { label: 'Media', link: '/media' },
    ]

    return (
        <header className="w-full py-4 px-6 md:px-12 lg:px-24 flex justify-between items-center bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">

            {/* 로고: md 크기 기준으로 텍스트 분리 및 제어 */}
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
                
                {/* 1. 모바일 (기본값) 및 md 사이즈 미만에서만 보이는 텍스트 */}
                <span className="md:hidden">
                    IMPACT FOUNDER
                </span>

                {/* 2. 데스크톱 (md 사이즈 이상)에서만 보이는 텍스트 */}
                <span className="hidden md:inline">
                    IMPACT FOUNDER&nbsp;&nbsp;|&nbsp;&nbsp;Jung Jaewook 
                </span>
                
            </Link>

            {/* PC 메뉴 */}
            <nav className="hidden md:flex gap-8">
                {menuItems.map((item: any, idx: number) => (
                    <Link 
                        key={idx} 
                        href={item.link} 
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

        </header>
    )
}
