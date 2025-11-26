import { client, PRODUCTS_QUERY, CATEGORIES_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Productos',
    description: 'Todos los productos para tu bebé en Baby Heaven Honduras',
};

export const revalidate = 60;

async function getAllProducts() {
    const [products, categories, settings] = await Promise.all([
        client.fetch(PRODUCTS_QUERY),
        client.fetch(CATEGORIES_QUERY),
        client.fetch(SITE_SETTINGS_QUERY),
    ]);

    return { products, categories, settings };
}

export default async function ProductsPage() {
    const { products, categories, settings } = await getAllProducts();

    return (
        <main>
            <Navbar categories={categories} logo={settings?.logo} />

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Catalogo
                    </h1>
                    <p className="text-lg text-foreground/70">
                        Encuentra todo lo que necesitas para tu bebé
                    </p>
                </div>

                <ProductGrid products={products} />
            </div>

            <Footer settings={settings} categories={categories} />
        </main>
    );
}
