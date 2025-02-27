"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL from env

export default function Checkout() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((state: RootState) => state.cart.items);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/products`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleUpdateQuantity = (product: Product, quantity: number) => {
        if (quantity > product.quantity) {
            setError((prev) => ({
                ...prev,
                [product.id]: `Maximum quantity reached (${product.quantity} available).`,
            }));
        } else if (quantity <= 0) {
            dispatch(updateQuantity({ id: product.id, quantity: 0 }));
            setError((prev) => ({ ...prev, [product.id]: "" }));
        } else {
            dispatch(updateQuantity({ id: product.id, quantity }));
            setError((prev) => ({ ...prev, [product.id]: "" }));
        }
    };

    const cartItems = products.filter((product) => cart[product.id]);
    const totalPrice = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);

    const handleCheckout = () => {
        router.push("/checkout");
    };

    if (loading) return <p className="text-center mt-10">Loading products...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold mb-6">Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
                <div className="space-y-6">
                    {cartItems.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div>
                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                <p className="text-gray-600">{product.description}</p>
                                <p className="text-gray-900 font-bold">Price: ${product.price.toFixed(2)}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(product, cart[product.id] - 1)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-bold">{cart[product.id]}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(product, cart[product.id] + 1)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-900 font-bold">Total: ${(product.price * cart[product.id]).toFixed(2)}</p>
                            <button
                                onClick={() => dispatch(removeFromCart({ id: product.id }))}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Remove
                            </button>
                            {error[product.id] && <p className="text-red-500 text-sm mt-2">{error[product.id]}</p>}
                        </motion.div>
                    ))}
                    <div className="text-right font-bold text-xl">Grand Total: ${totalPrice.toFixed(2)}</div>
                    <button
                        onClick={handleCheckout}
                        className="w-full mt-6 bg-blue-500 text-white py-3 rounded"
                    >
                        Checkout
                    </button>
                </div>
            )}
            <button
                onClick={() => router.push("/products")}
                className="w-full mt-6 bg-yellow-500 text-white py-3 rounded"
            >
                Back to Products
            </button>
        </div>
    );
}
