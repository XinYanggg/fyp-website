import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
    // Get the token from the request (if user is authenticated)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Get the requested URL path
    const pathname = req.nextUrl.pathname;

    // Define general protected routes that require authentication
    const protectedRoutes = [
        "/dashboard",
        "/farm",
        "/scan"
    ];

    // Check if the path is in one of the protected routes
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    // If the route is protected but user is not logged in (i.e., no token)
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/auth", req.url));  // Redirect to login
    }

    // If everything is good, allow the request to proceed
    return NextResponse.next();
}

export const config = {
    // Specify which paths should trigger the middleware
    matcher: [
        "/dashboard/:path*", // Match all dashboard routes
        "/farm/:path*",  // Match farm-related routes
        "/scan/:path*",  // Match scan-related routes
    ],
};
