import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetAppointmentComponent } from './components/set-appointment/set-appointment.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { FindPatientComponent } from './components/find-patient/find-patient.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from './../modules/material.module';
import { PatientComponent } from './components/patient/patient.component';

@NgModule({
    declarations: [DashboardComponent, AddPatientComponent, FindPatientComponent, SetAppointmentComponent, PatientComponent],
    imports: [ CommonModule, MaterialModule ],
    exports: [DashboardComponent, AddPatientComponent, FindPatientComponent, SetAppointmentComponent, PatientComponent],
    providers: [],
})
export class PagesModule {}
