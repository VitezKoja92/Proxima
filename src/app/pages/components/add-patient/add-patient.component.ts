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

  therapyVisible: boolean;

  constructor(private PatientAPIService: PatientAPIService, private UserAPIService: UserAPIService) {
    this.therapyVisible = false;
  }

  showTherapy() {
    this.therapyVisible = true;
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
      }, (error: Error): void => {
        console.log('Error: ', error);
    });

  }

  // addTherapy(therapyDate?: Date, mainDifficulties?: string, anaMorbi?: string, anaVitae?: string, anaFamiliae?: string,
  //   labFindings?: string, labFindingsDate?: Date, rtg?: string, rtgDate?: Date, nmr?: string, nmrDate?: Date, emng?: string,
  //   emngDate?: Date, statusLocalis?: string, diagnosis?: string, recommendation?: string, mediocentric?: string,
  //   laser?: LaserTherapyChoices[], ifs?: boolean, dd?: boolean, gs?: boolean, es?: boolean, cryo?: boolean, imp?: boolean,
  //   ultrasound?: boolean): void {

  //   const anamnesis: Anamnesis = new Anamnesis(mainDifficulties, anaMorbi, anaVitae, anaFamiliae);
  //   const diagnostics: Diagnostics = new Diagnostics(labFindings, labFindingsDate, rtg, rtgDate, nmr, nmrDate, emng, emngDate);
  //   const electroTherapy: ElectroTherapy = new ElectroTherapy(ifs, dd, gs, es);
  //   const physicalTherapy: PhysicalTherapy = new PhysicalTherapy(cryo, imp, ultrasound, laser, electroTherapy);
  //   const recommendedTherapy: Therapy = new Therapy(recommendation, mediocentric, physicalTherapy);
  //   const medicalHistoryItem: MedicalHistoryItem = new MedicalHistoryItem(therapyDate, anamnesis, diagnostics,
  //     statusLocalis, diagnosis, recommendedTherapy, localStorage.getItem('currentUser'));

  //   }

}
