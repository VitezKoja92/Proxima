import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SetAppointmentComponent } from './components/set-appointment/set-appointment.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { FindPatientComponent } from './components/find-patient/find-patient.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../modules/material.module';
import { PatientComponent } from './components/patient/patient.component';
import { EditPatientDialogComponent } from './components/edit-patient-dialog/edit-patient-dialog.component';
import { AppointmentsListComponent } from './components/appointments-list/appointments-list.component';
import { EditAppointmentDialogComponent } from './components/edit-appointment-dialog/edit-appointment-dialog.component';
import { AppointmentsTodayComponent } from './components/dashboard/components/appointments-today/appointments-today.component';
import { StatsNumberComponent } from './components/dashboard/components/stats-number/stats-number.component';


@NgModule({
    declarations: [
        DashboardComponent,
        AddPatientComponent,
        FindPatientComponent,
        SetAppointmentComponent,
        PatientComponent,
        EditPatientDialogComponent,
        AppointmentsListComponent,
        EditAppointmentDialogComponent,
        AppointmentsTodayComponent,
        StatsNumberComponent
    ],
    imports: [
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule
    ],
    exports: [
        DashboardComponent,
        AddPatientComponent,
        FindPatientComponent,
        SetAppointmentComponent,
        PatientComponent,
        EditPatientDialogComponent,
        AppointmentsListComponent,
        EditAppointmentDialogComponent,
        AppointmentsTodayComponent,
        StatsNumberComponent
    ],
    providers: [],
    entryComponents: [EditPatientDialogComponent, EditAppointmentDialogComponent]
})
export class PagesModule {}
