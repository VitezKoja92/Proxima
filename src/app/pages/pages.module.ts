import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetAppointmentComponent } from './components/set-appointment/set-appointment.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { FindPatientComponent } from './components/find-patient/find-patient.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
    declarations: [DashboardComponent, AddPatientComponent, FindPatientComponent, SetAppointmentComponent],
    imports: [ CommonModule ],
    exports: [DashboardComponent, AddPatientComponent, FindPatientComponent, SetAppointmentComponent],
    providers: [],
})
export class PagesModule {}
