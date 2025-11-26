import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Producto',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre del Producto',
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
            name: 'category',
            title: 'Categoría',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Precio',
            type: 'number',
            validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
            name: 'currency',
            title: 'Moneda',
            type: 'string',
            initialValue: 'HNL',
            options: {
                list: [
                    { title: 'Lempira (HNL)', value: 'HNL' },
                    { title: 'Dólar (USD)', value: 'USD' },
                ],
            },
        }),
        defineField({
            name: 'description',
            title: 'Descripción Corta',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'detailedDescription',
            title: 'Descripción Detallada',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
                {
                    type: 'image',
                },
            ],
            description: 'Descripción completa del producto con formato rico',
        }),
        defineField({
            name: 'image',
            title: 'Imagen Principal',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'gallery',
            title: 'Galería de Imágenes',
            type: 'array',
            of: [{ type: 'image' }],
            description: 'Imágenes adicionales del producto',
        }),
        defineField({
            name: 'inStock',
            title: 'En Stock',
            type: 'boolean',
            initialValue: true,
            description: 'Marcar como falso si el producto está agotado',
        }),
        defineField({
            name: 'stock',
            title: 'Cantidad en Stock (General)',
            type: 'number',
            initialValue: 0,
            description: 'Usar este campo si el producto NO tiene variantes. Si tiene variantes, usar el stock de cada variante.',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'variants',
            title: 'Variantes de Inventario',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Título',
                            type: 'string',
                            description: 'Ej: "Rojo / S"',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'stock',
                            title: 'Cantidad en Stock',
                            type: 'number',
                            initialValue: 0,
                            validation: (Rule) => Rule.required().min(0),
                        },
                        {
                            name: 'price',
                            title: 'Precio (Opcional)',
                            type: 'number',
                            description: 'Dejar vacío para usar el precio base del producto'
                        }
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            stock: 'stock',
                            price: 'price'
                        },
                        prepare({ title, stock, price }) {
                            return {
                                title: title,
                                subtitle: `Stock: ${stock} | Precio: ${price ? 'L. ' + price : 'Base'}`
                            }
                        }
                    }
                }
            ],
            description: 'Define las variantes específicas y su stock (Ej: Talla S / Rojo: 5 unidades). Si usas esto, el stock general será ignorado.'
        }),
        defineField({
            name: 'options',
            title: 'Opciones de Personalización',
            type: 'array',
            description: 'Opciones que el cliente puede seleccionar (ej: color, talla/meses, etc.)',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Nombre de la Opción',
                            type: 'string',
                            description: 'Ej: "Selecciona el color", "Talla (meses)"',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'required',
                            title: '¿Es Obligatorio?',
                            type: 'boolean',
                            initialValue: false,
                            description: 'Si es obligatorio, el cliente debe seleccionar una opción',
                        },
                        {
                            name: 'multiple',
                            title: '¿Permite Múltiples Selecciones?',
                            type: 'boolean',
                            initialValue: false,
                            description: 'Si está activado, el cliente puede seleccionar más de una opción',
                        },
                        {
                            name: 'choices',
                            title: 'Opciones Disponibles',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        {
                                            name: 'label',
                                            title: 'Nombre',
                                            type: 'string',
                                            description: 'Ej: "Azul", "0-3 meses", "Rosa"',
                                            validation: (Rule) => Rule.required(),
                                        },
                                        {
                                            name: 'extraPrice',
                                            title: 'Precio Extra',
                                            type: 'number',
                                            initialValue: 0,
                                            description: 'Costo adicional por esta opción (0 si no tiene costo)',
                                        },
                                    ],
                                    preview: {
                                        select: {
                                            label: 'label',
                                            price: 'extraPrice',
                                        },
                                        prepare({ label, price }) {
                                            return {
                                                title: label,
                                                subtitle: price > 0 ? `+L. ${price}` : 'Sin cargo extra',
                                            }
                                        },
                                    },
                                },
                            ],
                            validation: (Rule) => Rule.required().min(1),
                        },
                    ],
                    preview: {
                        select: {
                            name: 'name',
                            required: 'required',
                            multiple: 'multiple',
                        },
                        prepare({ name, required, multiple }) {
                            const badges = []
                            if (required) badges.push('Obligatorio')
                            if (multiple) badges.push('Múltiple')
                            return {
                                title: name,
                                subtitle: badges.length > 0 ? badges.join(' • ') : 'Opcional',
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'relatedProducts',
            title: 'Productos Relacionados',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            description: 'Productos similares o complementarios',
        }),
        defineField({
            name: 'isNew',
            title: 'Producto Nuevo',
            type: 'boolean',
            initialValue: false,
            description: 'Marcar si es un producto nuevo (aparecerá en la sección de nuevos)',
        }),
        defineField({
            name: 'createdAt',
            title: 'Fecha de Creación',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            category: 'category.name',
            inStock: 'inStock',
        },
        prepare({ title, media, category, inStock }) {
            return {
                title,
                subtitle: `${category || 'Sin categoría'} ${!inStock ? '(AGOTADO)' : ''}`,
                media,
            }
        },
    },
})
