import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    HeaderComponent,
  ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        AlertComponent,
        LoaderComponent,
        HeaderComponent,
    ]
})
export class ComponentsModule { }
