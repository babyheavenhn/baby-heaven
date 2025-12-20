const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function updateExistingProducts() {
  console.log('🔍 Buscando productos sin campos requeridos...\n');

  // Get all products
  const products = await client.fetch(`*[_type == "product"]{ _id, name, inStock, stock, description }`);

  console.log(`📦 Encontrados ${products.length} productos\n`);

  let updated = 0;

  for (const product of products) {
    const updates = {};
    let needsUpdate = false;

    // Check if inStock is missing
    if (product.inStock === undefined || product.inStock === null) {
      updates.inStock = true;
      needsUpdate = true;
    }

    // Check if stock is missing
    if (product.stock === undefined || product.stock === null) {
      updates.stock = 10;
      needsUpdate = true;
    }

    // Check if description is empty
    if (!product.description || product.description.trim() === '') {
      updates.description = 'Sin descripción';
      needsUpdate = true;
    }

    if (needsUpdate) {
      try {
        await client
          .patch(product._id)
          .set(updates)
          .commit();
        
        console.log(`✅ Actualizado: ${product.name}`);
        console.log(`   Cambios: ${JSON.stringify(updates)}\n`);
        updated++;
      } catch (error) {
        console.error(`❌ Error actualizando ${product.name}: ${error.message}\n`);
      }
    }
  }

  console.log(`\n🎉 Actualización completa!`);
  console.log(`   ✅ Productos actualizados: ${updated}`);
  console.log(`   ⏭️  Ya tenían los campos: ${products.length - updated}`);
}

updateExistingProducts().catch(console.error);
