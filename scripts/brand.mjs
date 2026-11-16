// Generates every logo/icon variant from docs/brand/logo-source.jpg and
// src/assets/brand/mango-mark.svg. Re-run with `npm run brand` after changing either.
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const SOURCE = 'docs/brand/logo-source.jpg';
const MARK_SVG = 'src/assets/brand/mango-mark.svg';
const OUT = 'public';

const COLORS = { bg: '#0B0B0B', orange: '#EA8430', leaf: '#7A853E', cream: [246, 233, 209] };

// Source-image geometry (px). The mark SVG's viewBox origin maps to SOURCE_MARK_ORIGIN.
const WORDMARK_CROP = { left: 372, top: 580, width: 650, height: 116 };
const SOURCE_MARK_ORIGIN = { x: 230, y: 525 };
export const HEADER_LOGO_WIDTHS = [240, 480, 720];

/** Mango + leaf only: the arc and plane disappear at favicon sizes. */
const fruitPaths = (await readFile(MARK_SVG, 'utf8'))
  .split('\n')
  .filter((line) => line.includes('M87 80') || line.includes('M82 85'))
  .join('\n');

const iconSvg = ({
  size,
  radius,
}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="${radius}" fill="${COLORS.bg}"/>
  <g transform="translate(1.55 -14.6) scale(0.42)">${fruitPaths}</g>
</svg>`;

/** Keys the near-black background out of the cream wordmark → transparent PNG. */
async function extractWordmark() {
  const { data, info } = await sharp(SOURCE)
    .extract(WORDMARK_CROP)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [cr, cg, cb] = COLORS.cream;
  const creamLuma = 0.299 * cr + 0.587 * cg + 0.114 * cb;
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    let alpha = Math.min(1, luma / creamLuma);
    if (alpha < 0.08) alpha = 0;
    rgba.set([cr, cg, cb, Math.round(alpha * 255)], j);
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/** Mark (vector, re-rendered) + wordmark (from source) on a transparent canvas. */
async function buildFullLogo(wordmark) {
  const scale = 2;
  const markMeta = { width: 272, height: 152, viewBoxY: 16 };
  const mark = await sharp(MARK_SVG, { density: 72 * scale })
    .png()
    .toBuffer();
  const wordmark2x = await sharp(wordmark)
    .resize({ width: WORDMARK_CROP.width * scale, kernel: 'lanczos3' })
    .toBuffer();
  const markTop = SOURCE_MARK_ORIGIN.y + markMeta.viewBoxY;
  const top = Math.min(markTop, WORDMARK_CROP.top);
  const right = WORDMARK_CROP.left + WORDMARK_CROP.width;
  const bottom = Math.max(markTop + markMeta.height, WORDMARK_CROP.top + WORDMARK_CROP.height);
  return sharp({
    create: {
      width: (right - SOURCE_MARK_ORIGIN.x) * scale,
      height: (bottom - top) * scale,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: mark, left: 0, top: (markTop - top) * scale },
      {
        input: wordmark2x,
        left: (WORDMARK_CROP.left - SOURCE_MARK_ORIGIN.x) * scale,
        top: (WORDMARK_CROP.top - top) * scale,
      },
    ])
    .png()
    .toBuffer()
    .then((buf) => sharp(buf).trim({ threshold: 1 }).png().toBuffer());
}

async function buildOgImage(logo) {
  const width = 1200;
  const height = 630;
  const logoPng = await sharp(logo).resize({ width: 760 }).toBuffer();
  const { height: logoHeight = 0 } = await sharp(logoPng).metadata();
  const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="glow" cx="30%" cy="40%" r="70%">
        <stop offset="0" stop-color="${COLORS.orange}" stop-opacity="0.18"/>
        <stop offset="1" stop-color="${COLORS.orange}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="${COLORS.bg}"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <path d="M-40 600 C 260 380, 700 300, 1260 330" stroke="${COLORS.orange}" stroke-opacity="0.22"
          stroke-width="2" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/>
  </svg>`;
  return sharp(Buffer.from(backdrop))
    .composite([
      { input: logoPng, left: (width - 760) / 2, top: Math.round((height - logoHeight) / 2) },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await mkdir(`${OUT}/brand`, { recursive: true });
  await mkdir(`${OUT}/icons`, { recursive: true });

  const wordmark = await extractWordmark();
  const logo = await buildFullLogo(wordmark);
  await sharp(logo).png({ compressionLevel: 9 }).toFile(`${OUT}/brand/logo.png`);
  await sharp(logo).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/brand/logo.webp`);
  // Header logo widths (1x/2x/3x of ~240px), named for the app's `{base}-{width}.webp` image loader.
  for (const width of HEADER_LOGO_WIDTHS) {
    await sharp(logo)
      .resize({ width, kernel: 'lanczos3' })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(`${OUT}/brand/logo-${width}.webp`);
  }

  await writeFile(`${OUT}/favicon.svg`, iconSvg({ size: 64, radius: 14 }));
  const icoSizes = await Promise.all(
    [16, 32, 48].map((size) =>
      sharp(Buffer.from(iconSvg({ size: 512, radius: 14 })))
        .resize(size)
        .png()
        .toBuffer(),
    ),
  );
  await writeFile(`${OUT}/favicon.ico`, await pngToIco(icoSizes));
  const square = (size) =>
    sharp(Buffer.from(iconSvg({ size: 512, radius: 0 })))
      .resize(size)
      .png({ compressionLevel: 9 });
  await square(180).toFile(`${OUT}/apple-touch-icon.png`);
  await square(192).toFile(`${OUT}/icons/icon-192.png`);
  await square(512).toFile(`${OUT}/icons/icon-512.png`);

  await writeFile(`${OUT}/og-image.png`, await buildOgImage(logo));
  console.log('brand assets written to', OUT);
}

await main();
