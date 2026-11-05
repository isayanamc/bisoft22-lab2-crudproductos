import { Routes } from '@angular/router';
import { adminGuard, authGuard, invitadoGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'productos' },

  // Sin sesión
  {
    path: 'login',
    canActivate: [invitadoGuard],
    title: 'Iniciar sesión',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    canActivate: [invitadoGuard],
    title: 'Registro',
    loadComponent: () => import('./registro/registro').then((m) => m.Registro),
  },

  // Productos
  {
    path: 'productos',
    canActivate: [authGuard],
    title: 'Productos',
    loadComponent: () => import('./productos/productos').then((m) => m.Productos),
  },
  {
    path: 'productos/nuevo',
    canActivate: [adminGuard],
    title: 'Nuevo producto',
    loadComponent: () => import('./producto-form/producto-form').then((m) => m.ProductoForm),
  },
  {
    path: 'productos/:id/editar',
    canActivate: [adminGuard],
    title: 'Editar producto',
    loadComponent: () => import('./producto-form/producto-form').then((m) => m.ProductoForm),
  },

  // Categorías
  {
    path: 'categorias',
    canActivate: [authGuard],
    title: 'Categorías',
    loadComponent: () => import('./categorias/categorias').then((m) => m.Categorias),
  },
  {
    path: 'categorias/nueva',
    canActivate: [adminGuard],
    title: 'Nueva categoría',
    loadComponent: () => import('./categoria-form/categoria-form').then((m) => m.CategoriaForm),
  },
  {
    path: 'categorias/:id/editar',
    canActivate: [adminGuard],
    title: 'Editar categoría',
    loadComponent: () => import('./categoria-form/categoria-form').then((m) => m.CategoriaForm),
  },

  // Usuarios: solo SUPER-ADMIN-ROLE
  {
    path: 'usuarios',
    canActivate: [adminGuard],
    title: 'Usuarios',
    loadComponent: () => import('./usuarios/usuarios').then((m) => m.Usuarios),
  },

  // Donde va un USER que intenta entrar a algo de admin
  {
    path: 'no-autorizado',
    title: 'Acceso restringido',
    loadComponent: () => import('./no-autorizado/no-autorizado').then((m) => m.NoAutorizado),
  },

  // Cualquier URL que no exista
  { path: '**', redirectTo: 'productos' },
];
