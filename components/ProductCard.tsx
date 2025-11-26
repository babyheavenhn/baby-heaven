import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        image: any;
        slug: { current: string };
        category?: { slug: { current: string } };
        inStock: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/products/${product.category?.slug?.current || 'all'}/${product.slug.current}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
                {product.image && (
                    <Image
                        src={urlFor(product.image).width(400).height(400).url()}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                )}

                {/* Sold Out Overlay */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white font-bold py-2 px-6 rounded-full text-lg">
                            AGOTADO
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm md:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-primary font-bold text-lg">
                    L. {product.price.toFixed(2)}
                </p>
            </div>
        </Link>
    );
}
