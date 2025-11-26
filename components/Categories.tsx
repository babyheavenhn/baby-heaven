"use client";
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoriesProps {
    categories?: any[];
}

export default function Categories({ categories = [] }: CategoriesProps) {
    // Show only first 2 categories
    const displayCategories = categories.slice(0, 2);

    if (displayCategories.length === 0) {
        return null;
    }

    // Solid colors for categories
    const colors = [
        '#ff6b9d', // Pink
        '#4fc3f7', // Blue
    ];

    return (
        <section className="py-16 px-4  relative z-10">
            <div className="container mx-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
                        Explora Nuestras Categorías
                    </h2>
                    <p className="text-lg text-foreground/70">
                        Descubre lo mejor para tu bebé
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {displayCategories.map((category, index) => (
                        <motion.div
                            key={category._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={`/products/${category.slug.current}`}
                                className="group relative h-[400px] md:h-[500px] w-full block overflow-hidden bg-gray-100 border-2 border-gray-200 rounded-3xl shadow-sm"
                            >
                                {/* Background Image */}
                                {category.backgroundImage && (
                                    <Image
                                        src={urlFor(category.backgroundImage).width(800).height(800).url()}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}

                                {/* Centered White Box Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 text-center max-w-xs w-full shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
                                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}
                                        <span className="inline-block bg-primary text-white text-sm font-bold py-3 px-6 rounded-full uppercase tracking-wider transition-colors group-hover:bg-secondary">
                                            {category.buttonText || 'Ver Ahora'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
