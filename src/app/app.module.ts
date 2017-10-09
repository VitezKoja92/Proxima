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
import { AuthenticationService } from './api/Authentication_Service/Authentication.service';
import { FirebaseService } from './api/Firebase_Service/firebase.service';
import { PouchDBService } from './api/PouchDB_Service/pouchdb.service';

/* AngularFire */
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthenticationGuard, AuthenticationService, FirebaseService, PouchDBService],
  bootstrap: [AppComponent]
})
export class AppModule { }
