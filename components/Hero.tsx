"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
    slides?: any[];
}

export default function Hero({ slides = [] }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    if (!slides || slides.length === 0) {
        return (
            <section className="relative h-[500px] md:h-[600px] bg-primary/10 flex items-center justify-center overflow-hidden">
                {/* Playful floating elements */}
                <motion.div
                    className="absolute top-10 left-10"
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Star className="text-accent w-12 h-12" fill="currentColor" />
                </motion.div>
                <motion.div
                    className="absolute bottom-20 right-20"
                    animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >
                    <Sparkles className="text-secondary w-16 h-16" />
                </motion.div>

                <div className="text-center z-10 relative">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-4"
                    >
                        <span className="text-primary">
                            Baby Heaven Honduras
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl text-foreground/80 mb-8"
                    >
                        ✨ Productos que te harán la crianza más fácil ✨
                    </motion.p>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link
                            href="/products"
                            className="inline-block bg-primary hover:bg-secondary text-white font-bold py-4 px-10 rounded-full transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            🛍️ Ver Productos
                        </Link>
                    </motion.div>
                </div>
            </section>
        );
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="relative h-[400px] md:h-[600px] overflow-hidden">
            {slides.map((slide, index) => (
                <motion.div
                    key={slide._id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
                >
                    {/* Background Image */}
                    {slide.backgroundImage && (
                        <Image
                            src={urlFor(slide.backgroundImage).width(1920).height(1080).url()}
                            alt={slide.title || 'Hero'}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    )}

                    {/* Solid Overlay */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Content */}
                    <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl">
                            <motion.h1
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
                            >
                                {slide.title}
                            </motion.h1>
                            {slide.subtitle && (
                                <motion.p
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-2xl md:text-3xl text-white/95 mb-8 drop-shadow-lg"
                                >
                                    {slide.subtitle}
                                </motion.p>
                            )}
                            {slide.ctaButton && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <Link
                                        href={slide.ctaButton.link || '/products'}
                                        className="inline-block bg-primary hover:bg-secondary text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-110 shadow-2xl text-lg"
                                    >
                                        {slide.ctaButton.text || 'Ver Productos'} 🎈
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Navigation Arrows with playful colors */}
            {slides.length > 1 && (
                <>
                    <motion.button
                        whileHover={{ scale: 1.2, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-secondary text-white p-3 rounded-full transition-all shadow-xl"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={28} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.2, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-secondary text-white p-3 rounded-full transition-all shadow-xl"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={28} />
                    </motion.button>

                    {/* Colorful Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {slides.map((_, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.3 }}
                                onClick={() => setCurrentSlide(index)}
                                className={`rounded-full transition-all shadow-lg ${index === currentSlide
                                    ? 'w-10 h-4 bg-primary'
                                    : 'w-4 h-4 bg-white/60 hover:bg-white'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
