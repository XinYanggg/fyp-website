import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-helper";

/**
 * GET /api/mobile/me
 * 
 * Returns the currently authenticated user's session from Bearer token or cookies.
 */
export async function GET(req: Request) {
    const session = await getAuthSession(req);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
}

