import { copyFileSync, existsSync } from 'node:fs';

const src = 'dist/curso-ia-generativa/browser/index.html';
const dest = 'dist/curso-ia-generativa/browser/404.html';

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log('Successfully copied index.html to 404.html for SPA routing.');
} else {
  console.warn(`Source file ${src} not found for 404 fallback.`);
}
