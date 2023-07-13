import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './vue/rni/site/site.component';

import { MapComponent } from './vue/rni/map/map.component';

import { RegistrationComponent } from './vue/registration/registration.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarteComponent } from './public/carte/carte.component';
import { GestionSiteComponent } from './admin/gestion-site/gestion-site.component';
import { AuthorizationGuard } from './_guard/authorization.guard';
import { HasRoleGuard } from './_guard/has-role.guard';
import { FichierRniComponent } from './admin/fichier-rni/fichier-rni.component';
import { RapportComponent } from './admin/rapport/rapport.component';

const routes: Routes = [
  { path: '', redirectTo: 'carte', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,title:"IRT - Page de connexion" },
  { path: 'registration', component: RegistrationComponent },
  { path: 'map', component: MapComponent },
  { path: 'dash',title:"IRT - Tableau de bord" ,component: DashbordComponent ,canActivate:[AuthorizationGuard,HasRoleGuard],data:{roles:["ADMIN"]}},
  { path: 'register', component: RegisterComponent,title:"Creation de nouveau compte"},
  { path: 'carte', component: CarteComponent, title:"IRT - Carte" },
  { path: 'details-site', component: GestionSiteComponent,canActivate:[AuthorizationGuard,HasRoleGuard],data:{roles:["ADMIN"]} },
  { path: 'sites', component: SiteComponent, canActivate: [AuthorizationGuard, HasRoleGuard], data: { roles: ["ADMIN"] } },
  {path:'fichier',component:FichierRniComponent},
  {path:'rapports/:annee',component:RapportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
