"use client";
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewProductsProps {
    products?: any[];
}

export default function NewProducts({ products = [] }: NewProductsProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Playful background bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${(i * 20) % 100 + 50}px`,
                            height: `${(i * 30) % 100 + 50}px`,
                            left: `${(i * 25) % 100}%`,
                            top: `${(i * 40) % 100}%`,
                            backgroundColor: ['#ff6b9d', '#4fc3f7', '#ffd54f', '#66bb6a', '#ba68c8'][i % 5],
                            opacity: 0.1,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, (i % 2 === 0 ? 10 : -10), 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 3 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-4">
                        <Star className="text-accent w-12 h-12 animate-wiggle" fill="currentColor" />
                        <span className="text-primary">
                            Productos Nuevos
                        </span>
                        <Sparkles className="text-secondary w-12 h-12 animate-pulse" />
                    </h2>
                    <p className="text-xl text-foreground/70">
                        Descubre nuestros últimos productos para bebé 🎈
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ scale: 0, rotate: -10 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                        >
                            <Link
                                href={`/products/${product.category?.slug?.current || 'all'}/${product.slug.current}`}
                                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block border-4 border-transparent hover:border-primary relative"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square bg-gray-50">
                                    {product.image && (
                                        <Image
                                            src={urlFor(product.image).width(400).height(400).url()}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}
                                    {product.isNew && (
                                        <motion.div
                                            className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                                            animate={{ rotate: [0, -5, 5, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            ✨ NUEVO
                                        </motion.div>
                                    )}
                                    <Sparkles className="absolute bottom-2 right-2 w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Product Info */}
                                <div className="p-4 bg-white">
                                    <h3 className="font-bold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-primary font-black text-lg">
                                        L. {product.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/products"
                        className="inline-block bg-primary hover:bg-secondary text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-110 shadow-xl text-lg relative overflow-hidden group"
                    >
                        <span className="relative z-10">Ver Todos los Productos</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
