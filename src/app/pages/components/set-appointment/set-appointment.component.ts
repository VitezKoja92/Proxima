import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { User, Patient, Appointment, SetAppointmentModel } from '../../../api/models/index';

@Component({
  selector: 'app-set-appointment',
  templateUrl: './set-appointment.component.html',
  styleUrls: ['./set-appointment.component.scss']
})
export class SetAppointmentComponent implements OnInit {

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

  ngOnInit() {
    this.getAppointments()
      .then((appointments: Appointment[]) => {
        this.appointments  = appointments;
      });
    this.getAllPatients()
      .then((patients: Patient[]) => {
        this.patients = patients;
      });
    this.getAllUsers()
      .then((users: User[]) => {
        this.users = users;
      });
  }

  getAppointments(): Promise<Appointment[]> {
    const today = new Date();
    return this.AppointmentAPIService.getAllAppointments()
      .then((appointments: Appointment[]) => {
        return appointments.sort(this.dateSort);
      });
  }

  getAllPatients(): Promise<Patient[]> {
    return this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]) => {
        return patients;
      });
  }

  getAllUsers(): Promise<User[]> {
    return this.UserAPIService.getAllUsers()
      .then((users: User[]) => {
        return users;
      });
  }

  dateSort(a: Appointment, b: Appointment) {
    if (a.dateTime < b.dateTime) {
      return -1;
    } else {
      return 1;
    }
  }

  setAppointment(data: SetAppointmentModel) {
    const date: Date = data.date;
    date.setHours(data.hour);
    date.setMinutes(data.minute);
    const appointment = new Appointment(data.doctor, data.patient, date, data.description);
    console.log('appointment in setAppointment: ', appointment);
    console.log('date', appointment.dateTime.getDate());
    console.log('month', appointment.dateTime.getMonth());
    console.log('fullyear', appointment.dateTime.getFullYear());
    console.log('h', appointment.dateTime.getHours());
    console.log('m', appointment.dateTime.getMinutes());

    this.AppointmentAPIService.addAppointment(appointment)
      .then((result: string): void => {
        this.Router.navigate(['/appointments-list']);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }
}
