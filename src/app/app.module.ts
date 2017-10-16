import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

/* Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';

/* Guards */
import { AuthenticationGuard } from './guards/authentication.guard';

/* Services */
import { AuthenticationService } from './api/authentication-service/Authentication.service';
import { UserAPIService } from './api/pouchdb-service/user-api.service';

import { ApiModule } from './api/api.module';


const appRoutes: Routes = [
  // {
  //   path: 'dashboard',
  //   canActivate: [AuthenticationGuard],
  //   component: DashboardComponent
  // },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '',
  redirectTo: '/login',
  pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ApiModule.forRoot()
  ],
  providers: [AuthenticationGuard, AuthenticationService, UserAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
