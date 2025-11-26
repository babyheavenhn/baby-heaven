import { client, HERO_QUERY, TWO_CATEGORIES_QUERY, NEW_PRODUCTS_QUERY, NEWEST_PRODUCTS_FALLBACK_QUERY, ABOUT_QUERY, CATEGORIES_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import NewProducts from '@/components/NewProducts';
import Instagram from '@/components/Instagram';
import About from '@/components/About';
import Footer from '@/components/Footer';

export const revalidate = 60; // Revalidate every 60 seconds

async function getHomePageData() {
    const [heroSlides, categories, categoriesForFooter, newProducts, about, settings] = await Promise.all([
        client.fetch(HERO_QUERY),
        client.fetch(TWO_CATEGORIES_QUERY),
        client.fetch(CATEGORIES_QUERY),
        client.fetch(NEW_PRODUCTS_QUERY),
        client.fetch(ABOUT_QUERY),
        client.fetch(SITE_SETTINGS_QUERY),
    ]);

    // If no products from last 30 days, get 6 newest products
    let productsToShow = newProducts;
    if (!newProducts || newProducts.length === 0) {
        productsToShow = await client.fetch(NEWEST_PRODUCTS_FALLBACK_QUERY);
    }

    return {
        heroSlides,
        categories,
        categoriesForFooter,
        newProducts: productsToShow,
        about,
        settings,
    };
}

export default async function Home() {
    const { heroSlides, categories, categoriesForFooter, newProducts, about, settings } = await getHomePageData();

    return (
        <main>
            <Navbar categories={categoriesForFooter} logo={settings?.logo} />
            <Hero slides={heroSlides} />
            <Categories categories={categories} />
            <NewProducts products={newProducts} />
            <Instagram />
            <About data={about} />
            <Footer settings={settings} categories={categoriesForFooter} />
        </main>
    );
}
