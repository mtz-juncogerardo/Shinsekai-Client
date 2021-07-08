import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticlesExpoComponent} from './articles-expo.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ArticlesExpoComponent
  }
];

@NgModule({
  declarations: [
    ArticlesExpoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    FormsModule
  ]
})
export class ArticlesExpoModule {
}
