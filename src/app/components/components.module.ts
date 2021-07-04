import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CarouselComponent } from './carousel/carousel.component';
import { InputFormComponent } from './input-form/input-form.component';



@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
    CarouselComponent,
    InputFormComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
  exports: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
    CarouselComponent,
    InputFormComponent,
  ]
})
export class ComponentsModule { }
