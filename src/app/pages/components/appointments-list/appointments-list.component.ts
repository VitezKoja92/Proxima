import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Sort, MatDialog } from '@angular/material';

import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { Appointment } from './../../../api/models/index';
import { EditAppointmentDialogComponent } from '../edit-appointment-dialog/edit-appointment-dialog.component';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent {

  appointments: Appointment[];
  sortedAppointments: Appointment[];
  selectedPeriod: string;

  constructor(
    private AppointmentAPIService: AppointmentAPIService,
    private Router: Router,
    private dialog: MatDialog,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.selectedPeriod = '';
    this.getAppointments();
  }

  periods = ['All', 'Today', 'Week', 'Month', 'Year'];

  getAppointments(period?: string): void {
    const today = new Date();
    this.AppointmentAPIService.getAllAppointments()
      .then((appointments: Appointment[]): void => {
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
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  deleteAppointment(appointment: Appointment): void {
    this.AppointmentAPIService.deleteAppointment(appointment._id)
      .then(() => {
        this.getAppointments();
      });
  }

  openDialog(appointment: Appointment): void {
    const selectedAppointment = this.AppointmentAPIService.getAppointment(appointment.dateTime)
      .then((app: Appointment) => {
        const dialogRef = this.dialog.open(EditAppointmentDialogComponent, {
          width: '60%',
          data: {
            appointment: app
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.ActivatedRoute.params.subscribe(() => {
                this.getAppointments();
              }
            );
          });
      });
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
}

function compare(a: any, b: any, isAsc: any) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
