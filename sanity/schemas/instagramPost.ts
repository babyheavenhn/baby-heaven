import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'instagramPost',
    title: 'Instagram Post',
    type: 'document',
    fields: [
        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            validation: (Rule) => Rule.required(),
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'caption',
            title: 'Descripción',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'link',
            title: 'Enlace a Instagram',
            type: 'url',
            description: 'URL del post en Instagram',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Fecha de Publicación',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'caption',
            media: 'image',
            date: 'publishedAt',
        },
        prepare({ title, media, date }) {
            return {
                title: title || 'Sin descripción',
                subtitle: new Date(date).toLocaleDateString('es-HN'),
                media,
            }
        },
    },
})
