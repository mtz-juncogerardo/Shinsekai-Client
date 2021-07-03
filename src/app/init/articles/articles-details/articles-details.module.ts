import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticlesDetailsComponent} from './articles-details.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ArticlesDetailsComponent
  }
];

@NgModule({
  declarations: [
    ArticlesDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class ArticlesDetailsModule {
}
