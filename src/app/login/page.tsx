"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginForm {
    email: string;
    password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL from env

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginForm>({ email: "", password: "" });
    const [error, setError] = useState<string>("");
    const [validationError, setValidationError] = useState<string>("");

    // Redirect to products page if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/products");
        }
    }, [router]);

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setValidationError("Both email and password are required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setValidationError("Invalid email format");
            return false;
        }
        setValidationError("");
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            const data: { token: string } = await response.json();
            localStorage.setItem("token", data.token); // Store token in local storage
            router.push("/products"); // Redirect after login
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
