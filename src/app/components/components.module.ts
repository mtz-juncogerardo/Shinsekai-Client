import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CarouselComponent } from './carousel/carousel.component';
import { InputFormComponent } from './input-form/input-form.component';
import { FooterComponent } from './footer/footer.component';
import {RouterModule} from '@angular/router';
import {ArticlePrevComponent} from './article-prev/article-prev.component';
import { SlideComponent } from './slide/slide.component';



@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
    CarouselComponent,
    InputFormComponent,
    FooterComponent,
    ArticlePrevComponent,
    SlideComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
  exports: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
    CarouselComponent,
    InputFormComponent,
    FooterComponent,
    ArticlePrevComponent
  ]
})
export class ComponentsModule { }
