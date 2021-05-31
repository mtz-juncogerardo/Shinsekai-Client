import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../services/auth.guard';
import { ArticlesComponent } from './articles/articles.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    AdminPanelComponent,
    ArticlesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AdminPanelModule { }
