import { client, CATEGORIES_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = {
    params: Promise<{ category: string }>;
};

async function getCategoryData(categorySlug: string) {
    const [category, allCategories, settings] = await Promise.all([
        client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug: categorySlug }),
        client.fetch(CATEGORIES_QUERY),
        client.fetch(SITE_SETTINGS_QUERY),
    ]);

    if (!category) return null;

    const products = await client.fetch(
        `*[_type == "product" && category._ref == $categoryId && inStock == true] | order(createdAt desc){
            _id, name, slug, description, price, currency, image, 
            category->{name, slug}, inStock
        }`,
        { categoryId: category._id }
    );

    return { category, products, allCategories, settings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug } = await params;
    const data = await getCategoryData(categorySlug);

    if (!data) {
        return {
            title: 'Categoría no encontrada',
        };
    }

    return {
        title: data.category.name,
        description: data.category.description || `Productos de ${data.category.name}`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category: categorySlug } = await params;
    const data = await getCategoryData(categorySlug);

    if (!data) {
        notFound();
    }

    const { category, products, allCategories, settings } = data;

    return (
        <main>
            <Navbar categories={allCategories} logo={settings?.logo} />

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            {category.description}
                        </p>
                    )}
                </div>

                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-foreground/60 text-lg">No hay productos disponibles en esta categoría</p>
                    </div>
                )}
            </div>

            <Footer settings={settings} categories={allCategories} />
        </main>
    );
}
