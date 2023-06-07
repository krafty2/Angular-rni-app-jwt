import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideBarComponent } from './slide-bar/slide-bar.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



const adminRoutes: Routes = [
  {path:'dash',component:DashbordComponent}
];

@NgModule({
  declarations: [
    SlideBarComponent,
    DashbordComponent
  ],
  imports: [
    CommonModule,
    PublicModule,
    RouterModule.forChild(adminRoutes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
