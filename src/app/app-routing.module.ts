import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './vue/rni/site/site.component';
import { AuthorizationGuard } from './guard/authorization.guard';
import { MapComponent } from './vue/rni/map/map.component';
import { HasRoleGuard } from './guard/has-role.guard';
import { RegistrationComponent } from './vue/registration/registration.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarteComponent } from './public/carte/carte.component';

const routes: Routes = [
  { path: '', redirectTo: 'carte', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'map', component: MapComponent },
  { path: 'dash', component: DashbordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carte', component: CarteComponent },
  { path: 'sites', component: SiteComponent, canActivate: [AuthorizationGuard, HasRoleGuard], data: { roles: ["ADMIN"] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
