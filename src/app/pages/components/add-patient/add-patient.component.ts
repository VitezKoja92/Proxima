import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Address } from '../../../api/models/index';
import { Patient, PatientPersonalInfo } from './../../../api/models/index';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent {

  form: FormGroup;

  constructor(
    private PatientAPIService: PatientAPIService,
    private UserAPIService: UserAPIService,
    private Router: Router,
    private FormBuilder: FormBuilder) {
      this.form = FormBuilder.group({
        'name': [null, Validators.required],
        'surname': [null, Validators.required],
        'date': [null, Validators.required],
        'city': [null, Validators.required],
        'country': [null, Validators.required],
        'postCode': [null],
        'street': [null],
        'streetNr': [null],
        'profession': [null]
      });
  }

  addPatient(data): void {
    const address: Address = new Address(data.country, data.city, data.postCode, data.street, data.streetNr);
    const personalInfo: PatientPersonalInfo = new PatientPersonalInfo(data.name, data.surname, data.date, address, data.profession);
    const patient = new Patient(personalInfo);

    this.PatientAPIService.addPatient(patient)
      .then((id: string): void => {
        this.Router.navigate(['/patient/' + id]);
      }, (error: Error): void => {
        console.log('Error: ', error);
    });
  }
}
