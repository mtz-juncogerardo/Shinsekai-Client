import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuccessComponent} from './success/success.component';
import {ErrorComponent} from './error/error.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../components/components.module';

const routes: Routes = [
  {
    path: 'success',
    component: SuccessComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  }
];

@NgModule({
  declarations: [
    SuccessComponent,
    ErrorComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ]
})

export class PaymentModule {
}
