"use client";

import { useEffect, useState } from "react";

export default function LoginForm() {
    const [form, setForm] = useState({
        email: "",
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
        const passwordInput = document.querySelector<HTMLInputElement>("input[name=password]");

        setForm({
            email: emailInput?.value || "",
            password: passwordInput?.value || ""
        });
    }, []);

    function submit() {
        fetch(`/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                email: form.email,
                password: form.password
            })
        }).then(res => {
            if (res.ok) {
                window.location.href = "/";
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
                placeholder="Mot de Passe" 
                name="password" 
                type="password"
                onChange={handleChange}
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