import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Categoría',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre de la Categoría',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Imagen de Fondo',
            type: 'image',
            description: 'Imagen de fondo para la tarjeta de categoría en la página principal',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'buttonText',
            title: 'Texto del Botón',
            type: 'string',
            initialValue: 'Ver Productos',
        }),
        defineField({
            name: 'order',
            title: 'Orden',
            type: 'number',
            description: 'Orden de aparición (menor número aparece primero)',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'backgroundImage',
        },
    },
})
