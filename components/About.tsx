import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

interface AboutProps {
    data?: any;
}

export default function About({ data }: AboutProps) {
    if (!data) {
        return null;
    }

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Image */}
                    <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        {data.image && (
                            <Image
                                src={urlFor(data.image).width(800).height(800).url()}
                                alt={data.title || 'About us'}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            {data.title}
                        </h2>
                        <div className="prose prose-lg max-w-none text-foreground/80 mb-8">
                            {data.description && (
                                <PortableText value={data.description} />
                            )}
                        </div>

                        {data.features && data.features.length > 0 && (
                            <div className="space-y-4">
                                {data.features.map((feature: any, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                                        <div>
                                            {feature.title && (
                                                <h3 className="font-semibold text-foreground mb-1">
                                                    {feature.title}
                                                </h3>
                                            )}
                                            {feature.description && (
                                                <p className="text-foreground/70">
                                                    {feature.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
