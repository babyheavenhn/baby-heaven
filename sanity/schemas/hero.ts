import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'hero',
    title: 'Hero (Sección Principal)',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtítulo',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Imagen de Fondo',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ctaButton',
            title: 'Botón de Acción',
            type: 'object',
            fields: [
                {
                    name: 'text',
                    title: 'Texto del Botón',
                    type: 'string',
                    initialValue: 'Ver Productos',
                },
                {
                    name: 'link',
                    title: 'Enlace',
                    type: 'string',
                    description: 'URL o ruta (ej: /products, #about)',
                    initialValue: '/products',
                },
            ],
        }),
        defineField({
            name: 'order',
            title: 'Orden',
            type: 'number',
            description: 'Orden de aparición en el carrusel',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            media: 'backgroundImage',
        },
    },
})
