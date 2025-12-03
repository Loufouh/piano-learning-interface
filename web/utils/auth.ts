import { cookies } from "next/headers";

export async function isConnected(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const res = await fetch(`${process.env.API_URL}/auth/checkToken`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.value}`,
        }
    });

    return res.ok;
}