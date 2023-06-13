import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './vue/rni/map/map.component';
import { SiteComponent } from './vue/rni/site/site.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './vue/navbar/navbar.component';
import { JwtInterceptor } from './service/jwt-interceptor.interceptor';
import { RegistrationComponent } from './vue/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { SlideBarComponent } from './admin/slide-bar/slide-bar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CarteComponent } from './public/carte/carte.component';
import { NavBarComponent } from './public/nav-bar/nav-bar.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CarteComponent,
    SiteComponent,
    NavBarComponent,
    NavbarComponent,
    DashbordComponent,
    SlideBarComponent,
    LoginComponent,
    RegistrationComponent,
    RegisterComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule, MatPaginatorModule, MatGridListModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatSelectModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
