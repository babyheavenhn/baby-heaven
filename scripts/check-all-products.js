const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function checkAllProducts() {
  console.log('🔍 Verificando TODOS los productos...\n');

  const products = await client.fetch(`*[_type == "product"]{
    _id,
    name,
    slug,
    inStock,
    image,
    category
  }`);

  console.log(`📦 Total de productos en Sanity: ${products.length}\n`);

  const withImage = products.filter(p => p.image);
  const withCategory = products.filter(p => p.category);
  const inStock = products.filter(p => p.inStock === true);
  const complete = products.filter(p => p.image && p.category && p.inStock === true);

  console.log(`✅ Con imagen: ${withImage.length}/${products.length}`);
  console.log(`✅ Con categoría: ${withCategory.length}/${products.length}`);
  console.log(`✅ En stock (inStock=true): ${inStock.length}/${products.length}`);
  console.log(`✅ Completos (imagen + categoría + inStock): ${complete.length}/${products.length}\n`);

  const incomplete = products.filter(p => !p.image || !p.category || p.inStock !== true);

  if (incomplete.length > 0) {
    console.log(`⚠️  Productos incompletos (${incomplete.length}):\n`);
    incomplete.slice(0, 10).forEach(p => {
      const missing = [];
      if (!p.image) missing.push('imagen');
      if (!p.category) missing.push('categoría');
      if (p.inStock !== true) missing.push('inStock');
      console.log(`   ❌ ${p.name}`);
      console.log(`      Falta: ${missing.join(', ')}\n`);
    });

    if (incomplete.length > 10) {
      console.log(`   ... y ${incomplete.length - 10} más\n`);
    }
  }

  console.log(`\n📊 Query que usa la página:`);
  console.log(`   *[_type == "product" && inStock == true]`);
  console.log(`\n💡 Los productos deben tener:`);
  console.log(`   1. inStock = true ✅`);
  console.log(`   2. Imagen (requerido por schema) ${withImage.length === products.length ? '✅' : '❌'}`);
  console.log(`   3. Categoría (requerido por schema) ${withCategory.length === products.length ? '✅' : '❌'}`);
}

checkAllProducts().catch(console.error);
