import { DashboardModule } from './dashboard/dashboard.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [],
    imports: [ CommonModule, DashboardModule ],
    exports: [DashboardModule],
    providers: [],
})
export class PagesModule {}
