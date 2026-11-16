import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

const DURATION_MS = 600;
const OFFSET_PX = 24;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'; // --ease-out

/**
 * Fades + lifts an element in the first time it scrolls into view.
 *
 * - Pure Web Animations API: no global CSS, nothing to style per component.
 * - Progressive: prerendered HTML is fully visible; only elements that start BELOW the
 *   viewport are hidden after hydration, so nothing on screen ever flickers.
 * - Respects `prefers-reduced-motion` (does nothing) and browsers without IntersectionObserver.
 */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  /** Stagger delay in ms, e.g. `[revealDelay]="$index * 80"`. */
  readonly revealDelay = input(0);

  constructor() {
    const element: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const view = element.ownerDocument.defaultView;
      if (
        !view ||
        typeof view.IntersectionObserver !== 'function' ||
        typeof element.animate !== 'function' ||
        view.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        element.getBoundingClientRect().top < view.innerHeight
      ) {
        return;
      }

      element.style.opacity = '0';
      const observer = new view.IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          element.animate(
            [
              { opacity: 0, transform: `translateY(${OFFSET_PX}px)` },
              { opacity: 1, transform: 'none' },
            ],
            { duration: DURATION_MS, delay: this.revealDelay(), easing: EASING, fill: 'backwards' },
          );
          element.style.opacity = '';
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
