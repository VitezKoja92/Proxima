import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PatientComponent } from '../patient/patient.component';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient, Address } from '../../../api/models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-patient-dialog',
  templateUrl: './edit-patient-dialog.component.html',
  styleUrls: ['./edit-patient-dialog.component.scss']
})
export class EditPatientDialogComponent {

  form: FormGroup;

  currentPatient: Patient;
  constructor(
    private PatientAPIService: PatientAPIService,
    private Router: Router,
    private FormBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PatientComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentPatient = data.patient;
    this.form = FormBuilder.group({
      'name': [null, Validators.required],
      'surname': [null, Validators.required],
      'city': [null, Validators.required],
      'country': [null, Validators.required],
      'postCode': [null],
      'street': [null],
      'number': [null],
      'profession': [null]
    });
  }

  editPersonalInfo(data: any) {

    const address = new Address(data.country, data.city, data.postCode, data.street, data.number);

    this.PatientAPIService.editPatientInfo(this.currentPatient._id, this.currentPatient._rev, data.name, data.surname,
      address, data.profession, this.currentPatient.personalInfo.dateOfBirth, this.currentPatient.medicalHistory)
      .then((patient: Patient): void => {
        this.currentPatient = patient;
      }, (error: Error): void => {
        console.log('Error: ', error);
      });

      this.dialogRef.close();
      this.Router.navigate(['/patient/' + this.currentPatient._id]);
  }
}
