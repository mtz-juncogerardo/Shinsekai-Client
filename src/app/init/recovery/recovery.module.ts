import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecoveryComponent} from './recovery.component';
import {RouterModule, Routes} from '@angular/router';
import { PasswordChangeComponent } from './password-change/password-change.component';
import {ComponentsModule} from '../../components/components.module';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RecoveryComponent
  },
  {
    path: ':token',
    component: PasswordChangeComponent
  }
];


@NgModule({
  declarations: [
    RecoveryComponent,
    PasswordChangeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class RecoveryModule {
}
