import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Provider } from '@angular/core';
import { IMAGE_VERSIONS } from './image-versions.generated';
import { IMAGE_WIDTHS } from './image-widths';

export { IMAGE_WIDTHS };

/**
 * Every raster image is pre-generated at the IMAGE_WIDTHS ladder as `{base}-{width}.webp`
 * (`npm run images`). NgOptimizedImage asks for ladder widths in `fill`/`sizes` mode; for
 * fixed-size images it asks for width×density, which we snap up to the ladder.
 * `ngSrc` is the extension-less base path, e.g. `images/cities/samarkand`.
 */
export function createWebpLoader(versions: Readonly<Record<string, string>>) {
  return ({ src, width }: ImageLoaderConfig): string => {
    const key = src.replace(/^\/+/, '').replace(/\.webp$/, '');
    // Content-hash version → a replaced photo gets a new URL, so caches can be immutable.
    const query = versions[key] ? `?v=${versions[key]}` : '';
    if (!width) return `/${key}.webp${query}`;
    const snapped = IMAGE_WIDTHS.find((w) => w >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    return `/${key}-${snapped}.webp${query}`;
  };
}

export const webpLoader = createWebpLoader(IMAGE_VERSIONS);

export function provideWebpImageLoader(): Provider[] {
  return [
    { provide: IMAGE_LOADER, useValue: webpLoader },
    { provide: IMAGE_CONFIG, useValue: { breakpoints: [...IMAGE_WIDTHS] } },
  ];
}
