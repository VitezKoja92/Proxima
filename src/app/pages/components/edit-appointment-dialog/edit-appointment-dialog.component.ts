import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { AppointmentsListComponent } from '../appointments-list/appointments-list.component';
import { AppointmentAPIService } from './../../../api/pouchdb-service/appointment-api.service';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Appointment, Patient, User } from './../../../api/models/index';

@Component({
  selector: 'app-edit-appointment-dialog',
  templateUrl: './edit-appointment-dialog.component.html',
  styleUrls: ['./edit-appointment-dialog.component.scss']
})
export class EditAppointmentDialogComponent implements OnInit {

  appointment: Appointment;
  form: FormGroup;
  users: User[];
  patients: Patient[];
  selectedUser: User;
  selectedPatient: Patient;

  constructor(
    private FormBuilder: FormBuilder,
    private PatientAPIService: PatientAPIService,
    private UserAPIService: UserAPIService,
    private AppointmentAPIService: AppointmentAPIService,
    private Router: Router,
    public dialogRef: MatDialogRef<AppointmentsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointment = data.appointment;
    this.UserAPIService.getAllUsers()
      .then((users: User[]) => {
        this.users = users;
        this.selectedUser = users.find((user: User) => {
          return user._id === this.appointment.user._id;
        });
      });
    this.PatientAPIService.getAllPatients()
      .then((patients: Patient[]) => {
        this.patients = patients;
        this.selectedPatient = patients.find((patient: Patient) => {
          return patient._id === this.appointment.patient._id;
        });
      });
  }

  ngOnInit(): void {

    this.form = this.FormBuilder.group({
      'doctor': [null, Validators.required],
      'patient': [null, Validators.required],
      'hour': [null, Validators.compose([Validators.required, Validators.max(23), Validators.min(0)])],
      'minute': [null, Validators.compose([Validators.required, Validators.max(59), Validators.min(0)])],
      'description': [null],
      'date': [null, Validators.required]
    });
  }

  editAppointment(data: any) {
    const date: Date = data.date;
    date.setHours(data.hour);
    date.setMinutes(data.minute);
    this.AppointmentAPIService.editAppointment(this.appointment._id, this.appointment._rev,
      date, data.description, data.patient, data.doctor)
      .then((appointment: Appointment): void => {
        this.Router.navigate(['/appointments-list']);
      });
      this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
