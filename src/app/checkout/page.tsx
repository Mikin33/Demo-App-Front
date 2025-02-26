"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

export default function Checkout() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((state: RootState) => state.cart.items);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const cartItems = products
        .filter((product) => cart[product.id])
        .map((product) => ({
            ...product,
            quantity: cart[product.id],
        }));

    const totalPrice = cartItems.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const totalItems = cartItems.reduce((sum, product) => sum + product.quantity, 0);

    const handlePlaceOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authorization token not found");
            }

            const response = await fetch("http://localhost:4000/update-products-quantity", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ products: cartItems }),
            });

            const data = await response.json(); // Get response data

            if (!response.ok) {
                throw new Error(data.message || "Failed to place order");
            }else{
                
                toast.success("Order placed successfully!", { autoClose: 2000 });
                setTimeout(() => {
                    dispatch(clearCart());
                    router.push("/success")
                }, 2000);
            }

            
        } catch (error) {
            toast.error((error as Error).message || "Something went wrong", { autoClose: 3000 });
        }
    };

    if (loading) return <p className="text-center mt-10">Loading products...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-6">Checkout</h2>
            <p className="text-lg font-semibold text-gray-700">Total Items: {totalItems}</p>

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
                                <p className="text-gray-700">Quantity: {product.quantity}</p>
                            </div>
                            <p className="text-gray-900 font-bold">Total: ${(product.price * product.quantity).toFixed(2)}</p>
                        </motion.div>
                    ))}
                    <div className="text-right font-bold text-xl">Grand Total: ${totalPrice.toFixed(2)}</div>
                    <button
                        onClick={handlePlaceOrder}
                        className="w-full mt-6 bg-blue-500 text-white py-3 rounded"
                    >
                        Place Order
                    </button>
                </div>
            )}
            <button
                onClick={() => router.push("/cart")}
                className="w-full mt-6 bg-yellow-500 text-white py-3 rounded"
            >
                Back to Cart
            </button>
        </div>
    );
}
