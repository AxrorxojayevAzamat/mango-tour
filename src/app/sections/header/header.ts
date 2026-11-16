import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import type { NavContent } from '../../../content/content.model';
import { NAV_IDS } from '../../../content/ids';
import { SITE_CONFIG } from '../../../content/site-config';
import { Lang } from '../../core/i18n/languages';
import { Icon } from '../../shared/icon/icon';
import { LangSwitcher } from '../lang-switcher/lang-switcher';

/** Viewport width from which the menu is shown inline (keep in sync with `bp.up(lg)`). */
const DESKTOP_QUERY = '(min-width: 1024px)';
const SCROLLED_OFFSET = 8;
/** Breathing room between the fixed header and a section scrolled into view. */
const ANCHOR_GAP = 16;

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, Icon, LangSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'onEscape()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly lang = input.required<Lang>();
  readonly nav = input.required<NavContent>();
  /** Two-way bound so the page can make everything behind the open menu `inert`. */
  readonly menuOpen = model(false);

  protected readonly navIds = NAV_IDS;
  protected readonly config = SITE_CONFIG;
  protected readonly scrolled = signal(false);

  private readonly burger = viewChild.required<ElementRef<HTMLButtonElement>>('burger');
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  private readonly document = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);
    const scroller = inject(ViewportScroller);

    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;

      // The router scrolls to `#anchors` itself and ignores CSS scroll-padding, so tell it
      // how tall the fixed header is.
      scroller.setOffset(() => [0, this.bar().nativeElement.offsetHeight + ANCHOR_GAP]);

      const onScroll = () => this.scrolled.set(view.scrollY > SCROLLED_OFFSET);
      onScroll();
      view.addEventListener('scroll', onScroll, { passive: true });

      // A menu left open while resizing to desktop would keep the page inert.
      const desktop = view.matchMedia(DESKTOP_QUERY);
      const onBreakpoint = (e: MediaQueryListEvent) => e.matches && this.menuOpen.set(false);
      desktop.addEventListener('change', onBreakpoint);

      destroyRef.onDestroy(() => {
        view.removeEventListener('scroll', onScroll);
        desktop.removeEventListener('change', onBreakpoint);
      });
    });

    // Lock page scroll behind the full-screen mobile menu.
    effect(() => {
      this.document.documentElement.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  protected href(anchor: string): string {
    return `/${this.lang()}#${anchor}`;
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.burger().nativeElement.focus();
  }
}
