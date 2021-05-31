import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoaderComponent,
  ]
})
export class ComponentsModule { }
