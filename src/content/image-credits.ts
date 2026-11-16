/**
 * Attribution for photos taken from Wikimedia Commons (title, author, source, licence).
 * Keyed by the extension-less image base used in SITE_CONFIG.images. Shown in the footer.
 * When the client replaces a photo with their own, delete its entry here.
 */
export interface ImageCredit {
  /** Commons file title without the "File:" prefix. */
  readonly title: string;
  readonly author: string;
  /** e.g. "CC BY-SA 4.0", "CC0", "Public domain". */
  readonly license: string;
  readonly licenseUrl: string;
  /** Commons file page. */
  readonly source: string;
}

export const IMAGE_CREDITS: Readonly<Record<string, ImageCredit>> = {};
