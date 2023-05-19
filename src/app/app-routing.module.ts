import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './vue/login/login.component';
import { SiteComponent } from './vue/rni/site/site.component';
import { AuthorizationGuard } from './guard/authorization.guard';
import { MapComponent } from './vue/rni/map/map.component';
import { HasRoleGuard } from './guard/has-role.guard';
import { RegistrationComponent } from './vue/registration/registration.component';

const routes: Routes = [
  {path:'',redirectTo:'map',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'registration',component:RegistrationComponent},
  {path:'map',component:MapComponent},
  {path:'sites',component:SiteComponent,canActivate:[AuthorizationGuard,HasRoleGuard],data:{roles:["ADMIN"]}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
