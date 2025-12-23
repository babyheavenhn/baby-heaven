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
    description: "Productos que te harán la crianza de tu bebé más fácil. Encuentra biberones, ropa, juguetes y accesorios para tu bebé en Honduras.",
    keywords: ["Baby Heaven", "Productos para Bebé", "Honduras", "La Ceiba", "Biberones", "Ropa de Bebé", "Accesorios", "Juguetes", "Comotomo"],
    authors: [{ name: "Baby Heaven" }],
    alternates: {
        canonical: 'https://www.babyheavenhn.com',
    },
    openGraph: {
        title: "Baby Heaven Honduras | Productos para Bebés",
        description: "Productos que te harán la crianza de tu bebé más fácil. Todo para tu bebé en Honduras.",
        siteName: "Baby Heaven Honduras",
        images: [{ url: "/logo.jpg", width: 800, height: 600, alt: "Baby Heaven Logo" }],
        locale: "es_HN",
        type: "website",
        url: 'https://www.babyheavenhn.com',
    },
    twitter: {
        card: "summary_large_image",
        title: "Baby Heaven Honduras",
        description: "Productos que te harán la crianza de tu bebé más fácil.",
        images: ["/logo.jpg"],
    },
    applicationName: 'Baby Heaven',
    appleWebApp: {
        capable: true,
        title: 'Baby Heaven',
        statusBarStyle: 'default',
    },
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: '48x48', type: 'image/png' },
            { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
            { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
            { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
        ],
        shortcut: '/icon-48.png',
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
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
                suppressHydrationWarning
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Baby Heaven Honduras",
                            url: "https://www.babyheavenhn.com",
                            logo: "https://www.babyheavenhn.com/logo.jpg",
                            image: "https://www.babyheavenhn.com/logo.jpg",
                            description: "Productos que te harán la crianza de tu bebé más fácil. Todo para tu bebé en Honduras.",
                            sameAs: [
                                "https://www.instagram.com/babyheavenhn",
                                "https://www.facebook.com/babyheavenhn"
                            ]
                        }),
                    }}
                />
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
