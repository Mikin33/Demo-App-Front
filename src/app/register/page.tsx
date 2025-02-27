"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
    name: string;
    email: string;
    mobile: string;
    address: string;
    password: string;
    confirmPassword: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL from env

export default function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        mobile: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = (): boolean => {
        const tempErrors: Partial<FormData> = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        if (!formData.mobile) tempErrors.mobile = "Mobile number is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!formData.password) tempErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword)
            tempErrors.confirmPassword = "Passwords do not match";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
    
                const data: { message?: string } = await res.json(); // Explicitly typing response
    
                if (res.ok) {
                    setSuccessMessage("Registration successful! Redirecting to login...");
                    setTimeout(() => router.push("/login"), 2000);
                } else {
                    setErrors({ email: data.message || "Registration failed" });
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrors({ email: error.message || "Something went wrong. Please try again." });
                } else {
                    setErrors({ email: "An unknown error occurred. Please try again." });
                }
            }
        }
    };
    

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                    key !== "confirmPassword" && (
                        <div key={key} className="mb-4">
                            <label className="block mb-1 capitalize">{key}</label>
                            <input
                                type={key.includes("password") ? "password" : "text"}
                                name={key}
                                value={value}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                            {errors[key as keyof FormData] && (
                                <p className="text-red-500 text-sm">{errors[key as keyof FormData]}</p>
                            )}
                        </div>
                    )
                ))}
                <div className="mb-4">
                    <label className="block mb-1">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
}
