import { motion } from "framer-motion";
import Button from "@/components/Button";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

interface ProductCardProps {
    product: Product;
    cartQuantity: number;
    handleAddToCart: (product: Product) => void;
    handleUpdateQuantity: (product: Product, quantity: number) => void;
    error: string;
}

function ProductCard({ product, cartQuantity, handleAddToCart, handleUpdateQuantity, error }: ProductCardProps) {
    return (
        <motion.div className="bg-white p-4 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-600">Price: $ {product.price}</p>
            <p className="text-gray-500 mt-1">In Stock: {product.quantity} QTY</p>
            <div className="mt-4">
            {product.quantity > 0 ? (
                    cartQuantity? (
                        <div className="flex items-center space-x-3">
                            <Button onClick={() => handleUpdateQuantity(product, cartQuantity - 1)} className="bg-red-500 text-white">-</Button>
                            <span className="text-lg font-bold">{cartQuantity}</span>
                            <Button onClick={() => handleUpdateQuantity(product, cartQuantity + 1)} className="bg-green-500 text-white">+</Button>
                        </div>
                    ) : (
                        <Button onClick={() => handleAddToCart(product)} className="bg-blue-500 text-white mt-2">Add to Cart</Button>
                    )
                ) : (
                    <Button onClick={() => ""} className="bg-gray-500 text-white mt-2">Out of Stock</Button>
                )}
               
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </motion.div>
    );
}

export default ProductCard;
