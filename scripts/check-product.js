const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function checkProduct(slug) {
  console.log(`🔍 Verificando producto con slug: ${slug}\n`);

  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      inStock,
      stock,
      description,
      image,
      category,
      price
    }`,
    { slug }
  );

  if (!product) {
    console.log('❌ Producto no encontrado\n');
    return;
  }

  console.log('📦 Producto encontrado:');
  console.log(`   Nombre: ${product.name}`);
  console.log(`   ID: ${product._id}`);
  console.log(`   Slug: ${product.slug.current}`);
  console.log(`   Precio: ${product.price}`);
  console.log(`   En Stock: ${product.inStock}`);
  console.log(`   Cantidad Stock: ${product.stock}`);
  console.log(`   Descripción: ${product.description ? '✅' : '❌ Falta'}`);
  console.log(`   Imagen: ${product.image ? '✅' : '❌ Falta (REQUERIDO)'}`);
  console.log(`   Categoría: ${product.category ? '✅' : '❌ Falta (REQUERIDO)'}`);

  const missing = [];
  if (!product.image) missing.push('imagen');
  if (!product.category) missing.push('categoría');

  if (missing.length > 0) {
    console.log(`\n⚠️  PROBLEMA: El producto no aparecerá porque le falta: ${missing.join(', ')}`);
    console.log(`\n💡 Solución:`);
    console.log(`   1. Ve a Sanity Studio: http://localhost:3000/studio`);
    console.log(`   2. Busca el producto: "${product.name}"`);
    console.log(`   3. Agrega la imagen principal y selecciona una categoría`);
    console.log(`   4. Presiona "Publish"`);
  } else {
    console.log(`\n✅ El producto está completo y debería aparecer en la página`);
  }
}

const slug = process.argv[2] || 'juego-de-4-sabanas-de-cuna-para-nino';
checkProduct(slug).catch(console.error);
