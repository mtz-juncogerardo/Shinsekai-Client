import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelpComponent} from './help.component';
import {ComponentsModule} from '../../components/components.module';
import {RouterModule, Routes} from '@angular/router';
import { RequestComponent } from './request/request.component';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent
  },
  {
    path: 'request',
    component: RequestComponent
  }
];

@NgModule({
  declarations: [
    HelpComponent,
    RequestComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})

export class HelpModule {
}
