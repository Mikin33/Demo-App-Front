"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, updateQuantity } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import LogoutButton from "@/components/LogoutButton";
import { io } from "socket.io-client";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL from env
const socket = io(`${API_BASE_URL}`); // Connect to your backend

export default function ProductListing() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((state: RootState) => state.cart.items);
    const cartItemCount = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    const [error, setError] = useState<{ [key: number]: string }>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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

        // Listen for product updates from the server
        socket.on("productUpdated", (updatedProducts: Product[]) => {
            setProducts((prevProducts) =>
                prevProducts.map((product) => {
                    const updatedProduct = updatedProducts.find((p) => p.id === product.id);
                    return updatedProduct ? { ...product, quantity: updatedProduct.quantity } : product;
                })
            );
        });

        return () => {
            socket.off("productUpdated");
        };
    }, []);

    const handleAddToCart = (product: Product) => {
        if (cart[product.id] && cart[product.id] >= product.quantity) {
            setError((prev) => ({
                ...prev,
                [product.id]: `Maximum quantity reached (${product.quantity} available).`,
            }));
        } else {
            dispatch(addToCart(product));
            setError((prev) => ({ ...prev, [product.id]: "" })); // Clear error on successful addition
        }
    };

    const handleUpdateQuantity = (product: Product, quantity: number) => {
        if (quantity > product.quantity) {
            setError((prev) => ({
                ...prev,
                [product.id]: `Maximum quantity reached (${product.quantity} available).`,
            }));
        } else if (quantity <= 0) {
            dispatch(updateQuantity({ id: product.id, quantity: 0 }));
            setError((prev) => ({ ...prev, [product.id]: "" })); // Clear error if quantity is reduced
        } else {
            dispatch(updateQuantity({ id: product.id, quantity }));
            setError((prev) => ({ ...prev, [product.id]: "" })); // Clear error on valid quantity
        }
    };

    if (loading) return <p className="text-center mt-10">Loading products...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Product Listing</h2>

                <Button onClick={() => router.push("/cart")} className="relative bg-gray-200 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2 13h13l2-7H5"></path>
                    </svg>

                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {cartItemCount}
                        </span>
                    )}
                </Button>
                <LogoutButton />
            </div>
            <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-3 gap-6">
                {products && products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        cartQuantity={cart[product.id] || 0}
                        handleAddToCart={handleAddToCart}
                        handleUpdateQuantity={handleUpdateQuantity}
                        error={error[product.id] || ""}
                    />
                ))}
            </div>
            <Button onClick={() => router.push("/cart")} className="w-full mt-6 bg-yellow-500 text-white py-3 rounded">
                Go to Cart
            </Button>
        </div>
    );
}
