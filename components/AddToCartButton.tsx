"use client";
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: {
        _id: string;
        name: string;
        price: number;
        image: any;
        description?: string;
        slug: { current: string };
        options?: any[];
    };
    selectedOptions?: Record<string, string[]>;
    quantity?: number;
    onAddToCart: () => void;
}

export default function AddToCartButton({
    product,
    selectedOptions,
    quantity = 1,
    onAddToCart
}: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleClick = async () => {
        setIsAdding(true);
        onAddToCart();

        // Brief animation
        setTimeout(() => {
            setIsAdding(false);
        }, 600);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isAdding}
            className={`w-full bg-primary hover:bg-accent text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isAdding ? 'scale-95' : 'hover:scale-105'
                }`}
        >
            <ShoppingCart size={20} className={isAdding ? 'animate-bounce' : ''} />
            <span>{isAdding ? '¡Agregado!' : 'Agregar al Carrito'}</span>
        </button>
    );
}
