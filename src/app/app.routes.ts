import { Routes } from "@angular/router";

import { UserHubComponent } from "./pages/user-hub/user-hub.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-hub/user-hub.component').then(c => c.UserHubComponent)
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];