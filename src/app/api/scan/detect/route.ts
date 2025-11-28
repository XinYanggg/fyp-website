import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const form = await req.formData();

    const res = await fetch("https://fyp-api-g49g.onrender.com/predict", {
        method: "POST",
        body: form,
    });

    // const res = await fetch("http://127.0.0.1:8000/predict", {
    //     method: "POST",
    //     body: form,
    // });

    const data = await res.json();
    return NextResponse.json(data);
}
