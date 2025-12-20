const fs = require('fs');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-26',
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to .env.local
  useCdn: false,
});

async function importProducts(ndjsonPath) {
  console.log('📂 Reading NDJSON file...');
  const content = fs.readFileSync(ndjsonPath, 'utf-8');
  const products = content
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));

  console.log(`Found ${products.length} products to import\n`);

  let successful = 0;
  let failed = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      // Check if product already exists
      const existing = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: product.slug.current }
      );

      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${product.name}`);
        skipped++;
        continue;
      }

      await client.create(product);
      console.log(`✅ Imported: ${product.name}`);
      successful++;
    } catch (error) {
      console.error(`❌ Failed: ${product.name}`, error.message);
      failed++;
    }
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
}

// CLI execution
if (require.main === module) {
  const ndjsonPath = process.argv[2] || 'sanity_products.ndjson';

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found in .env.local');
    console.log('\nTo fix this:');
    console.log('1. Go to https://www.sanity.io/manage');
    console.log('2. Select your project');
    console.log('3. Go to API → Tokens');
    console.log('4. Create a new token with "Editor" permissions');
    console.log('5. Add to .env.local: SANITY_API_TOKEN=your-token-here\n');
    process.exit(1);
  }

  importProducts(ndjsonPath)
    .catch(error => {
      console.error('❌ Import failed:', error);
      process.exit(1);
    });
}

module.exports = { importProducts };
