import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { Facebook, Instagram } from 'lucide-react';

interface FooterProps {
    settings?: any;
    categories?: any[];
}

export default function Footer({ settings, categories = [] }: FooterProps) {
    return (
        <footer className="bg-white border-t-4 border-primary py-12 px-4 mt-16 relative z-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            {settings?.logo ? (
                                <Image
                                    src={urlFor(settings.logo).width(150).height(75).url()}
                                    alt="Baby Heaven"
                                    width={150}
                                    height={75}
                                    className="h-16 w-auto"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-primary">Baby Heaven</span>
                            )}
                        </Link>
                        <p className="text-foreground/70 mb-4 max-w-md">
                            {settings?.description || 'Productos que te harán la crianza de tu bebé más fácil.'}
                        </p>
                        {/* Social Media */}
                        <div className="flex gap-4">
                            {settings?.socialMedia?.facebook && (
                                <a
                                    href={settings.socialMedia.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/60 hover:text-primary transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={24} />
                                </a>
                            )}
                            {settings?.socialMedia?.instagram && (
                                <a
                                    href={settings.socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/60 hover:text-primary transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={24} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-foreground/70 hover:text-primary transition-colors">
                                    Catalogo
                                </Link>
                            </li>
                            {categories.map((category) => (
                                <li key={category._id}>
                                    <Link
                                        href={`/products/${category.slug.current}`}
                                        className="text-foreground/70 hover:text-primary transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4">Contacto</h3>
                        <ul className="space-y-2 text-foreground/70">
                            {settings?.phone && (
                                <li>
                                    <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                                        {settings.phone}
                                    </a>
                                </li>
                            )}
                            {settings?.email && (
                                <li>
                                    <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                                        {settings.email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-foreground/10 mt-8 pt-8 text-center text-foreground/60 text-sm">
                    <p>&copy; {new Date().getFullYear()} Baby Heaven Honduras. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
