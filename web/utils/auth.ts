import { cookies } from "next/headers";
import { apiGet } from "./api";

export async function isConnected(): Promise<boolean> {
	const res = await apiGet("/auth/checkToken");
	return res.ok;
}

export async function getToken(): Promise<string> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value || "";

	return token;
}
