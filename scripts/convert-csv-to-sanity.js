const fs = require('fs');
const csv = require('csv-parser');

/**
 * Remove HTML tags from text
 */
function cleanHtml(rawHtml) {
  if (typeof rawHtml !== 'string') {
    return '';
  }
  // Remove HTML tags
  const cleanText = rawHtml.replace(/<.*?>/g, '');
  return cleanText.trim();
}

/**
 * Convert Shopify CSV export to Sanity NDJSON format
 */
async function convertCsvToSanity(csvPath, outputPath) {
  const rows = [];
  
  // Read CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Read ${rows.length} rows from CSV`);

  // Group by Handle (product identifier)
  const grouped = {};
  rows.forEach(row => {
    const handle = row.Handle;
    if (!handle) return;
    
    if (!grouped[handle]) {
      grouped[handle] = [];
    }
    grouped[handle].push(row);
  });

  const sanityDocs = [];

  // Process each product group
  for (const [handle, group] of Object.entries(grouped)) {
    const firstRow = group[0];
    
    // Extract title and body from the first valid row in the group
    const titleRow = group.find(row => row.Title && row.Title.trim() !== '');
    if (!titleRow) {
      continue;
    }

    const title = titleRow.Title;
    const bodyHtml = titleRow['Body (HTML)'] || '';
    const basePrice = parseFloat(firstRow['Variant Price']) || 0;

    // Clean description
    const descriptionText = cleanHtml(bodyHtml);

    // Shorten handle if too long (Sanity doc ID limit is 128 chars total)
    // Need to account for "drafts.product." prefix (15 chars) when editing in Studio
    let sanitizedHandle = handle;
    const maxSlugLength = 110; // 128 - 15 for "drafts.product." prefix - 3 for safety
    if (sanitizedHandle.length > maxSlugLength) {
      sanitizedHandle = handle.substring(0, maxSlugLength);
    }

    // Construct Portable Text for detailedDescription
    const detailedDescription = descriptionText ? [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            marks: [],
            text: descriptionText
          }
        ],
        markDefs: []
      }
    ] : [];

    // Process Options (Variants)
    const optionsList = [];
    
    for (let i = 1; i <= 3; i++) {
      const optNameCol = `Option${i} Name`;
      const optValCol = `Option${i} Value`;
      
      const optName = firstRow[optNameCol];
      
      // Skip default Shopify title for single-variant products
      if (optName === 'Title' && group[0][optValCol] === 'Default Title') {
        continue;
      }
      
      if (optName && optName.trim() !== '') {
        const choices = [];
        
        // Get unique values and prices for this option
        const uniqueValues = new Map();
        
        group.forEach(row => {
          const val = row[optValCol];
          const variantPrice = parseFloat(row['Variant Price']);
          
          if (val && val.trim() !== '' && !uniqueValues.has(val)) {
            uniqueValues.set(val, variantPrice);
          }
        });

        // Build choices array
        uniqueValues.forEach((variantPrice, val) => {
          // Calculate extra price relative to base price
          const extraPrice = !isNaN(variantPrice) && !isNaN(basePrice) 
            ? variantPrice - basePrice 
            : 0;
          
          choices.push({
            label: String(val),
            extraPrice: extraPrice > 0 ? extraPrice : 0
          });
        });

        if (choices.length > 0) {
          optionsList.push({
            _key: `${handle}-${optName}`,
            name: optName,
            required: true,
            multiple: false,
            choices: choices
          });
        }
      }
    }

    // Construct the Sanity Document (images will be added manually in Sanity)
    const doc = {
      _type: 'product',
      _id: `product.${sanitizedHandle}`,
      name: title,
      slug: {
        _type: 'slug',
        current: sanitizedHandle
      },
      price: basePrice,
      currency: 'HNL',
      description: descriptionText || 'Sin descripción',
      detailedDescription: detailedDescription,
      inStock: true,
      stock: 10,
      allowSpecialInstructions: true,
      isBestSeller: false,
      isFeatured: false
    };

    // Only add options if they exist
    if (optionsList.length > 0) {
      doc.options = optionsList;
    }

    sanityDocs.push(doc);
  }

  // Write to NDJSON
  const ndjsonContent = sanityDocs.map(doc => JSON.stringify(doc)).join('\n');
  fs.writeFileSync(outputPath, ndjsonContent, 'utf-8');

  console.log(`✅ Successfully converted ${sanityDocs.length} products to ${outputPath}`);
  console.log(`📝 Output saved to: ${outputPath}`);
  console.log(`\n⚠️  Note: Images must be added manually in Sanity Studio`);
  return sanityDocs;
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const csvPath = args[0] || 'products_export_1.csv';
  const outputPath = args[1] || 'sanity_products.ndjson';

  console.log(`📂 Reading from: ${csvPath}`);
  console.log(`💾 Writing to: ${outputPath}\n`);

  convertCsvToSanity(csvPath, outputPath)
    .then(() => {
      console.log('\n🎉 Conversion complete!');
      console.log('\nNext steps:');
      console.log('1. Review the generated sanity_products.ndjson file');
      console.log('2. Import to Sanity using: sanity dataset import sanity_products.ndjson production');
      console.log('3. Add product images manually in Sanity Studio');
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = { convertCsvToSanity, cleanHtml };
