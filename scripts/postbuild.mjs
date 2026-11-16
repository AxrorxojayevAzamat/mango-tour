// Post-processes the static build in dist/mango-tour/browser for Cloudflare Pages.
//
// Pages serves `uz/index.html` at `/uz/` (with a trailing-slash redirect), but our canonical
// URLs are `/uz`, `/en`, `/ru`. Pages serves `uz.html` at `/uz`, so flatten each language page.
import { readdir, rename, rmdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist/mango-tour/browser';
const LANGS = ['uz', 'en', 'ru'];

async function exists(path) {
  return stat(path).then(
    () => true,
    () => false,
  );
}

for (const lang of LANGS) {
  const dir = join(DIST, lang);
  const nested = join(dir, 'index.html');
  if (!(await exists(nested))) {
    throw new Error(`postbuild: expected prerendered page ${nested}`);
  }
  await rename(nested, join(DIST, `${lang}.html`));
  if ((await readdir(dir)).length === 0) {
    await rmdir(dir);
  }
}

console.log(`postbuild: flattened ${LANGS.map((l) => `${l}.html`).join(', ')}`);
