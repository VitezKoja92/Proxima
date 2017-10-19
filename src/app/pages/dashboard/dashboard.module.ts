import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FindPatientComponent } from './components/find-patient/find-patient.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [DashboardComponent, AddPatientComponent, FindPatientComponent],
    imports: [ CommonModule ],
    exports: [DashboardComponent, AddPatientComponent, FindPatientComponent],
    providers: [],
})
export class DashboardModule {}
