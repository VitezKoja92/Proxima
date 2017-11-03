import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PublicComponent } from './public.component';
import { AnonymousGuard } from '../../guards/anonymous.guard';
import { MaterialModule } from '../material.module';


const publicRoutes: Routes = [
  {
    path:      '',
    component: PublicComponent,
    //   canActivate: [AnonymousGuard],
    children:  [
      {
        path:      'login',
        component: LoginComponent
      },
      {
        path:      'register',
        component: RegisterComponent
      },
      {
        path:       '**',
        redirectTo: 'dashboard',
        pathMatch:  'full'
      }
    ]
  }
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, PublicComponent],
  imports:      [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(publicRoutes)],
  exports:      [LoginComponent, RegisterComponent, PublicComponent],
  providers:    [],
})
export class PublicModule {
}
