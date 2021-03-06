import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PrivateComponent } from './private.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { AddPatientComponent } from '../../pages/components/add-patient/add-patient.component';
import { FindPatientComponent } from '../../pages/components/find-patient/find-patient.component';
import { SetAppointmentComponent } from './../../pages/components/set-appointment/set-appointment.component';
import { DashboardComponent } from '../../pages/components/dashboard/dashboard.component';
import { PatientComponent } from './../../pages/components/patient/patient.component';
import { AppointmentsListComponent } from './../../pages/components/appointments-list/appointments-list.component';

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
            path: 'add-patient',
            component: AddPatientComponent
          },
          {
            path: 'find-patient',
            component: FindPatientComponent
          },
          {
            path: 'set-appointment',
            component: SetAppointmentComponent
          },
          {
            path: 'appointments-list',
            component: AppointmentsListComponent
          },
          {
            path: 'patient',
            component: PatientComponent
          },
          {
            path: 'patient/:id',
            component: PatientComponent
          }
      ]
    }
  ];

@NgModule({
    declarations: [
      PrivateComponent,
      SideMenuComponent
    ],
    imports: [
        RouterModule.forChild(privateRoutes),
        CommonModule
    ],
    exports: [PrivateComponent, SideMenuComponent]
})
export class PrivateModule { }
