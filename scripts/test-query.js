const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function testQuery() {
  console.log('🔍 Probando el query exacto que usa la página...\n');

  const PRODUCTS_QUERY = `*[_type == "product" && inStock == true] | order(_createdAt desc)[0...10]{
    _id,
    name,
    slug,
    description,
    price,
    currency,
    image,
    category->{name, slug},
    inStock,
    isBestSeller,
    isFeatured
  }`;

  const products = await client.fetch(PRODUCTS_QUERY);

  console.log(`📦 Productos encontrados: ${products.length}\n`);

  if (products.length > 0) {
    console.log('Primeros 3 productos:\n');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Precio: L. ${p.price}`);
      console.log(`   Imagen: ${p.image ? '✅' : '❌'}`);
      console.log(`   Categoría: ${p.category ? `✅ ${p.category.name}` : '❌'}`);
      console.log(`   inStock: ${p.inStock}\n`);
    });
  } else {
    console.log('❌ No se encontraron productos!\n');
    
    // Check all products without inStock filter
    const allProducts = await client.fetch(`*[_type == "product"][0...5]{ _id, name, inStock }`);
    console.log(`Total de productos (sin filtro): ${allProducts.length}`);
    if (allProducts.length > 0) {
      console.log('\nPrimeros 5 productos (sin filtro de inStock):');
      allProducts.forEach(p => {
        console.log(`  - ${p.name} (inStock: ${p.inStock})`);
      });
    }
  }
}

testQuery().catch(console.error);
