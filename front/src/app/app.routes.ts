import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routing').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  // {
  //   path: 'pacientes',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/pacientes/pacientes.routes').then(m => m.pacientesRoutes)
  // },
  // {
  //   path: 'calendario',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./features/calendario/calendario.component').then(m => m.CalendarioComponent)
  // },
  // {
  //   path: 'sesiones',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/sesiones/sesiones.routes').then(m => m.sesionesRoutes)
  // },
  // {
  //   path: 'facturacion',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/facturacion/facturacion.routes').then(m => m.facturacionRoutes)
  // },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
