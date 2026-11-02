import { getServerSession } from "next-auth";
import { decode } from "next-auth/jwt";

export interface AuthSession {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

/**
 * Universal Session Helper for both Web and Mobile requests.
 * 
 * 1. Checks standard NextAuth cookies (for web browsers).
 * 2. If not found or if a Bearer token is provided in the Authorization header,
 *    decodes the NextAuth JWT token (for mobile clients like Android/iOS).
 */
export async function getAuthSession(req?: Request): Promise<AuthSession | null> {
    // 1. Try Bearer token from Authorization header if request is provided
    if (req) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
            const token = authHeader.substring(7).trim();
            if (token) {
                try {
                    const decoded = await decode({
                        token,
                        secret: process.env.NEXTAUTH_SECRET!,
                    });
                    if (decoded && (decoded.email || decoded.sub)) {
                        return {
                            user: {
                                id: (decoded.id as string) || (decoded.sub as string),
                                name: (decoded.name as string) || null,
                                email: (decoded.email as string) || null,
                                image: (decoded.picture as string) || null,
                            },
                        };
                    }
                } catch (err) {
                    console.error("Failed to decode mobile Bearer token:", err);
                }
            }
        }
    }

    // 2. Fall back to standard cookie-based NextAuth session
    try {
        const session = await getServerSession();
        if (session?.user?.email) {
            return session as AuthSession;
        }
    } catch {
        // getServerSession might throw if invoked outside a cookie request context
    }

    return null;
}

