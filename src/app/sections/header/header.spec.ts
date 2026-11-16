import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { uz } from '../../../content/uz';
import { provideWebpImageLoader } from '../../core/images/image-loader';
import { Header } from './header';

function setup() {
  TestBed.configureTestingModule({ providers: [provideRouter([]), provideWebpImageLoader()] });
  const fixture = TestBed.createComponent(Header);
  fixture.componentRef.setInput('lang', 'uz');
  fixture.componentRef.setInput('nav', uz.nav);
  fixture.detectChanges();
  const el: HTMLElement = fixture.nativeElement;
  const burger = el.querySelector<HTMLButtonElement>('.header__burger')!;
  return { fixture, el, burger };
}

describe('Header', () => {
  afterEach(() => (document.documentElement.style.overflow = ''));

  it('links every menu item to its section on the current language page', () => {
    const { el } = setup();
    const hrefs = [...el.querySelectorAll('.header__link')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      '/uz#services',
      '/uz#cities',
      '/uz#countries',
      '/uz#faq',
      '/uz#contact',
    ]);
  });

  it('shows the phone placeholder as a tel: link', () => {
    const { el } = setup();
    const phone = el.querySelector('.header__phone')!;
    expect(phone.getAttribute('href')).toMatch(/^tel:\+/);
    expect(phone.textContent).toContain('+998 (XX) XXX-XX-XX');
  });

  it('toggles the mobile menu with correct ARIA and scroll lock', () => {
    const { fixture, el, burger } = setup();
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(burger.getAttribute('aria-label')).toBe(uz.nav.openMenu);

    burger.click();
    fixture.detectChanges();
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(burger.getAttribute('aria-label')).toBe(uz.nav.closeMenu);
    expect(el.querySelector('.header__nav')!.classList).toContain('header__nav--open');
    expect(fixture.componentInstance.menuOpen()).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('closes on Escape and returns focus to the burger', () => {
    const { fixture, burger } = setup();
    burger.click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.menuOpen()).toBe(false);
    expect(document.activeElement).toBe(burger);
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('closes when a menu link is followed', () => {
    const { fixture, el, burger } = setup();
    burger.click();
    fixture.detectChanges();
    el.querySelector<HTMLAnchorElement>('.header__link')!.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(fixture.componentInstance.menuOpen()).toBe(false);
  });
});
