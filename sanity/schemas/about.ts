import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'about',
    title: 'Sobre Nosotros',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'features',
            title: 'Características',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Título',
                            type: 'string',
                        },
                        {
                            name: 'description',
                            title: 'Descripción',
                            type: 'text',
                            rows: 2,
                        },
                    ],
                },
            ],
        }),
    ],
})
