import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Baby Heaven Honduras',
        short_name: 'Baby Heaven',
        description: 'Productos que te harán la crianza de tu bebé más fácil. Todo para tu bebé en Honduras.',
        start_url: '/',
        display: 'standalone',
        background_color: '#fef3e7',
        theme_color: '#ff6b9d',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
