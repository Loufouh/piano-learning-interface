"use server";

import { redirect } from "next/navigation";
import LoginForm from "@/app/login/LoginForm";
import { isConnected } from "@/utils/auth";

export default async function RegisterPage() {
	if (await isConnected()) {
		redirect("/");
	}

	return <LoginForm />;
}
