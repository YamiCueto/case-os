import fs from 'node:fs';

const envLocalPath = '.env.local';
const targetDir = 'src/environments';
const targetFile = 'src/environments/environment.local.ts';
const fallbackProdFile = 'src/environments/environment.ts';

let url = '';
let key = '';

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (k === 'SUPABASE_URL') {
        url = v;
      } else if (k === 'SUPABASE_ANON_KEY') {
        key = v;
      }
    }
  }
} else {
  url = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.trim() : '';
  key = process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.trim() : '';
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const localContent = `export const environment = {
  production: false,
  supabaseUrl: '${url}',
  supabaseAnonKey: '${key}',
};
`;

const prodDefaultContent = `export const environment = {
  production: true,
  supabaseUrl: '${url}',
  supabaseAnonKey: '${key}',
};
`;

fs.writeFileSync(targetFile, localContent, 'utf8');
if (!fs.existsSync(fallbackProdFile)) {
  fs.writeFileSync(fallbackProdFile, prodDefaultContent, 'utf8');
}

console.log(`Local environment prepared: url=${url ? 'configured' : 'empty (offline mode)'}, key=${key ? 'configured' : 'empty'}`);
