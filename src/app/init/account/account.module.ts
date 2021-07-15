import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './account.component';
import {ComponentsModule} from '../../components/components.module';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  }
];

@NgModule({
  declarations: [AccountComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ComponentsModule,
        ReactiveFormsModule
    ]
})
export class AccountModule { }
