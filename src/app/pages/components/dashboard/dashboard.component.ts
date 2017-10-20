import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { TreatmentsAPIService } from './../../../api/pouchdb-service/treatments-api.service';
import { Appointment } from '../../../api/models/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  numberOfPatients: Number;
  numberOfTreatments: Number;
  appointmentsToday: Appointment[];

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private TreatmentsAPIService: TreatmentsAPIService,
    private AppointmentAPIService: AppointmentAPIService
  ) {
      this.getNumberOfPatients();
      this.getNumberOfTreatments();
      this.getAppointmentsToday();
  }

  goToAddPatient(): void {
    this.Router.navigate(['/add-patient']);
  }
  goToFindPatients(): void {
    this.Router.navigate(['/find-patient']);
  }
  goToSetAppointment(): void {
    this.Router.navigate(['/set-appointment']);
  }

  getNumberOfPatients(): void {
    this.PatientAPIService.getNumberOfPatients()
      .then((numberOfPatients: Number): void => {
          this.numberOfPatients = numberOfPatients;
      },
      (error: Error): void => {
        console.log('Error: ', error);
      }
    );
  }

  getNumberOfTreatments(): void {
    this.TreatmentsAPIService.getNumberOfTreatments()
      .then((numberOfTreatments: Number): void => {
        this.numberOfTreatments = numberOfTreatments;
      },
      (error: Error): void => {
        console.log('Error: ', error);
      }
    );
  }

  getAppointmentsToday(): void {
    const today = new Date();
    this.AppointmentAPIService.getAllAppointments()
      .then((appointments: Appointment[]): void => {
        this.appointmentsToday = appointments.filter(appointment =>
          appointment.dateAndTime.getDate() === today.getDate()
          && appointment.dateAndTime.getMonth() === today.getMonth()
          && appointment.dateAndTime.getFullYear() === today.getFullYear()
        ).sort(this.dateSort);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  dateSort(a: Appointment, b: Appointment) {
    if (a.dateAndTime < b.dateAndTime) {
      return -1;
    } else {
      return 1;
    }
  }

}
