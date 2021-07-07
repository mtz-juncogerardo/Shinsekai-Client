import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticlesDetailsComponent} from './articles-details.component';
import {RouterModule, Routes} from '@angular/router';
import { ShareModule } from 'ngx-sharebuttons';
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
    ShareModule,
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class ArticlesDetailsModule {
}
