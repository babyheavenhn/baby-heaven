import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export { client, urlFor }

// GROQ queries
export const HERO_QUERY = `*[_type == "hero"] | order(order asc)`

export const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc)`

export const TWO_CATEGORIES_QUERY = `*[_type == "category"] | order(order asc)[0...2]`

export const PRODUCTS_QUERY = `*[_type == "product" && inStock == true] | order(createdAt desc){
  _id,
  name,
  slug,
  description,
  price,
  currency,
  image,
  category->{name, slug},
  inStock,
  isNew
}`

export const NEW_PRODUCTS_QUERY = `*[_type == "product" && inStock == true && dateTime(createdAt) > dateTime(now()) - 60*60*24*30] | order(createdAt desc)[0...6]{
  _id,
  name,
  slug,
  description,
  price,
  currency,
  image,
  category->{name, slug},
  inStock
}`

export const NEWEST_PRODUCTS_FALLBACK_QUERY = `*[_type == "product" && inStock == true] | order(createdAt desc)[0...6]{
  _id,
  name,
  slug,
  description,
  price,
  currency,
  image,
  category->{name, slug},
  inStock
}`

export const CATEGORY_PRODUCTS_QUERY = `*[_type == "product" && category._ref == $categoryId && inStock == true] | order(createdAt desc){
  _id,
  name,
  slug,
  description,
  price,
  currency,
  image,
  category->{name, slug},
  inStock
}`

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  description,
  detailedDescription,
  price,
  currency,
  image,
  "gallery": gallery[].asset->url,
  "options": options[],
  "variants": variants[]{
    title,
    stock,
    price
  },
  "relatedProducts": relatedProducts[]->{
    _id,
    name,
    slug,
    price,
    image,
    category->{name, slug}
  },
  inStock,
  stock
}`

export const INSTAGRAM_POSTS_QUERY = `*[_type == "instagramPost"] | order(publishedAt desc)[0...4]{
  _id,
  image,
  caption,
  link
}`

export const ABOUT_QUERY = `*[_type == "about"][0]{
  title,
  description,
  image,
  features
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  description,
  logo,
  phone,
  email,
  socialMedia,
  shippingInfo,
  paymentMethods
}`
