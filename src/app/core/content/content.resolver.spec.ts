import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  RouterStateSnapshot,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import type { SiteContent } from '../../../content/content.model';
import { LanguageService } from '../i18n/language.service';
import { LANGS } from '../i18n/languages';
import { CONTENT_LOADERS, contentResolver } from './content.resolver';

function resolve(lang: string | null) {
  const route = { paramMap: convertToParamMap(lang ? { lang } : {}) } as ActivatedRouteSnapshot;
  return TestBed.runInInjectionContext(() => contentResolver(route, {} as RouterStateSnapshot));
}

describe('contentResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('has a lazy loader for every language', async () => {
    for (const lang of LANGS) {
      const content = await CONTENT_LOADERS[lang]();
      expect(content.nav.items.contact.length).toBeGreaterThan(0);
    }
  });

  it('activates the language and resolves its content', async () => {
    const content = (await resolve('ru')) as SiteContent;
    expect(TestBed.inject(LanguageService).lang()).toBe('ru');
    expect(content.nav.items.cities).toBe('Города');
  });

  it('redirects an unknown language to the default one', () => {
    const result = resolve('de');
    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo.toString()).toBe('/uz');
  });
});
