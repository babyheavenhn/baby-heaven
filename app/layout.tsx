import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartButton from "@/components/CartButton";
import CartModal from "@/components/CartModal";
import { client } from "@/lib/sanity";

const balooBhai = Baloo_Bhai_2({
    subsets: ["latin"],
    weight: ['400', '500', '600', '700', '800'],
    variable: "--font-baloo",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.babyheavenhn.com'),
    title: {
        default: "Baby Heaven Honduras | Productos para Bebés",
        template: "%s | Baby Heaven"
    },
    description: "Productos que te harán la crianza de tu bebé más fácil. Encuentra todo para tu bebé en Honduras.",
    keywords: ["Baby Heaven", "Productos para Bebé", "Honduras", "La Ceiba", "Biberones", "Ropa", "Accesorios"],
    authors: [{ name: "Baby Heaven" }],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "Baby Heaven Honduras | Productos para Bebés",
        description: "Productos que te harán la crianza de tu bebé más fácil",
        siteName: "Baby Heaven Honduras",
        locale: "es_HN",
        type: "website",
        url: 'https://www.babyheavenhn.com',
    },
    robots: {
        index: true,
        follow: true,
    },
};

async function getSiteSettings() {
    return await client.fetch('*[_type == "siteSettings"][0]');
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSiteSettings();

    return (
        <html lang="es">
            <body
                className={`${balooBhai.variable} antialiased bg-background text-foreground`}
            >
                {/* Global Animated Bubbles Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full opacity-10"
                            style={{
                                width: `${(i * 20) % 100 + 50}px`,
                                height: `${(i * 30) % 100 + 50}px`,
                                left: `${(i * 15) % 100}%`,
                                top: `${(i * 25) % 100}%`,
                                backgroundColor: ['#ff6b9d', '#4fc3f7', '#ffd54f', '#66bb6a', '#ba68c8'][i % 5],
                                animation: `float ${10 + (i % 10)}s infinite ease-in-out ${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                <CartProvider>
                    {children}
                    <CartButton />
                    <CartModal settings={settings} />
                </CartProvider>
            </body>
        </html>
    );
}
