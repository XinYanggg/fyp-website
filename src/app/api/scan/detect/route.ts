import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

/**
 * POST handler for Disease Detection.
 * 
 * Proxies the request to the external FastAPI/Flask model service.
 * 1. Checks for authentication
 * 2. We do this to hide the external API URL from the client.
 */
export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();

    // The external model service URL (Python backend)
    const res = await fetch("https://durian-health-api.farnxinyang.com/predict", {
        method: "POST",
        body: form,
    });

    // Local loopback for testing
    // const res = await fetch("http://127.0.0.1:8000/predict", {
    //     method: "POST",
    //     body: form,
    // });

    const data = await res.json();
    return NextResponse.json(data);
}
