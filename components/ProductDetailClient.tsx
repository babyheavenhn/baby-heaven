"use client";
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ProductGallery from '@/components/ProductGallery';
import ProductOptions from '@/components/ProductOptions';
import RelatedProducts from '@/components/RelatedProducts';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

interface ProductDetailProps {
    product: any;
    relatedProducts?: any[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Prepare images for gallery (main image + gallery images)
    const allImages = [product.image, ...(product.gallery || [])];

    // Calculate total price based on selected options or variant
    const calculateTotalPrice = () => {
        if (selectedVariant) {
            return selectedVariant.price || product.price;
        }

        let totalPrice = product.price;

        if (product.options && selectedOptions) {
            product.options.forEach((option: any) => {
                const selected = selectedOptions[option.name] || [];
                selected.forEach((selectedChoice: string) => {
                    const choice = option.choices?.find((c: any) => c.label === selectedChoice);
                    if (choice && choice.extraPrice) {
                        totalPrice += choice.extraPrice;
                    }
                });
            });
        }

        return totalPrice;
    };

    const handleAddToCart = () => {
        // Validate required options if no variant system
        if (!product.variants && product.options) {
            const missingRequired = product.options.some((option: any) => {
                if (option.required) {
                    return !selectedOptions[option.name] || selectedOptions[option.name].length === 0;
                }
                return false;
            });

            if (missingRequired) {
                alert('Por favor seleccione todas las opciones requeridas');
                return;
            }
        }

        // Validate variant selection
        if (product.variants && !selectedVariant) {
            alert('Por favor seleccione una variante');
            return;
        }

        // Check stock
        if (selectedVariant && selectedVariant.stock < quantity) {
            alert(`Solo hay ${selectedVariant.stock} unidades disponibles de esta variante`);
            return;
        } else if (!selectedVariant && typeof product.stock === 'number' && product.stock < quantity) {
            alert(`Solo hay ${product.stock} unidades disponibles`);
            return;
        }

        setIsAdding(true);

        const totalPrice = calculateTotalPrice();

        // Add product with quantity directly (not in a loop)
        const itemToAdd = {
            _id: product._id,
            name: product.name,
            price: totalPrice,
            image: product.image,
            description: product.description,
            slug: product.slug,
            selectedOptions: selectedVariant
                ? { "Variante": [selectedVariant.title] }
                : (Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined),
        };

        // Add to cart with the selected quantity
        addToCart({
            ...itemToAdd,
            quantity: quantity,
            maxStock: currentStock
        });

        setTimeout(() => {
            setIsAdding(false);
            setQuantity(1);
            setSelectedOptions({});
            setSelectedVariant(null);
        }, 600);
    };

    const totalPrice = calculateTotalPrice();
    const currentStock = selectedVariant
        ? selectedVariant.stock
        : (typeof product.stock === 'number' ? product.stock : (product.inStock ? 999 : 0));

    const isOutOfStock = !product.inStock ||
        (selectedVariant && selectedVariant.stock === 0) ||
        (!selectedVariant && typeof product.stock === 'number' && product.stock === 0);

    return (
        <div>
            {/* Back Button */}
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                <span>Volver a productos</span>
            </Link>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Product Gallery */}
                <div>
                    <ProductGallery images={allImages} productName={product.name} />
                </div>

                {/* Product Info */}
                <div>
                    {/* Category Tag */}
                    {product.category && (
                        <Link
                            href={`/products/${product.category.slug.current}`}
                            className="inline-block text-sm text-primary hover:underline mb-3"
                        >
                            {product.category.name}
                        </Link>
                    )}

                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        {product.name}
                    </h1>

                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-4xl font-bold text-primary">
                            L. {totalPrice.toFixed(2)}
                        </span>
                        {totalPrice !== product.price && (
                            <span className="text-lg text-gray-500 line-through">
                                L. {product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {product.description && (
                        <p className="text-foreground/80 text-lg mb-6">
                            {product.description}
                        </p>
                    )}

                    {/* Variants Selector */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Selecciona una opción
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {product.variants.map((variant: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`p-3 rounded-xl border-2 transition-all text-left ${selectedVariant === variant
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-primary/50'
                                            } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={variant.stock === 0}
                                    >
                                        <div className="font-bold">{variant.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {variant.stock > 0 ? `${variant.stock} disponibles` : 'Agotado'}
                                        </div>
                                        {variant.price && (
                                            <div className="text-sm text-primary font-bold">
                                                L. {variant.price}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Options (Fallback if no variants) */}
                    {!product.variants && product.options && product.options.length > 0 && (
                        <div className="mb-8">
                            <ProductOptions
                                options={product.options}
                                onOptionsChange={setSelectedOptions}
                            />
                        </div>
                    )}

                    {/* Stock Status */}
                    {isOutOfStock && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            <p className="font-semibold">Producto Agotado</p>
                            <p className="text-sm">Este producto no está disponible actualmente</p>
                        </div>
                    )}

                    {!isOutOfStock && (
                        <>
                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Cantidad
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 rounded-xl">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-gray-200 rounded-l-xl transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-16 text-center font-bold text-foreground">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                            className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-gray-200 rounded-r-xl transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Máx: {currentStock}
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`w-full bg-primary hover:bg-accent text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isAdding ? 'scale-95' : 'hover:scale-105'
                                    } shadow-lg`}
                            >
                                <ShoppingCart size={20} className={isAdding ? 'animate-bounce' : ''} />
                                <span>{isAdding ? '¡Agregado!' : 'Agregar al Carrito'}</span>
                            </button>
                        </>
                    )}

                    {/* Detailed Description */}
                    {product.detailedDescription && (
                        <div className="mt-12 prose prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-foreground mb-4">Descripción Detallada</h3>
                            <PortableText value={product.detailedDescription} />
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <RelatedProducts products={relatedProducts} />
                </div>
            )}
        </div>
    );
}
