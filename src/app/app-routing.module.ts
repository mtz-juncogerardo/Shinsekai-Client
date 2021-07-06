import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./init/init.module').then(m => m.InitModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-panel.module').then(m => m.AdminPanelModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
