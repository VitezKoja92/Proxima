import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Sort, MatDialog } from '@angular/material';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { Appointment } from './../../../api/models/index';
import { EditAppointmentDialogComponent } from '../edit-appointment-dialog/edit-appointment-dialog.component';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsListComponent implements OnDestroy {

  appointments: Appointment[];
  sortedAppointments: Appointment[];
  selectedPeriod: string;

  subs: Subscription[] = [];

  constructor(
    private AppointmentAPIService: AppointmentAPIService,
    private Router: Router,
    private dialog: MatDialog,
    private ActivatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.selectedPeriod = '';
    this.getAppointments();
  }

  periods = ['All', 'Today', 'Week', 'Month', 'Year'];

  getAppointments(period?: string): void {
    const today = new Date();
    this.subs.push(this.AppointmentAPIService.allAppointments()
      .subscribe((appointments: Appointment[]) => {
        if (isNullOrUndefined(period) || period === 'All') {
          this.appointments = appointments.sort(this.dateSort);
          this.sortedAppointments = this.appointments.slice();
        } else {
          this.appointments = appointments.sort(this.dateSort).filter((appointment: Appointment) => {
            let todayDate;
            let futureDate;
            if (period === 'Today') {
              todayDate = new Date();
              return appointment.dateTime.getDate() === today.getDate()
                && appointment.dateTime.getMonth() === today.getMonth()
                && appointment.dateTime.getFullYear() === today.getFullYear();
            } else if (period === 'Week') {
              todayDate = new Date();
              futureDate = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 7));
            } else if (period === 'Month') {
              todayDate = new Date();
              futureDate = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 30));
            } else if (period === 'Year') {
              todayDate = new Date();
              futureDate = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 365));
            }

            return appointment.dateTime >= todayDate && appointment.dateTime < futureDate;
          });
          this.sortedAppointments = this.appointments.slice();
        }

        this.changeDetectorRef.detectChanges();
      }));
  }

  deleteAppointment(appointment: Appointment): void {
    this.subs.push(this.AppointmentAPIService.deleteAppointment(appointment._id)
      .subscribe(() => {
        this.getAppointments();
        this.changeDetectorRef.detectChanges();
      }));
  }

  openDialog(appointment: Appointment): void {
    this.subs.push(this.AppointmentAPIService.getAppointment(appointment.dateTime)
      .subscribe((app: Appointment) => {
        const dialogRef = this.dialog.open(EditAppointmentDialogComponent, {
          width: '60%',
          data: {
            appointment: app
          }
        });
        this.changeDetectorRef.detectChanges();
        dialogRef.afterClosed().subscribe((result) => {
            this.ActivatedRoute.params.subscribe(() => {
                this.getAppointments();
              }
            );
          });
      }));
  }

  dateSort(a: Appointment, b: Appointment) {
    if (a.dateTime < b.dateTime) {
      return -1;
    } else {
      return 1;
    }
  }

  sortData(sort: Sort) {
    const data = this.appointments.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedAppointments = data;
      return;
    }

    this.sortedAppointments = data.sort((a: Appointment, b: Appointment) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return compare(a.dateTime, b.dateTime, isAsc);
        case 'time': return compare(+(a.dateTime.getHours() * 60 + a.dateTime.getMinutes()),
         +(b.dateTime.getHours() * 60 + b.dateTime.getMinutes()), isAsc);
        case 'name': return compare(a.patient.personalInfo.name, +b.patient.personalInfo.name, isAsc);
        case 'surname': return compare(a.patient.personalInfo.surname, +b.patient.personalInfo.surname, isAsc);
        case 'description': return compare(+a.description, +b.description, isAsc);
        default: return 0;
      }
    });
  }

  newAppointment() {
    this.Router.navigate(['/set-appointment']);
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

function compare(a: any, b: any, isAsc: any) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
