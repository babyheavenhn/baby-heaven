"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Instagram as InstagramIcon } from 'lucide-react';

interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption?: string;
    media_type: string;
}

export default function Instagram() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInstagramPosts() {
            try {
                const response = await fetch('/api/instagram');
                if (!response.ok) {
                    throw new Error('Failed to fetch Instagram posts');
                }
                const data = await response.json();
                setPosts(data.posts || []);
            } catch (err) {
                console.error('Instagram fetch error:', err);
                setError('No se pudieron cargar las publicaciones');
            } finally {
                setLoading(false);
            }
        }

        fetchInstagramPosts();
    }, []);

    if (loading) {
        return (
            <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Síguenos en Instagram
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || posts.length === 0) {
        return (
            <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
                <div className="container mx-auto">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Síguenos en Instagram
                        </h2>
                        <a
                            href="https://www.instagram.com/babyheavenhn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all"
                        >
                            <InstagramIcon size={20} />
                            <span>@babyheavenhn</span>
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                        <InstagramIcon size={40} className="text-pink-500" />
                        Síguenos en Instagram
                    </h2>
                    <p className="text-lg text-foreground/70">
                        Las últimas novedades de Baby Heaven
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {posts.slice(0, 4).map((post) => (
                        <a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            {post.media_type !== 'VIDEO' && (
                                <Image
                                    src={post.media_url}
                                    alt={post.caption?.substring(0, 100) || 'Instagram post'}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            {post.media_type === 'VIDEO' && (
                                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                    <InstagramIcon size={60} className="text-white/50" />
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                                <ExternalLink
                                    size={32}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                                />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a
                        href="https://www.instagram.com/babyheavenhn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105"
                    >
                        <InstagramIcon size={20} />
                        <span>Ver Más en Instagram</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
