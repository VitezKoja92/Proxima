import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PatientComponent } from '../patient/patient.component';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient, Address } from '../../../api/models/index';

@Component({
  selector: 'app-edit-patient-dialog',
  templateUrl: './edit-patient-dialog.component.html',
  styleUrls: ['./edit-patient-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPatientDialogComponent implements OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];

  currentPatient: Patient;
  constructor(
    private PatientAPIService: PatientAPIService,
    private Router: Router,
    private FormBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
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

    this.subs.push(this.PatientAPIService.editPatientInfo(this.currentPatient._id, this.currentPatient._rev, data.name, data.surname,
      address, data.profession, this.currentPatient.personalInfo.dateOfBirth, this.currentPatient.medicalHistory)
      .subscribe((patient: Patient): void => {
        this.currentPatient = patient;
        this.changeDetectorRef.detectChanges();
      }));
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
