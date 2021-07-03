import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule} from '@angular/forms';
import { CarouselComponent } from './carousel/carousel.component';



@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
    CarouselComponent,
  ],
    imports: [
        CommonModule,
        FormsModule
    ],
  exports: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
    CarouselComponent,
  ]
})
export class ComponentsModule { }
