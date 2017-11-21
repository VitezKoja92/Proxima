import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { Appointment, Patient } from '../../../api/models/index';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  numberOfPatients: Number;
  numberOfTherapies = 0;
  appointmentsToday: Appointment[];

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private AppointmentAPIService: AppointmentAPIService
  ) {
      this.getAppointmentsToday();
  }

  ngOnInit() {
    this.getAllPatients();
    // this.getAllPatients()
    //   .then((patients: Patient[]) => {
    //     this.numberOfPatients = patients.length;
    //     for (let patient of patients) {
    //       if (!isNullOrUndefined(patient.medicalHistory)) {
    //         this.numberOfTherapies += patient.medicalHistory.length;
    //       }
    //     }
    //   });
    this.getAppointmentsToday()
      .then((appointments: Appointment[]) => {
        this.appointmentsToday = appointments;
      });
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

  getAllPatients() {
    this.PatientAPIService.getAllPatients()
      .subscribe((res) => {
        console.log(res);
      });
  }

  getAppointmentsToday(): Promise<Appointment[]> {
    const today = new Date();
    return this.AppointmentAPIService.getAllAppointments()
      .then((appointments: Appointment[]) => {
        return appointments.filter((appointment) => {
          return appointment.date.getDate() === today.getDate()
          && appointment.date.getMonth() === today.getMonth()
          && appointment.date.getFullYear() === today.getFullYear();
        }).sort(this.dateSort);
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
