"use client";

import { useState } from "react";
import MessageBox, { MessageType } from "../components/MessageBox";
// import { useEffect, useState } from "react";
import { login } from "./serverActions";

export default function LoginForm() {
	const [message, setMessage] = useState<string>("");
	const [messageType, setMessageType] = useState<MessageType>(MessageType.Info);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget);

		const email = data.get("email") as string;
		const password = data.get("password") as string;
		const durationLimit_days = 3;

		try {
			await login(email, password, durationLimit_days);

			setMessageType(MessageType.Success);
			setMessage("Connexion réussie");
		} catch (_) {
			setMessageType(MessageType.Error);
			setMessage(
				"Connexion échouée \n(Vos informations de connexion sont-elles correctes ?)",
			);
		}
	};

	return (
		<div className="flex flex-col items-center w-full">
			<div className="w-80 font-bold text-center">
				<MessageBox text={message} type={messageType} />
			</div>
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
		</div>
	);
}
