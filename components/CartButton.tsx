"use client";
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartButton() {
    const { setIsOpen, totalItems } = useCart();

    // Don't render until hydrated to prevent hydration mismatch
    if (totalItems === 0) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[100] bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
                aria-label="Abrir carrito"
            >
                <ShoppingCart size={28} />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-primary">
                    {totalItems}
                </span>
            </motion.button>
        </AnimatePresence>
    );
}
