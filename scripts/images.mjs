// Responsive image pipeline.
//
//   src/assets/images/<group>/<name>.(jpg|jpeg|png|webp)   ← source (client photo or placeholder)
//   public/images/<group>/<name>-<width>.webp               ← generated, git-ignored
//
// Usage:
//   npm run images                 generate WebP ladders (runs before every build)
//   npm run images -- --placeholders   also create neutral placeholder SOURCES for any image
//                                      listed in site-config.ts that has no source yet
//
// The list of images comes from SITE_CONFIG.images (src/content/site-config.ts); widths come
// from IMAGE_WIDTHS, the same ladder the app's NgOptimizedImage loader requests.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { SITE_CONFIG } from '../src/content/site-config.ts';
import { IMAGE_WIDTHS } from '../src/app/core/images/image-widths.ts';

const SOURCE_ROOT = 'src/assets/images';
const OUTPUT_ROOT = 'public';
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const WEBP = { quality: 78, effort: 5 };
/** Content hash of each source at its last conversion (git-ignored), for incremental runs. */
const MANIFEST = '.cache/images-manifest.json';
/** Cache-busting versions for the app's image loader (`?v=<hash>`), git-ignored. */
const VERSIONS_OUT = 'src/app/core/images/image-versions.generated.ts';
/** Files outside the photo pipeline that the loader also serves (logo from `npm run brand`). */
const EXTRA_VERSIONED = { 'brand/logo': 'public/brand/logo.png' };

/** Recommended source size per group — also used for placeholders and docs/IMAGES.md. */
export const IMAGE_SPECS = {
  hero: { width: 1920, height: 1080 },
  cities: { width: 1600, height: 1200 },
  countries: { width: 1600, height: 1200 },
  gallery: { width: 1920, height: 1280 },
};

/** Flattens SITE_CONFIG.images into `images/<group>/<name>` bases. */
export function imageBases() {
  const { hero, ...groups } = SITE_CONFIG.images;
  return [hero, ...Object.values(groups).flatMap((group) => Object.values(group))];
}

const groupOf = (base) => base.split('/')[1];
const exists = (path) =>
  stat(path).then(
    (s) => s,
    () => null,
  );

async function findSource(base) {
  const relative = base.replace(/^images\//, '');
  for (const ext of SOURCE_EXTENSIONS) {
    const path = join(SOURCE_ROOT, relative + ext);
    if (await exists(path)) return path;
  }
  return null;
}

function placeholderSvg(base, { width, height }) {
  const label = `${base.replace(/^images\//, '')}  ·  ${width}×${height}`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2a2016"/>
        <stop offset="1" stop-color="#141414"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <path d="M${width * -0.05} ${height * 0.9} C ${width * 0.3} ${height * 0.45}, ${width * 0.65} ${height * 0.3}, ${width * 1.05} ${height * 0.28}"
          stroke="#ea8430" stroke-opacity="0.35" stroke-width="${Math.round(width / 600)}"
          stroke-dasharray="${width / 240} ${width / 60}" stroke-linecap="round" fill="none"/>
    <text x="${width * 0.97}" y="${height * 0.95}" text-anchor="end"
          font-family="Inter, DejaVu Sans, sans-serif" font-size="${Math.round(width / 55)}"
          fill="#bfb5a3" fill-opacity="0.75">${label}</text>
  </svg>`);
}

async function createPlaceholder(base) {
  const spec = IMAGE_SPECS[groupOf(base)];
  const path = join(SOURCE_ROOT, `${base.replace(/^images\//, '')}.jpg`);
  await mkdir(dirname(path), { recursive: true });
  await sharp(placeholderSvg(base, spec)).jpeg({ quality: 82, mozjpeg: true }).toFile(path);
  return path;
}

const hashOf = async (path) =>
  createHash('sha1')
    .update(await readFile(path))
    .digest('hex');

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

/** Fresh = same source bytes as last time (content hash, not mtime) and every output exists. */
async function isFresh(hash, previousHash, outputs) {
  if (hash !== previousHash) return false;
  for (const output of outputs) {
    if (!(await exists(output))) return false;
  }
  return true;
}

async function buildLadder(base, source, manifest) {
  const outBase = join(OUTPUT_ROOT, base);
  const outputs = [`${outBase}.webp`, ...IMAGE_WIDTHS.map((w) => `${outBase}-${w}.webp`)];
  const hash = await hashOf(source);
  if (await isFresh(hash, manifest[base], outputs)) return 0;
  manifest[base] = hash;
  await mkdir(dirname(outBase), { recursive: true });
  const image = sharp(source).rotate(); // honour EXIF orientation of phone photos
  await image
    .clone()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp(WEBP)
    .toFile(outputs[0]);
  await Promise.all(
    IMAGE_WIDTHS.map((width) =>
      // Smaller sources still get every file name the loader may request.
      image
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp(WEBP)
        .toFile(`${outBase}-${width}.webp`),
    ),
  );
  return outputs.length;
}

async function main() {
  const withPlaceholders = process.argv.includes('--placeholders');
  const missing = [];
  let written = 0;
  let created = 0;
  const manifest = await loadManifest();

  for (const base of imageBases()) {
    let source = await findSource(base);
    if (!source && withPlaceholders) {
      source = await createPlaceholder(base);
      created++;
    }
    if (!source) {
      missing.push(base);
      continue;
    }
    written += await buildLadder(base, source, manifest);
  }
  await mkdir(dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

  // A changed photo gets a new URL, so CDN/browser caches can hold images "forever".
  const versions = {};
  for (const base of imageBases()) if (manifest[base]) versions[base] = manifest[base].slice(0, 10);
  for (const [base, file] of Object.entries(EXTRA_VERSIONED)) {
    if (await exists(file)) versions[base] = (await hashOf(file)).slice(0, 10);
  }
  await writeFile(
    VERSIONS_OUT,
    `// GENERATED by scripts/images.mjs — do not edit, do not commit.\n` +
      `export const IMAGE_VERSIONS: Readonly<Record<string, string>> = ${JSON.stringify(versions, null, 2)};\n`,
  );

  if (missing.length) {
    throw new Error(
      `images: no source for ${missing.join(', ')} in ${SOURCE_ROOT}. ` +
        'Add the photo or run `npm run images -- --placeholders`.',
    );
  }
  const sources = (await readdir(SOURCE_ROOT, { recursive: true })).length;
  console.log(
    `images: ${imageBases().length} images (${sources} entries in ${SOURCE_ROOT}), ` +
      `${created} placeholders created, ${written} webp files written`,
  );
}

await main();
