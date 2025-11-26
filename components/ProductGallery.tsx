"use client";
import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
    images: any[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                    src={urlFor(images[selectedImage]).width(800).height(800).url()}
                    alt={`${productName} - ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                />

                {/* Navigation Arrows (if more than 1 image) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-2 rounded-full shadow-lg transition-all"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-2 rounded-full shadow-lg transition-all"
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden ${index === selectedImage
                                    ? 'ring-2 ring-primary'
                                    : 'opacity-60 hover:opacity-100'
                                } transition-all`}
                        >
                            <Image
                                src={urlFor(img).width(200).height(200).url()}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
