import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { GalleryContent } from '../../../content/content.model';
import { fill } from '../../core/i18n/fill';
import { webpLoader } from '../../core/images/image-loader';
import { Icon } from '../icon/icon';

export interface LightboxImage {
  /** Extension-less image base, as used by the WebP loader. */
  readonly base: string;
  readonly alt: string;
}

const SWIPE_THRESHOLD_PX = 50;
const SRCSET_WIDTHS = [960, 1280, 1600, 1920];

/**
 * Full-screen photo viewer on a native <dialog>: focus is trapped, Escape closes,
 * the page behind is inert, and focus returns to the opening button on close.
 * Extra keys: ← / → (wrap around). Touch: swipe left/right.
 */
@Component({
  selector: 'app-lightbox',
  imports: [Icon],
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lightbox {
  readonly images = input.required<readonly LightboxImage[]>();
  readonly labels = input.required<GalleryContent['lightbox']>();

  /** Index of the photo on screen, or null while closed. */
  readonly index = signal<number | null>(null);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private swipeStartX: number | null = null;

  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : this.images()[i];
  });

  protected readonly src = computed(() => {
    const image = this.current();
    return image ? webpLoader({ src: image.base, width: 1600 }) : '';
  });

  protected readonly srcset = computed(() => {
    const image = this.current();
    if (!image) return '';
    return SRCSET_WIDTHS.map((w) => `${webpLoader({ src: image.base, width: w })} ${w}w`).join(
      ', ',
    );
  });

  protected readonly counter = computed(() => {
    const i = this.index();
    return i === null
      ? ''
      : fill(this.labels().counter, { current: i + 1, total: this.images().length });
  });

  open(index: number): void {
    this.index.set(index);
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) dialog.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  next(): void {
    this.step(1);
  }

  previous(): void {
    this.step(-1);
  }

  /** Native `close` event (Escape, close button, backdrop). */
  protected onClosed(): void {
    this.index.set(null);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    }
  }

  /** A click that lands on the <dialog> itself (not its content) is a backdrop click. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  protected onPointerDown(event: PointerEvent): void {
    this.swipeStartX = event.pointerType === 'mouse' ? null : event.clientX;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.swipeStartX === null) return;
    const dx = event.clientX - this.swipeStartX;
    this.swipeStartX = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (dx < 0) this.next();
    else this.previous();
  }

  private step(delta: number): void {
    const i = this.index();
    if (i === null) return;
    const total = this.images().length;
    this.index.set((i + delta + total) % total);
  }
}
