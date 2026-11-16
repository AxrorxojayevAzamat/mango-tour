import { Routes } from '@angular/router';
import { langMatchGuard } from './core/i18n/lang.guard';
import { DEFAULT_LANG } from './core/i18n/languages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANG },
  {
    path: ':lang',
    canMatch: [langMatchGuard],
    loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
  },
  { path: '**', redirectTo: DEFAULT_LANG },
];
