import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Component, OnInit } from '@angular/core';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Address } from '../../../api/models/index';
import {
  Anamnesis,
  Diagnostics,
  ElectroTherapy,
  PhysicalTherapy,
  LaserTherapyChoices,
  Therapy,
  MedicalHistoryItem,
  Patient,
  PatientPersonalInfo
} from './../../../api/models/index';
import { UserAPIService } from './../../../api/pouchdb-service/user-api.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent {

  constructor(
    private PatientAPIService: PatientAPIService,
    private UserAPIService: UserAPIService,
    private Router: Router) {
  }

  addPatient( e, name: string, surname: string, dateOfBirth: Date,
              city: string, country: string, postCode: Number, street: string, number: string,
              profession: string,
              ): void {

    const address: Address = new Address(country, city, postCode, street, number);
    const personalInfo: PatientPersonalInfo = new PatientPersonalInfo(name, surname, dateOfBirth, address, profession);
    const patient = new Patient(personalInfo);

    this.PatientAPIService.addPatient(patient)
      .then((id: string): void => {
        console.log('New patient added: ', id);
        this.Router.navigate(['/patient/' + id]);
      }, (error: Error): void => {
        console.log('Error: ', error);
    });
  }

}
