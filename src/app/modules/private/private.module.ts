import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from './../../guards/authentication.guard';
import { PrivateComponent } from './private.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { AddPatientComponent } from '../../pages/dashboard/components/add-patient/add-patient.component';
import { DashboardStatsComponent } from '../../pages/dashboard/components/dashboard-stats/dashboard-stats.component';
import { FindPatientComponent } from '../../pages/dashboard/components/find-patient/find-patient.component';


const privateRoutes: Routes = [
    {
      path: '',
      component: PrivateComponent,
    //   canActivate: [AuthenticationGuard],
      children: [
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'dashboard-stats',
            component: DashboardStatsComponent
          },
          {
            path: 'add-patient',
            component: AddPatientComponent
          },
          {
            path: 'find-patient',
            component: FindPatientComponent
          }
      ]
    }
  ];

@NgModule({
    declarations: [PrivateComponent, SideMenuComponent],
    imports: [
        RouterModule.forChild(privateRoutes),
        CommonModule
    ],
    exports: [PrivateComponent, SideMenuComponent]
})
export class PrivateModule { }
