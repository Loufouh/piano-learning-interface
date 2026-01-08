"use client";

// import { useEffect, useState } from "react";
import { login } from "./serverActions";

export default function LoginForm() {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget);

		const email = data.get("email") as string;
		const password = data.get("password") as string;

		try {
			await login(email, password);
		} catch (_) {
			alert("Erreur de connexion");
		}
	};

	return (
		<form
			className="flex flex-col items-center gap-2 mt-4 w-100"
			onSubmit={handleSubmit}
		>
			<input
				className="bg-[#e6effc] p-3 rounded"
				placeholder="Email"
				name="email"
				type="email"
			/>
			<input
				className="bg-[#e6effc] p-3 rounded"
				placeholder="Mot de Passe"
				name="password"
				type="password"
			/>
			<input
				className="bg-purple-500 active:bg-purple-800 p-3 rounded text-white cursor-pointer"
				name="submit"
				type="submit"
				value="Se connecter"
			/>
		</form>
	);
}
