import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import type { GalleryContent } from '../../../content/content.model';
import { GALLERY_IDS, GalleryId, SECTION_IDS } from '../../../content/ids';
import { SITE_CONFIG } from '../../../content/site-config';
import { Icon } from '../../shared/icon/icon';
import { Lightbox, LightboxImage } from '../../shared/lightbox/lightbox';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';

/** Mosaic shape per photo. The grid uses `dense` flow, so 9 photos tile without holes. */
type Tile = 'hero' | 'wide' | 'tall' | 'regular';

const TILE_BY_ID: Partial<Record<GalleryId, Tile>> = {
  registan: 'hero',
  chimgan: 'tall',
  'issyk-kul': 'wide',
};

const SIZES: Record<Tile, string> = {
  hero: '(min-width: 1024px) 50vw, 100vw',
  wide: '(min-width: 1024px) 50vw, 50vw',
  tall: '(min-width: 1024px) 25vw, 50vw',
  regular: '(min-width: 1024px) 25vw, 50vw',
};

interface GalleryTile extends LightboxImage {
  readonly id: GalleryId;
  readonly tile: Tile;
  readonly sizes: string;
}

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage, Icon, Lightbox, Reveal, SectionHeading],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery {
  readonly content = input.required<GalleryContent>();

  protected readonly anchor = SECTION_IDS.gallery;
  protected readonly lightbox = viewChild.required(Lightbox);

  protected readonly tiles = computed<GalleryTile[]>(() =>
    GALLERY_IDS.map((id) => {
      const tile = TILE_BY_ID[id] ?? 'regular';
      return {
        id,
        tile,
        sizes: SIZES[tile],
        base: SITE_CONFIG.images.gallery[id],
        alt: this.content().items[id],
      };
    }),
  );
}
