import Link from 'next/link'

/**
 * 404 Not Found Page
 * 
 * Custom error page for unmatched routes.
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">The page you&#39;re looking for doesn&#39;t exist.</p>
                <Link
                    href="/"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}