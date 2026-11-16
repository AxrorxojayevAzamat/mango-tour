import { TestBed } from '@angular/core/testing';
import { en } from '../../../content/en';
import { uz } from '../../../content/uz';
import { provideWebpImageLoader } from '../../core/images/image-loader';
import { LeadPrefillService } from '../../core/lead/lead-prefill.service';
import { Destinations, DestinationKind } from './destinations';

function render(
  kind: DestinationKind,
  lang: 'uz' | 'en',
  content: typeof uz.cities | typeof en.countries,
) {
  TestBed.configureTestingModule({ providers: [provideWebpImageLoader()] });
  const fixture = TestBed.createComponent(Destinations);
  fixture.componentRef.setInput('kind', kind);
  fixture.componentRef.setInput('lang', lang);
  fixture.componentRef.setInput('content', content);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('Destinations', () => {
  it('renders 7 cities as 4 square cards then 3 wide ones, under #cities', () => {
    const el = render('cities', 'uz', uz.cities);
    expect(el.querySelector('section')!.id).toBe('cities');
    expect(el.querySelectorAll('.place-card')).toHaveLength(7);
    const items = [...el.querySelectorAll('.destinations__item')];
    expect(items.map((i) => i.classList.contains('destinations__item--wide'))).toEqual([
      false,
      false,
      false,
      false,
      true,
      true,
      true,
    ]);
    expect(items[6].classList).toContain('destinations__item--solo');
    const media = [...el.querySelectorAll('.place-card__media')];
    expect(media[0].classList).not.toContain('place-card__media--wide');
    expect(media[4].classList).toContain('place-card__media--wide');
    expect(el.querySelector('.place-card__name')!.textContent).toBe('Toshkent');
  });

  it('renders all 4 countries as portrait cards', () => {
    const el = render('countries', 'en', en.countries);
    expect(el.querySelector('section')!.id).toBe('countries');
    expect(el.querySelectorAll('.place-card__media--portrait')).toHaveLength(4);
    expect(el.querySelector('.destinations__item--wide, .destinations__item--solo')).toBeNull();
  });

  it('links each CTA to the lead form and pre-fills destination + comment', () => {
    const el = render('cities', 'uz', uz.cities);
    const cta = el.querySelectorAll<HTMLAnchorElement>('.place-card__cta')[1];
    expect(cta.getAttribute('href')).toBe('/uz#contact');

    cta.addEventListener('click', (e) => e.preventDefault()); // keep jsdom from navigating
    cta.click();
    const pending = TestBed.inject(LeadPrefillService).pending();
    expect(pending?.destination).toBe('samarkand');
    expect(pending?.comment).toBe('Samarqand bo‘yicha konsultatsiya olmoqchiman.');
  });
});
