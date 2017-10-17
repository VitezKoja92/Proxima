import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

/* Components */
import { AppComponent } from './app.component';
import { PublicComponent } from './modules/public/public.component';
import { PrivateComponent } from './modules/private/private.component';

/* Guards */
import { AuthenticationGuard } from './guards/authentication.guard';
import { AnonymousGuard } from './guards/anonymous.guard';

/* Services */
import { UserAPIService } from './api/pouchdb-service/user-api.service';
import { LogsAPIService } from './api/pouchdb-service/logs-api.service';
import { AuthenticationService } from './services/authentication.service';

/* Modules */
import { ApiModule } from './api/api.module';
import { ComponentsModule } from './component/components.module';
import { PrivateModule } from './modules/private/private.module';
import { PublicModule } from './modules/public/public.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ComponentsModule,
    PrivateModule,
    PublicModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ApiModule.forRoot()
  ],
  providers: [
    AuthenticationGuard,
    AnonymousGuard,
    AuthenticationService,
    UserAPIService,
    LogsAPIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
