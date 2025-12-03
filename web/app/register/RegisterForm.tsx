"use client";

import { useEffect, useState } from "react";

export default function RegisterForm({ API_URL }: { API_URL: string }) {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        const emailInput = document.querySelector<HTMLInputElement>("input[name=email]");
        const nameInput = document.querySelector<HTMLInputElement>("input[name=name]");
        const passwordInput = document.querySelector<HTMLInputElement>("input[name=password]");

        setForm({
            email: emailInput?.value || "",
            name: nameInput?.value || "",
            password: passwordInput?.value || ""
        });
    }, []);
    
    function submit() {
        fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: form.email,
                name: form.name,
                password: form.password
            })
        }).then(res => {
            if (res.ok) {
                window.location.href = "/login";
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <form 
            className="flex flex-col items-center gap-2 mt-4 w-100"
            onSubmit={e => { e.preventDefault(); submit() }}
        >
            <input 
                className="bg-[#e6effc] p-3 rounded"
                placeholder="Email" 
                name="email" 
                type="email"
                onChange={handleChange}
            />
            <input 
                className="bg-[#e6effc] p-3 rounded"
                placeholder="Nom" 
                name="name" 
                type="text"
                onChange={handleChange}
            />
            <input 
                className="bg-[#e6effc] p-3 rounded"
                placeholder="Mot de Passe" 
                name="password" 
                type="password"
                onChange={handleChange}
            />
            <input 
                className="bg-purple-500 active:bg-purple-800 p-3 rounded text-white cursor-pointer"
                name="submit" 
                type="submit" 
                value="S'inscrire"
            />
        </form>
    );
}