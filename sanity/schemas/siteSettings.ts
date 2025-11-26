import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Configuración del Sitio',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título del Sitio',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción del Sitio',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'phone',
            title: 'Número de WhatsApp',
            type: 'string',
            description: 'Número de teléfono con código de país (ej: +50412345678)',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Correo Electrónico',
            type: 'string',
        }),
        defineField({
            name: 'socialMedia',
            title: 'Redes Sociales',
            type: 'object',
            fields: [
                { name: 'facebook', title: 'URL de Facebook', type: 'url' },
                { name: 'instagram', title: 'URL de Instagram', type: 'url' },
            ],
        }),
        defineField({
            name: 'shippingInfo',
            title: 'Información de Envío',
            type: 'object',
            fields: [
                {
                    name: 'freeShippingThreshold',
                    title: 'Envío Gratis Sobre',
                    type: 'number',
                    description: 'Monto mínimo para envío gratis (en Lempiras)',
                    initialValue: 0,
                },
                {
                    name: 'defaultShippingCost',
                    title: 'Costo de Envío Predeterminado',
                    type: 'number',
                    description: 'Costo de envío estándar (en Lempiras)',
                    initialValue: 120,
                },
            ],
        }),
        defineField({
            name: 'paymentMethods',
            title: 'Métodos de Pago',
            type: 'object',
            fields: [
                {
                    name: 'banks',
                    title: 'Bancos para Transferencia',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                {
                                    name: 'bankName',
                                    title: 'Nombre del Banco',
                                    type: 'string',
                                    validation: (Rule) => Rule.required(),
                                },
                                {
                                    name: 'accountNumber',
                                    title: 'Número de Cuenta',
                                    type: 'string',
                                    validation: (Rule) => Rule.required(),
                                },
                                {
                                    name: 'accountHolder',
                                    title: 'Titular de la Cuenta',
                                    type: 'string',
                                    validation: (Rule) => Rule.required(),
                                },
                                {
                                    name: 'accountId',
                                    title: 'ID/RTN del Titular',
                                    type: 'string',
                                },
                            ],
                            preview: {
                                select: {
                                    title: 'bankName',
                                    subtitle: 'accountNumber',
                                },
                            },
                        },
                    ],
                },
            ],
        }),
    ],
})
