import { Routes } from '@angular/router';
import { contentResolver } from './core/content/content.resolver';
import { langMatchGuard } from './core/i18n/lang.guard';
import { DEFAULT_LANG } from './core/i18n/languages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANG },
  {
    path: ':lang',
    canMatch: [langMatchGuard],
    resolve: { content: contentResolver },
    loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
  },
  { path: '**', redirectTo: DEFAULT_LANG },
];
