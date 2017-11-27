import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';

import { Appointment } from '../../../api/models/index';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
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

  noAppointment = true;
  subs: Subscription[] = [];

  constructor(
    private Router: Router,
    private PatientAPIService: PatientAPIService,
    private AppointmentAPIService: AppointmentAPIService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAllPatientCount();
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

  getAllPatientCount() {
    this.subs.push(this.PatientAPIService.patientsCount()
      .subscribe((count: number) => {
        this.numberOfPatients = count;
        this.changeDetectionRef.detectChanges();
      }));
  }

  getAllTherapiesCount() {
    this.subs.push(this.PatientAPIService.therapiesCount()
      .subscribe((count: number) => {
        this.numberOfTherapies = count;
        this.changeDetectionRef.detectChanges();
      }));
  }

  getAppointmentsToday() {
    this.subs.push(this.AppointmentAPIService.todayAppointments()
      .subscribe((appointments: Appointment[]) => {
        this.appointmentsToday = appointments;
        if (appointments.length !== 0) {
          this.noAppointment = false;
        }
        this.changeDetectorRef.detectChanges();
      }));
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.changeDetectionRef.detach();
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
