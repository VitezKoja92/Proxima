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
import { SearchFilterPipe } from '../api/models/search-filter-pipe';
import { AppointmentsListComponent } from './components/appointments-list/appointments-list.component';


@NgModule({
    declarations: [
        DashboardComponent,
        AddPatientComponent,
        FindPatientComponent,
        SetAppointmentComponent,
        PatientComponent,
        EditPatientDialogComponent,
        SearchFilterPipe,
        AppointmentsListComponent
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
        AppointmentsListComponent
    ],
    providers: [],
    entryComponents: [EditPatientDialogComponent]
})
export class PagesModule {}
