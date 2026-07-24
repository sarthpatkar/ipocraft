const fs = require('fs');
const path = require('path');

const PAGES = [
  'app/ipo/page.tsx',
  'app/gmp/page.tsx',
  'app/ipo-calendar/page.tsx',
  'app/brokers/page.tsx',
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/disclaimer/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/what-is-ipo-gmp/page.tsx',
  'app/how-ipo-allotment-works/page.tsx',
  'app/qib-hni-retail-explained/page.tsx',
  'app/ipo-subscription-meaning/page.tsx',
  'app/ipo-grey-market-guide/page.tsx',
];

let totalChanges = 0;

PAGES.forEach(relPath => {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log('SKIP (not found):', relPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;
  
  // Replace import
  content = content.replace(
    /import\s*\{[^}]*Playfair_Display[^}]*\}\s*from\s*["']next\/font\/google["'];?/g,
    (match) => match.replace('Playfair_Display', 'Outfit')
  );
  
  // Replace font instantiation
  content = content.replace(/const\s+playfair\s*=\s*Playfair_Display\s*\(/g, 'const outfit = Outfit(');
  content = content.replace(/variable:\s*["']--font-playfair["']/g, 'variable: "--font-outfit"');
  
  // Replace all variable references
  content = content.replace(/playfair\.variable/g, 'outfit.variable');
  content = content.replace(/var\(--font-playfair\)/g, 'var(--font-outfit)');
  // Also handle the serif fallback
  content = content.replace(/var\(--font-playfair\),\s*serif/g, 'var(--font-outfit)');
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    totalChanges++;
    console.log('UPDATED:', relPath);
  } else {
    console.log('NO CHANGES:', relPath);
  }
});

console.log(`\nTotal files updated: ${totalChanges}`);
