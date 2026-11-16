import { TestBed } from '@angular/core/testing';
import { uz } from '../../../content/uz';
import { Lightbox, LightboxImage } from './lightbox';

const IMAGES: LightboxImage[] = [
  { base: 'images/gallery/a', alt: 'A' },
  { base: 'images/gallery/b', alt: 'B' },
  { base: 'images/gallery/c', alt: 'C' },
];

function setup() {
  // jsdom has no <dialog> modal support: stub the two methods the component uses.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };

  const fixture = TestBed.createComponent(Lightbox);
  fixture.componentRef.setInput('images', IMAGES);
  fixture.componentRef.setInput('labels', uz.gallery.lightbox);
  fixture.detectChanges();
  const el: HTMLElement = fixture.nativeElement;
  const dialog = el.querySelector('dialog')!;
  return { fixture, el, dialog, lightbox: fixture.componentInstance };
}

describe('Lightbox', () => {
  it('opens on the requested photo with its alt text and counter', () => {
    const { fixture, el, dialog, lightbox } = setup();
    lightbox.open(1);
    fixture.detectChanges();
    expect(dialog.open).toBe(true);
    expect(el.querySelector('img')!.getAttribute('alt')).toBe('B');
    expect(el.querySelector('img')!.getAttribute('src')).toBe('/images/gallery/b-1600.webp');
    expect(el.querySelector('.lightbox__counter')!.textContent).toBe('2 / 3');
  });

  it('wraps around with the arrow keys', () => {
    const { fixture, dialog, lightbox } = setup();
    lightbox.open(2);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(lightbox.index()).toBe(0);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(lightbox.index()).toBe(1);
    fixture.detectChanges();
  });

  it('closes from the close button and clears the photo', () => {
    const { fixture, el, dialog, lightbox } = setup();
    lightbox.open(0);
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.lightbox__close')!.click();
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
    expect(lightbox.index()).toBeNull();
    expect(el.querySelector('img')).toBeNull();
  });

  it('labels every control', () => {
    const { el } = setup();
    const labels = [...el.querySelectorAll('button')].map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual([
      uz.gallery.lightbox.close,
      uz.gallery.lightbox.previous,
      uz.gallery.lightbox.next,
    ]);
  });
});
