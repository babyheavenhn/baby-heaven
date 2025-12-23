import { client, CATEGORIES_QUERY, SITE_SETTINGS_QUERY, PRODUCT_BY_SLUG_QUERY, urlFor } from '@/lib/sanity';
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
        title: `${product.name} | Baby Heaven`,
        description: product.description || `${product.name} en Baby Heaven Honduras. Productos que te harán la crianza de tu bebé más fácil.`,
        openGraph: {
            title: `${product.name} | Baby Heaven`,
            description: product.description || `${product.name} en Baby Heaven Honduras`,
            images: [
                {
                    url: product.image ? urlFor(product.image).width(1200).height(630).url() : '/logo.jpg',
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} | Baby Heaven`,
            description: product.description || `${product.name} en Baby Heaven Honduras`,
            images: [product.image ? urlFor(product.image).width(1200).height(630).url() : '/logo.jpg'],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug, category } = await params;
    const { product, categories, settings } = await getProductData(slug);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image ? urlFor(product.image).url() : undefined,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'Baby Heaven'
        },
        offers: {
            '@type': 'Offer',
            url: `https://babyheavenhn.com/products/${category}/${product.slug.current}`,
            priceCurrency: product.currency || 'HNL',
            price: product.price,
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
