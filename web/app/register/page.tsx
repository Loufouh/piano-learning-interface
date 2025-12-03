import RegisterForm from "@/app/register/RegisterForm";
import { isConnected } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    if(await isConnected()) {
        redirect("/");
    }

    return (
        <RegisterForm API_URL={process.env.API_URL!} />
    );
}