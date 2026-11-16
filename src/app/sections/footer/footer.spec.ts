import { TestBed } from '@angular/core/testing';
import { en } from '../../../content/en';
import { provideWebpImageLoader } from '../../core/images/image-loader';
import { Footer } from './footer';

describe('Footer', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideWebpImageLoader()] });
    const fixture = TestBed.createComponent(Footer);
    fixture.componentRef.setInput('lang', 'en');
    fixture.componentRef.setInput('content', en.footer);
    fixture.componentRef.setInput('nav', en.nav);
    fixture.componentRef.setInput('messengerLabels', en.floating);
    fixture.componentRef.setInput('year', 2031);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('fills the year into the copyright line', () => {
    expect(render().querySelector('.footer__copyright')!.textContent).toBe(
      '© 2031 mango_tour. All rights reserved.',
    );
  });

  it('renders the menu with section anchors', () => {
    const hrefs = [...render().querySelectorAll('nav .footer__link')].map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      '/en#services',
      '/en#cities',
      '/en#countries',
      '/en#faq',
      '/en#contact',
    ]);
  });

  it('gives every icon-only social link an accessible name', () => {
    const links = [...render().querySelectorAll('.footer__social')];
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.getAttribute('aria-label')?.length).toBeGreaterThan(0);
      expect(link.getAttribute('rel')).toBe('noopener');
    }
  });

  it('shows company details and the public offer placeholder', () => {
    const el = render();
    expect(el.querySelectorAll('.footer__detail')).toHaveLength(en.footer.companyDetails.length);
    expect(el.textContent).toContain(en.footer.offerLink);
  });
});
