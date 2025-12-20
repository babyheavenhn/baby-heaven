const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixLongSlugs() {
  console.log('🔍 Searching for products with long slugs...\n');

  // Get all products
  const products = await client.fetch(`*[_type == "product"]{ _id, name, slug }`);

  let fixed = 0;
  const maxSlugLength = 110;

  for (const product of products) {
    const currentSlug = product.slug.current;
    
    // Check if slug is too long
    if (currentSlug.length > maxSlugLength) {
      const newSlug = currentSlug.substring(0, maxSlugLength);
      const newId = `product.${newSlug}`;
      
      console.log(`❌ Too long (${currentSlug.length} chars): ${product.name}`);
      console.log(`   Old slug: ${currentSlug}`);
      console.log(`   New slug: ${newSlug}`);
      
      try {
        // Delete the old document
        await client.delete(product._id);
        console.log(`   🗑️  Deleted old document`);
        
        // Create new document with shorter slug
        await client.create({
          _id: newId,
          _type: 'product',
          name: product.name,
          slug: {
            _type: 'slug',
            current: newSlug
          },
          // Add minimal required fields
          price: 0,
          currency: 'HNL',
          allowSpecialInstructions: true,
          isBestSeller: false,
          isFeatured: false
        });
        
        console.log(`   ✅ Created new document with shorter slug\n`);
        fixed++;
      } catch (error) {
        console.error(`   ❌ Failed to fix: ${error.message}\n`);
      }
    }
  }

  console.log(`\n🎉 Fixed ${fixed} product(s)`);
  
  if (fixed > 0) {
    console.log('\n⚠️  Note: You will need to re-import to restore full product data:');
    console.log('   node scripts/import-to-sanity.js sanity_products.ndjson');
  }
}

fixLongSlugs().catch(console.error);
