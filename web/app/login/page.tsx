"use server";

import LoginForm from "@/app/login/LoginForm";
import { isConnected } from "@/utils/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    if (await isConnected()) {
        redirect("/");
    }

    return (
        <>
            <LoginForm />
            <Link href="/register" className="bg-blue-800 opacity-90 p-4 rounded w-10 h-10 text-white text-2xl">S'inscrire</Link>
        </>
    );
}