import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Provider } from '@angular/core';

/**
 * Every raster image is pre-generated at these widths as `{base}-{width}.webp`
 * (see scripts/). NgOptimizedImage asks for these widths in `fill`/`sizes` mode;
 * for fixed-size images it asks for width×density, which we snap up to the ladder.
 */
export const IMAGE_WIDTHS = [240, 480, 720, 960, 1280, 1600, 1920] as const;

/** `ngSrc` is the extension-less base path, e.g. `images/cities/samarkand`. */
export function webpLoader({ src, width }: ImageLoaderConfig): string {
  const base = `/${src.replace(/^\/+/, '').replace(/\.webp$/, '')}`;
  if (!width) {
    return `${base}.webp`;
  }
  const snapped = IMAGE_WIDTHS.find((w) => w >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `${base}-${snapped}.webp`;
}

export function provideWebpImageLoader(): Provider[] {
  return [
    { provide: IMAGE_LOADER, useValue: webpLoader },
    { provide: IMAGE_CONFIG, useValue: { breakpoints: [...IMAGE_WIDTHS] } },
  ];
}
