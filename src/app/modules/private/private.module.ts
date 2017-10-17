import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from './../../guards/authentication.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrivateComponent } from './private.component';

const privateRoutes: Routes = [
    {
      path: '',
      component: PrivateComponent,
      canActivate: [AuthenticationGuard],
      children: [
          {
            path: 'dashboard',
            component: DashboardComponent
          }
      ]
    }
  ];

@NgModule({
    declarations: [DashboardComponent, PrivateComponent],
    imports: [
        RouterModule.forChild(privateRoutes),
        CommonModule
    ],
    exports: [DashboardComponent, PrivateComponent]
})
export class PrivateModule { }
