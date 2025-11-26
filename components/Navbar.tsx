"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    categories?: any[];
    logo?: any;
}

export default function Navbar({ categories = [], logo }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setIsOpen, totalItems } = useCart();

    return (
        <nav className="sticky top-0 z-50 shadow-lg w-full" style={{ backgroundColor: '#ffffff' }}>
            <div className="container mx-auto px-4 py-4" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center justify-between">
                    {/* Logo with animation */}
                    <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                        {logo ? (
                            <motion.div
                                animate={{ rotate: [0, -5, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <Image
                                    src={urlFor(logo).width(120).height(60).url()}
                                    alt="Baby Heaven"
                                    width={120}
                                    height={60}
                                    className="h-14 w-auto"
                                />
                            </motion.div>
                        ) : (
                            <motion.span
                                className="text-3xl font-bold text-primary"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Baby Heaven ✨
                            </motion.span>
                        )}
                    </Link>

                    {/* Desktop Navigation with colorful links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/products"
                            className="relative text-lg font-bold text-foreground hover:text-primary transition-all group"
                        >
                            <span className="relative z-10">Catalogo</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        {categories.slice(0, 3).map((category, index) => (
                            <Link
                                key={category._id}
                                href={`/products/${category.slug.current}`}
                                className="relative text-lg font-bold text-foreground hover:text-secondary transition-all group"
                                style={{
                                    color: index === 0 ? '#4fc3f7' : index === 1 ? '#66bb6a' : '#ba68c8'
                                }}
                            >
                                <span className="relative z-10">{category.name}</span>
                                <motion.span
                                    className="absolute -bottom-1 left-0 h-1 bg-current"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Cart Button - Desktop with playful animation */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full transition-all shadow-lg relative overflow-hidden"
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        >
                            <ShoppingCart size={22} />
                        </motion.div>
                        <span className="font-bold text-lg">Carrito</span>
                        {totalItems > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-accent text-foreground text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md"
                            >
                                {totalItems}
                            </motion.span>
                        )}
                        <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 opacity-80" />
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-foreground p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu with animation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4 border-t-2 border-primary/20 pt-4 space-y-3 overflow-hidden"
                        >
                            <Link
                                href="/products"
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-foreground hover:text-primary hover:bg-primary/10 transition-all font-bold py-3 px-4 rounded-lg text-lg"
                            >
                                Catalogo
                            </Link>
                            {categories.map((category, index) => (
                                <Link
                                    key={category._id}
                                    href={`/products/${category.slug.current}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-foreground hover:bg-secondary/10 transition-all font-bold py-3 px-4 rounded-lg text-lg"
                                    style={{
                                        color: index === 0 ? '#4fc3f7' : index === 1 ? '#66bb6a' : '#ba68c8'
                                    }}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
