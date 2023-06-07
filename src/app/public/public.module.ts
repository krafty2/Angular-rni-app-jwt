import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CarteComponent } from './carte/carte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


const publicRoute:Routes =[
  {path:'carte',component:CarteComponent}
]

@NgModule({
  declarations: [
    NavbarComponent,
    CarteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(publicRoute)
  ],
  exports:[
    CarteComponent
  ]
})
export class PublicModule { }
