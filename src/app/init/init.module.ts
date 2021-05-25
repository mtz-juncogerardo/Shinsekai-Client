import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InitComponent} from './init.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignupModule} from './signup/signup.module';
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
