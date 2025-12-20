"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    categories?: any[];
    logo?: any;
}

export default function Navbar({ categories = [], logo }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
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

                    {/* Desktop Navigation - Right side */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/products"
                            className="relative text-lg font-bold text-foreground hover:text-primary transition-all group"
                        >
                            <span className="relative z-10">Catálogo</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        
                        {/* Categories Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsCategoriesOpen(true)}
                            onMouseLeave={() => setIsCategoriesOpen(false)}
                        >
                            <button
                                className="relative text-lg font-bold text-foreground hover:text-primary transition-all group flex items-center gap-1"
                            >
                                <span className="relative z-10">Categorías</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                                <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"></span>
                            </button>
                            
                            <AnimatePresence>
                                {isCategoriesOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px] z-50"
                                    >
                                        {categories.map((category, index) => {
                                            const colors = ['#4fc3f7', '#66bb6a', '#ba68c8', '#ff7043', '#ffa726', '#26c6da', '#ab47bc', '#ec407a', '#5c6bc0', '#78909c', '#ff8a65'];
                                            return (
                                                <Link
                                                    key={category._id}
                                                    href={`/products/${category.slug.current}`}
                                                    className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                                                    style={{ color: colors[index % colors.length] }}
                                                >
                                                    {category.name}
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cart Button - Desktop with playful animation */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(true)}
                            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full transition-all shadow-lg relative overflow-hidden"
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
                    </div>

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
                                Catálogo
                            </Link>
                            {categories.map((category, index) => {
                                const colors = ['#4fc3f7', '#66bb6a', '#ba68c8', '#ff7043', '#ffa726', '#26c6da', '#ab47bc', '#ec407a', '#5c6bc0', '#78909c', '#ff8a65'];
                                return (
                                    <Link
                                        key={category._id}
                                        href={`/products/${category.slug.current}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block hover:bg-gray-50 transition-all font-bold py-3 px-4 rounded-lg text-lg"
                                        style={{
                                            color: colors[index % colors.length]
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
