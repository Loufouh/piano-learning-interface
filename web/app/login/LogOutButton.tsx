"use client";

import { useRouter } from "next/navigation";

export default function LogOutButton() {
    const router = useRouter();

    function handleClick() {
        fetch("/api/auth/logout", {
            method: "POST",
        }).then(res => {
            if (res.ok) {
                router.refresh();
            } else {
                alert("La déconnection a echoué.");
            }
        })
    }
    return (
        <button
            className="bg-blue-800 p-2 rounded text-white cursor-pointer"
            onClick={handleClick}    
        >
            Se déconnecter
        </button>
    );
}