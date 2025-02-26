"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-screen text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-4xl font-bold text-green-600">Order Placed Successfully! 🎉</h2>
            <p className="text-gray-600 mt-2">Thank you for shopping with us. Your order has been confirmed.</p>
            <motion.button
                onClick={() => router.push("/products")}
                className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg"
                whileHover={{ scale: 1.1 }}
            >
                Continue Shopping
            </motion.button>
        </motion.div>
    );
}
