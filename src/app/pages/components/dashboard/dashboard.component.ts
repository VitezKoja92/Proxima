import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { Appointment, Patient } from '../../../api/models/index';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {

  numberOfPatients = 0;
  numberOfTherapies = 0;
  appointmentsToday: Appointment[];
  subs: Subscription[] = [];

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private AppointmentAPIService: AppointmentAPIService,
    private changeDetectionRef: ChangeDetectorRef

  ) {
    this.getAppointmentsToday();
  }

  ngOnInit() {
    this.getAllPatientCount();
    this.getAllTherapiesCount();
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

  getAllPatientCount() {
    this.subs.push(this.PatientAPIService.patientsCount()
      .subscribe((count: number) => {
        console.log('dashboard patients', count);
        this.numberOfPatients = count;
        this.changeDetectionRef.detectChanges();
      }));
  }

  getAllTherapiesCount() {
    this.subs.push(this.PatientAPIService.therapiesCount()
      .subscribe((count: number) => {
        console.log('dashboard therapies', count);
        this.numberOfTherapies = count;
        this.changeDetectionRef.detectChanges();
      }));
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

  ngOnDestroy(): void {
    this.changeDetectionRef.detach();
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
