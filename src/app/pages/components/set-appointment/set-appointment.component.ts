import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { User, Patient, Appointment, AddAppointmentModel } from '../../../api/models/index';

@Component({
  selector: 'app-set-appointment',
  templateUrl: './set-appointment.component.html',
  styleUrls: ['./set-appointment.component.scss']
})
export class SetAppointmentComponent {

  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  form: FormGroup;

  constructor(
    private UserAPIService: UserAPIService,
    private PatientAPIService: PatientAPIService,
    private AppointmentAPIService: AppointmentAPIService,
    private Router: Router,
    private FormBuilder: FormBuilder
  ) {
    this.getAppointments();
    this.getAllPatients();
    this.getAllUsers();

    this.form = this.FormBuilder.group({
      'doctor': [null, Validators.required],
      'patient': [null, Validators.required],
      'hour': [null, Validators.compose([Validators.required, Validators.max(23), Validators.min(0)])],
      'minute': [null, Validators.compose([Validators.required, Validators.max(59), Validators.min(0)])],
      'description': [null],
      'date': [null, Validators.required]
    });

  }

  getAppointments(): void {
    const today = new Date();
    this.AppointmentAPIService.getAllAppointments()
      .then((appointments: Appointment[]): void => {
        this.appointments = appointments.sort(this.dateSort);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  dateSort(a: Appointment, b: Appointment) {
    if (a.date < b.date) {
      return -1;
    } else {
      return 1;
    }
  }

  getAllPatients(): void {
    this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]): void => {
        this.patients = patients;
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  getAllUsers(): void {
    this.UserAPIService.getAllUsers()
      .then((users: User[]): void => {
        this.users = users;
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  setAppointment(data: AddAppointmentModel) {
    const appointment = new Appointment(data.doctor, data.patient, data.date, data.hour, data.minute, data.description);

    this.AppointmentAPIService.addAppointment(appointment)
      .then((result: string): void => {
        this.Router.navigate(['/appointments-list']);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

}
