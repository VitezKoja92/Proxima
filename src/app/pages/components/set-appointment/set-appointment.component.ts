import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { User, Patient, Appointment } from '../../../api/models/index';

@Component({
  selector: 'app-set-appointment',
  templateUrl: './set-appointment.component.html',
  styleUrls: ['./set-appointment.component.scss']
})
export class SetAppointmentComponent {

  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  appointmentHoursWrong: boolean;
  appointmentMinutesWrong: boolean;

  constructor(
    private UserAPIService: UserAPIService,
    private PatientAPIService: PatientAPIService,
    private AppointmentAPIService: AppointmentAPIService,
    private Router: Router
  ) {
    this.getAppointments();
    this.getAllPatients();
    this.getAllUsers();

    this.appointmentHoursWrong = false;
    this.appointmentMinutesWrong = false;
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

  updateHours(value: Number): void {
    if (value > 23) {
      this.appointmentHoursWrong = true;
    } else {
      this.appointmentHoursWrong = false;
    }
  }

  updateMinutes(value: Number): void {
    if (value > 59) {
      this.appointmentMinutesWrong = true;
    } else {
      this.appointmentMinutesWrong = false;
    }
  }

  setAppointment(doctor: User, patient: Patient, description: string, hour: number, minute: number, datePicker: string) {
    const date = new Date(datePicker);
    const appointment = new Appointment(doctor, patient, date, hour, minute, description);

    this.AppointmentAPIService.addAppointment(appointment)
      .then((result: string): void => {
        this.Router.navigate(['/appointments-list']);
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

}
