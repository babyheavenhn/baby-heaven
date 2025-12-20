const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const categories = [
  { name: 'Baby Tech', slug: 'baby-tech', order: 1 },
  { name: 'Alimentación', slug: 'alimentacion', order: 2 },
  { name: 'Higiene & Salud', slug: 'higiene-salud', order: 3 },
  { name: 'Biberones', slug: 'biberones', order: 4 },
  { name: 'Aprendizaje', slug: 'aprendizaje', order: 5 },
  { name: 'Essenciales', slug: 'essenciales', order: 6 },
  { name: 'Accesorios', slug: 'accesorios', order: 7 },
  { name: 'Juguetes', slug: 'juguetes', order: 8 },
  { name: 'Catálogo', slug: 'catalogo', order: 9 },
  { name: 'Ropa Niña', slug: 'ropa-nina', order: 10 },
  { name: 'Ropa Niño', slug: 'ropa-nino', order: 11 },
];

async function createCategories() {
  console.log('🏷️  Creando categorías en Sanity...\n');

  let created = 0;
  let skipped = 0;

  for (const category of categories) {
    try {
      // Check if category already exists
      const existing = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: category.slug }
      );

      if (existing) {
        console.log(`⏭️  Ya existe: ${category.name}`);
        skipped++;
        continue;
      }

      // Create category
      await client.create({
        _type: 'category',
        name: category.name,
        slug: {
          _type: 'slug',
          current: category.slug
        },
        order: category.order
      });

      console.log(`✅ Creada: ${category.name}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creando ${category.name}: ${error.message}`);
    }
  }

  console.log(`\n🎉 Proceso completado!`);
  console.log(`   ✅ Creadas: ${created}`);
  console.log(`   ⏭️  Ya existían: ${skipped}`);
}

createCategories().catch(console.error);
