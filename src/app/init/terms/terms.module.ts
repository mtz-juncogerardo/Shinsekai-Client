import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TermsComponent
  }
];

@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ComponentsModule
  ]
})
export class TermsModule { }
