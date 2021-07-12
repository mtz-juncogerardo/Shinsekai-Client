import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreCheckoutComponent} from './pre-checkout.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../components/components.module';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PreCheckoutComponent
  }
];

@NgModule({
  declarations: [
    PreCheckoutComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class PreCheckoutModule {
}
