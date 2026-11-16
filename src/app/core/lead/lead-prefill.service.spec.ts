import { TestBed } from '@angular/core/testing';
import { LeadPrefillService } from './lead-prefill.service';

describe('LeadPrefillService', () => {
  it('starts empty and exposes the latest request', () => {
    const service = TestBed.inject(LeadPrefillService);
    expect(service.pending()).toBeNull();
    service.request('bukhara', 'About Bukhara');
    expect(service.pending()).toEqual(
      expect.objectContaining({ destination: 'bukhara', comment: 'About Bukhara' }),
    );
  });

  it('issues a new nonce even for an identical repeat request', () => {
    const service = TestBed.inject(LeadPrefillService);
    service.request('khiva', 'x');
    const first = service.pending()!.nonce;
    service.request('khiva', 'x');
    expect(service.pending()!.nonce).toBeGreaterThan(first);
  });
});
