const fs = require('fs');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function reimportProducts(ndjsonPath) {
  console.log('📂 Leyendo NDJSON...');
  const content = fs.readFileSync(ndjsonPath, 'utf-8');
  const products = content
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));

  console.log(`📦 Encontrados ${products.length} productos en el archivo\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      // Get existing product
      const existing = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{ _id, price }`,
        { slug: product.slug.current }
      );

      if (!existing) {
        console.log(`⏭️  No existe en Sanity: ${product.name}`);
        skipped++;
        continue;
      }

      // Only update if price is 0 or different
      if (existing.price === 0 || existing.price !== product.price) {
        await client
          .patch(existing._id)
          .set({
            price: product.price,
            description: product.description,
            detailedDescription: product.detailedDescription,
            options: product.options || [],
          })
          .commit();

        console.log(`✅ Actualizado: ${product.name} (Precio: L. ${product.price})`);
        updated++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`❌ Error con ${product.name}: ${error.message}`);
    }
  }

  console.log(`\n🎉 Completado!`);
  console.log(`   ✅ Actualizados: ${updated}`);
  console.log(`   ⏭️  Sin cambios: ${skipped}`);
}

reimportProducts('sanity_products.ndjson').catch(console.error);
