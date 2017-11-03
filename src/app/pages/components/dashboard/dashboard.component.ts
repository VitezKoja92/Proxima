import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { Appointment, Patient } from '../../../api/models/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  numberOfPatients: Number;
  numberOfTherapies = 0;
  appointmentsToday: Appointment[];

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private AppointmentAPIService: AppointmentAPIService
  ) {
      this.getNumberOfPatients();
      this.getNumberOfTherapies();
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
    this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]): void => {
          this.numberOfPatients = patients.length;
      },
      (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  getNumberOfTherapies(): void {
    this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]): void => {
        for (let patient of patients) {
          if (!isNullOrUndefined(patient.medicalHistory)) {
            this.numberOfTherapies += patient.medicalHistory.length;
          }
        }
      },
      (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  getAppointmentsToday(): void {
    const today = new Date();
    this.AppointmentAPIService.getAllAppointments()
      .then((appointments: Appointment[]): void => {
        this.appointmentsToday = appointments.filter((appointment) => {
          return appointment.date.getDate() === today.getDate()
          && appointment.date.getMonth() === today.getMonth()
          && appointment.date.getFullYear() === today.getFullYear();
        }).sort(this.dateSort);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  dateSort(a: Appointment, b: Appointment) {
    if (a.hour < b.hour) {
      return -1;
    } else if (a.hour === b.hour) {
      if (a.minute <= b.minute) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }

}
