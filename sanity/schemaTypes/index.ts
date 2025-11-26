import { type SchemaTypeDefinition } from 'sanity'
import product from '../schemas/product'
import category from '../schemas/category'
import hero from '../schemas/hero'
import instagramPost from '../schemas/instagramPost'
import about from '../schemas/about'
import siteSettings from '../schemas/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, category, hero, instagramPost, about, siteSettings],
}
