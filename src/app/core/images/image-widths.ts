/**
 * Width ladder for every raster image (`{base}-{width}.webp`).
 * Dependency-free so build scripts (`scripts/images.mjs`) can import it too.
 */
export const IMAGE_WIDTHS = [240, 480, 720, 960, 1280, 1600, 1920] as const;
