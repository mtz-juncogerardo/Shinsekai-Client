import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InitComponent} from './init.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ComponentsModule} from '../components/components.module';

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
    path: 'recovery',
    loadChildren: () => import('./recovery/recovery.module').then(m => m.RecoveryModule)
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
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsModule)
  }
];

@NgModule({
  declarations: [InitComponent],
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
