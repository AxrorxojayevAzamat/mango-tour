import { createWebpLoader } from './image-loader';

const webpLoader = createWebpLoader({});

describe('webpLoader', () => {
  it('returns the original webp when no width is requested', () => {
    expect(webpLoader({ src: 'brand/logo' })).toBe('/brand/logo.webp');
  });

  it('uses the exact ladder width when it matches', () => {
    expect(webpLoader({ src: 'images/hero', width: 1280 })).toBe('/images/hero-1280.webp');
  });

  it('snaps density-multiplied widths up to the next ladder step', () => {
    expect(webpLoader({ src: 'brand/logo', width: 456 })).toBe('/brand/logo-480.webp');
  });

  it('caps at the largest ladder width', () => {
    expect(webpLoader({ src: 'images/hero', width: 3840 })).toBe('/images/hero-1920.webp');
  });

  it('tolerates leading slashes and a .webp extension', () => {
    expect(webpLoader({ src: '/brand/logo.webp', width: 240 })).toBe('/brand/logo-240.webp');
  });

  it('appends the content-hash version so replaced photos get a new URL', () => {
    const versioned = createWebpLoader({ 'images/cities/khiva': 'abc123' });
    expect(versioned({ src: 'images/cities/khiva', width: 720 })).toBe(
      '/images/cities/khiva-720.webp?v=abc123',
    );
    expect(versioned({ src: 'images/cities/khiva' })).toBe('/images/cities/khiva.webp?v=abc123');
    expect(versioned({ src: 'images/cities/nukus', width: 720 })).toBe(
      '/images/cities/nukus-720.webp',
    );
  });
});
