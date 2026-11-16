import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LangSwitcher } from './lang-switcher';

describe('LangSwitcher', () => {
  it('links to every language and marks the current one', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(LangSwitcher);
    fixture.componentRef.setInput('current', 'ru');
    fixture.componentRef.setInput('label', 'Выбрать язык сайта');
    fixture.detectChanges();

    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/uz', '/en', '/ru']);
    expect(links.map((a) => a.getAttribute('aria-current'))).toEqual([null, null, 'page']);
    expect(links[0].getAttribute('hreflang')).toBe('uz-Latn');
  });
});
