export function Footer() {
    return (
        <footer className="w-full py-12 px-6 md:px-12 lg:px-24 border-t border-gray-100 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-secondary">
                    © {new Date().getFullYear()} Impact Founder. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
