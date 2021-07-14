import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckoutComponent} from './checkout.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../components/components.module';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent
  }
];

@NgModule({
  declarations: [
    CheckoutComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ComponentsModule,
        FormsModule
    ]
})
export class CheckoutModule {
}
