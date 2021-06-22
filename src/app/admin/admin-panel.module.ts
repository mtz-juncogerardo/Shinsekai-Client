import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../services/auth.guard';
import { ArticlesComponent } from './articles/articles.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { TagsComponent } from './tags/tags.component';
import { PromotionsComponent } from './promotions/promotions.component';
import {CarouselComponent} from './carousel/carousel.component';
import { PurchasesComponent } from './purchases/purchases.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    AdminPanelComponent,
    ArticlesComponent,
    UsersComponent,
    TagsComponent,
    PromotionsComponent,
    CarouselComponent,
    PurchasesComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class AdminPanelModule { }
