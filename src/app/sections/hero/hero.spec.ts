import { TestBed } from '@angular/core/testing';
import { en } from '../../../content/en';
import { provideWebpImageLoader } from '../../core/images/image-loader';
import { Hero } from './hero';

describe('Hero', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideWebpImageLoader()] });
    const fixture = TestBed.createComponent(Hero);
    fixture.componentRef.setInput('lang', 'en');
    fixture.componentRef.setInput('content', en.hero);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('links the CTA to the lead form', () => {
    expect(render().querySelector('.hero__cta')!.getAttribute('href')).toBe('/en#contact');
  });

  it('hides the stats block while every number is a placeholder', () => {
    const el = render();
    expect(el.querySelector('.hero__stats')).toBeNull();
    expect(el.textContent).not.toMatch(/XX/);
  });
});
