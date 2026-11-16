import { Injectable, signal } from '@angular/core';
import type { DestinationId } from '../../../content/ids';

export interface LeadPrefill {
  readonly destination: DestinationId;
  /** Ready-made comment text, already in the page language. */
  readonly comment: string;
  /** Changes on every request so asking twice for the same place still re-applies it. */
  readonly nonce: number;
}

/**
 * Hand-off from "Get a consultation" buttons on city/country cards to the lead form:
 * the card calls `request()`, the form reacts to `pending()` and fills its fields.
 */
@Injectable({ providedIn: 'root' })
export class LeadPrefillService {
  private readonly current = signal<LeadPrefill | null>(null);
  private counter = 0;

  readonly pending = this.current.asReadonly();

  request(destination: DestinationId, comment: string): void {
    this.current.set({ destination, comment, nonce: ++this.counter });
  }
}
