const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-11-26',
  useCdn: false,
});

async function checkCategories() {
  const categories = await client.fetch('*[_type == "category"] | order(order asc){ name, slug, order }');
  
  console.log(`📂 Categorías en Sanity: ${categories.length}\n`);
  
  categories.forEach(c => {
    console.log(`  ${c.order}. ${c.name} (slug: ${c.slug.current})`);
  });
}

checkCategories();
