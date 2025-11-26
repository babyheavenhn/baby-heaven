import Link from 'next/link';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
    products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-primary/5">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                    Productos Relacionados
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
