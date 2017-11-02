import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PatientComponent } from '../patient/patient.component';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient, Address } from '../../../api/models/index';

@Component({
  selector: 'app-edit-patient-dialog',
  templateUrl: './edit-patient-dialog.component.html',
  styleUrls: ['./edit-patient-dialog.component.scss']
})
export class EditPatientDialogComponent {

  currentPatient: Patient;
  constructor(
    private PatientAPIService: PatientAPIService,
    private Router: Router,
    public dialogRef: MatDialogRef<PatientComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentPatient = data.patient;
  }

  editPersonalInfo(name: string, surname: string, city: string, country: string, postcode: Number,
    street: string, streetNo: string, profession: string) {

    const address = new Address(country, city, postcode, street, streetNo);

    this.PatientAPIService.editPatientInfo(this.currentPatient._id, this.currentPatient._rev, name, surname,
      address, profession, this.currentPatient.personalInfo.dateOfBirth, this.currentPatient.medicalHistory)
      .then((patient: Patient): void => {
        this.currentPatient = patient;
      }, (error: Error): void => {
        console.log('Error: ', error);
      });

      this.dialogRef.close();
      this.Router.navigate(['/patient/' + this.currentPatient._id]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
