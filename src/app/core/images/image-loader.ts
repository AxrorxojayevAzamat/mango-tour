import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Provider } from '@angular/core';
import { IMAGE_WIDTHS } from './image-widths';

export { IMAGE_WIDTHS };

/**
 * Every raster image is pre-generated at the IMAGE_WIDTHS ladder as `{base}-{width}.webp`
 * (`npm run images`). NgOptimizedImage asks for ladder widths in `fill`/`sizes` mode; for
 * fixed-size images it asks for width×density, which we snap up to the ladder.
 * `ngSrc` is the extension-less base path, e.g. `images/cities/samarkand`.
 */
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
