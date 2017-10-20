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
import { AuthenticationService } from './services/authentication.service';

/* Modules */
import { ApiModule } from './api/api.module';
import { ComponentsModule } from './component/components.module';
import { PrivateModule } from './modules/private/private.module';
import { PublicModule } from './modules/public/public.module';
import { PagesModule } from './pages/pages.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
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
    PagesModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ApiModule.forRoot()
  ],
  providers: [
    AuthenticationGuard,
    AnonymousGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
