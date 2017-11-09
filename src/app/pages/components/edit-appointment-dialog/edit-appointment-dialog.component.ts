import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment, Patient, User } from './../../../api/models/index';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AppointmentsListComponent } from '../appointments-list/appointments-list.component';

@Component({
  selector: 'app-edit-appointment-dialog',
  templateUrl: './edit-appointment-dialog.component.html',
  styleUrls: ['./edit-appointment-dialog.component.scss']
})
export class EditAppointmentDialogComponent {

  appointment: Appointment;
  form: FormGroup;
  users: User[];
  patients: Patient[];

  constructor(
    private FormBuilder: FormBuilder,
    private PatientAPIService: PatientAPIService,
    private UserAPIService: UserAPIService,
    public dialogRef: MatDialogRef<AppointmentsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointment = data.appointment;
    this.form = this.FormBuilder.group({
      'doctor': [null, Validators.required],
      'patient': [null, Validators.required],
      'hour': [null, Validators.compose([Validators.required, Validators.max(23), Validators.min(0)])],
      'minute': [null, Validators.compose([Validators.required, Validators.max(59), Validators.min(0)])],
      'description': [null],
      'date': [null, Validators.required]
    });

    this.getAllPatients();
    this.getAllUsers();
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

  editAppointment(data: any) {
    console.log(data);
  }


  // editPersonalInfo(name: string, surname: string, city: string, country: string, postcode: Number,
  //   street: string, streetNo: string, profession: string) {

  //   const address = new Address(country, city, postcode, street, streetNo);

  //   this.PatientAPIService.editPatientInfo(this.currentPatient._id, this.currentPatient._rev, name, surname,
  //     address, profession, this.currentPatient.personalInfo.dateOfBirth, this.currentPatient.medicalHistory)
  //     .then((patient: Patient): void => {
  //       this.currentPatient = patient;
  //     }, (error: Error): void => {
  //       console.log('Error: ', error);
  //     });

  //     this.dialogRef.close();
  //     this.Router.navigate(['/patient/' + this.currentPatient._id]);
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
