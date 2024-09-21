import { Routes } from "@angular/router";

import { UserHubComponent } from "./pages/user-hub/user-hub.component";
import { UserHubResolver } from "./pages/user-hub/services/user-hub.resolver";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-hub/user-hub.component').then(c => c.UserHubComponent),
    resolve: {
      users: UserHubResolver
    }
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];