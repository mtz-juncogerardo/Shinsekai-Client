import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent
  ]
})
export class ComponentsModule { }
