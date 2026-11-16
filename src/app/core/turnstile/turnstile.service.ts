import { DOCUMENT, Injectable, inject } from '@angular/core';

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** The subset of the Turnstile browser API we use. */
export interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

export interface TurnstileOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'flexible' | 'compact';
  language?: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Loads Cloudflare Turnstile once, on demand (the lead form asks for it only when it
 * approaches the viewport), so the third-party script never delays the first paint.
 */
@Injectable({ providedIn: 'root' })
export class TurnstileService {
  private readonly document = inject(DOCUMENT);
  private loading: Promise<TurnstileApi> | null = null;

  load(): Promise<TurnstileApi> {
    const view = this.document.defaultView;
    if (view?.turnstile) return Promise.resolve(view.turnstile);
    this.loading ??= new Promise<TurnstileApi>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () =>
        view?.turnstile ? resolve(view.turnstile) : reject(new Error('turnstile: API missing'));
      script.onerror = () => {
        this.loading = null; // allow a retry later
        reject(new Error('turnstile: script failed to load'));
      };
      this.document.head.appendChild(script);
    });
    return this.loading;
  }
}
