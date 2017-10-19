import { FindPatientComponent } from './components/find-patient/find-patient.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [DashboardComponent, AddPatientComponent, DashboardStatsComponent, FindPatientComponent],
    imports: [ CommonModule ],
    exports: [DashboardComponent, AddPatientComponent, DashboardStatsComponent, FindPatientComponent],
    providers: [],
})
export class DashboardModule {}
