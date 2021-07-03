import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InitComponent} from './init.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ComponentsModule} from '../components/components.module';
import { ArticlePrevComponent } from './article-prev/article-prev.component';

const routes: Routes = [
  {
    path: '',
    component: InitComponent
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'articles',
    loadChildren: () => import('./articles/articles-expo/articles-expo.module').then(m => m.ArticlesExpoModule)
  },
  {
    path: 'articles/:id',
    loadChildren: () => import('./articles/articles-details/articles-details.module').then(m => m.ArticlesDetailsModule)
  }
];

@NgModule({
  declarations: [InitComponent, ArticlePrevComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
  ],
})
export class InitModule {
}
