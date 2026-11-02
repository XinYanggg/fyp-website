import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-helper";

/**
 * POST /api/scan/detect
 * 
 * Proxies the disease detection request to the external FastAPI/Flask model service.
 * 1. Checks for authentication (Web or Mobile).
 * 2. Hides the external Python AI API URL from the client.
 */
export async function POST(req: Request) {
    const session = await getAuthSession(req);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();

    // The external model service URL (Python backend)
    const res = await fetch("https://durian-health-api.farnxinyang.com/predict", {
        method: "POST",
        body: form,
    });

    const data = await res.json();
    return NextResponse.json(data);
}
