import fs from 'fs';
import path from 'path';

const files = [
  'server/seed/products_part1.ts',
  'server/seed/products_part2.ts',
  'server/seed/products_part3.ts'
];

for (const relPath of files) {
  const fullPath = path.resolve(process.cwd(), relPath);
  let content = fs.readFileSync(fullPath, 'utf-8');

  // Regex to match each product object
  // A product block starts with { and has slug: "..."
  const regex = /{\s*name:\s*"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?images:\s*\[[\s\S]*?\]\s*,\s*thumbnail:\s*"[^"]*"/g;

  let replacedCount = 0;
  content = content.replace(regex, (match, slug) => {
    replacedCount++;
    // Replace the images and thumbnail inside this match
    let updated = match.replace(/images:\s*\[[\s\S]*?\]/, `images: [\n      "/images/products/${slug}.svg"\n    ]`);
    updated = updated.replace(/thumbnail:\s*"[^"]*"/, `thumbnail: "/images/products/${slug}.svg"`);
    return updated;
  });

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`Updated ${replacedCount} products in ${relPath}`);
}
