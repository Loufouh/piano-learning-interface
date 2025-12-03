import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();

    // Envoie à ton API externe
    const apiRes = await fetch(`${process.env.API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!apiRes.ok) {
        return new Response("Unauthorized", { status: 401 });
    }

    const data = await apiRes.json();

    const cookieStore = await cookies();

    // Stocker le token dans un cookie HTTP only
    cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });

    return new Response("OK", { status: 200 });
}