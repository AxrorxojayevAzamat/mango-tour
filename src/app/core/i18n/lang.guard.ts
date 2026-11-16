import { CanMatchFn } from '@angular/router';
import { isLang } from './languages';

/** Matches only `/uz`, `/en`, `/ru`; anything else falls through to the wildcard redirect. */
export const langMatchGuard: CanMatchFn = (_route, segments) => isLang(segments[0]?.path);
