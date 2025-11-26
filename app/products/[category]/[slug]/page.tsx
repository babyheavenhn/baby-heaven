import { client, CATEGORIES_QUERY, SITE_SETTINGS_QUERY, PRODUCT_BY_SLUG_QUERY } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductDetailClient from '@/components/ProductDetailClient';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = {
    params: Promise<{ category: string; slug: string }>;
};

async function getProductData(slug: string) {
    const [product, categories, settings] = await Promise.all([
        client.fetch(PRODUCT_BY_SLUG_QUERY, { slug }),
        client.fetch(CATEGORIES_QUERY),
        client.fetch(SITE_SETTINGS_QUERY),
    ]);

    return { product, categories, settings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { product } = await getProductData(slug);

    if (!product) {
        return {
            title: 'Producto no encontrado',
        };
    }

    return {
        title: product.name,
        description: product.description || `${product.name} en Baby Heaven Honduras`,
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const { product, categories, settings } = await getProductData(slug);

    if (!product) {
        notFound();
    }

    return (
        <main>
            <Navbar categories={categories} logo={settings?.logo} />

            <div className="container mx-auto px-4 py-16">
                <ProductDetailClient
                    product={product}
                    relatedProducts={product.relatedProducts || []}
                />
            </div>

            <Footer settings={settings} categories={categories} />
        </main>
    );
}
