"use server";

import { cookies } from "next/headers";
import { apiPost } from "@/utils/api";

export async function login(email: string, password: string) {
	const response = await apiPost(`/auth/login`, {
		email,
		password,
	});

	console.log("response:", response);

	if (!response.ok) {
		throw new Error("Login failed");
	} else {
		const data = await response.json();

		const cookieStore = await cookies();

		// Stocker le token dans un cookie HTTP only
		cookieStore.set("token", data.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day
		});
	}
}

export async function logout() {
	const cookieStore = await cookies();
	cookieStore.delete("token");
}
