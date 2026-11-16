import { TestBed } from '@angular/core/testing';
import { ru } from '../../../content/ru';
import { Faq } from './faq';

describe('Faq', () => {
  function render() {
    const fixture = TestBed.createComponent(Faq);
    fixture.componentRef.setInput('content', ru.faq);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders 8 native disclosure widgets sharing one name (exclusive accordion)', () => {
    const { el } = render();
    const items = [...el.querySelectorAll('details')];
    expect(items).toHaveLength(8);
    expect(new Set(items.map((d) => d.getAttribute('name')))).toEqual(new Set(['faq']));
    expect(items[0].querySelector('summary')!.textContent).toContain(ru.faq.items.visa.question);
  });

  it('marks the chevron of the open item with a flat BEM modifier', () => {
    const { fixture, el } = render();
    const details = el.querySelectorAll('details')[3];
    details.open = true;
    details.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();
    expect(details.classList).toContain('faq__item--open');
    expect(details.querySelector('.faq__chevron')!.classList).toContain('faq__chevron--open');
  });
});
