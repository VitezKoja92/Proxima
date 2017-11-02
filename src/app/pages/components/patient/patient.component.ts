import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { Patient } from '../../../api/models/index';
import {
  LaserTherapyChoices,
  Anamnesis, Diagnostics,
  ElectroTherapy, PhysicalTherapy,
  Therapy,
  MedicalHistoryItem
} from './../../../api/models/index';
import { EditPatientDialogComponent } from './../edit-patient-dialog/edit-patient-dialog.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent {

  currentPatient: Patient;
  therapyVisible: boolean;

  ifsModel: any;
  ddModel: any;
  gsModel: any;
  esModel: any;
  cryoModel: any;
  ultraModel: any;
  impModel: any;
  checkedOne: any;
  checkedTwo: any;
  checkedThree: any;
  checkedFour: any;
  checkedFive: any;

  constructor(
    private PatientAPIService: PatientAPIService,
    private ActivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private Router: Router
  ) {
    this.ActivatedRoute.params.subscribe(
      (params) => {
        this.getPatient(params.id);
      }
    );
    this.therapyVisible = false;
  }

  getPatient(id: string): void {
    this.PatientAPIService.getPatient(id)
      .then((patient: Patient): void => {
        this.currentPatient = patient;
      }, (error: Error): void => {
        console.log('Error: ', error);
      });
  }

  showTherapy() {
    if (!this.therapyVisible) {
      this.therapyVisible = true;
    } else {
      this.therapyVisible = false;
    }
  }

  changeBtn() {
    if (!this.therapyVisible) {
      return 'red';
    } else {
      return '$lightgreen';
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditPatientDialogComponent, {
      width: '40%',
      data: {
        patient: this.currentPatient
      }
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        this.ActivatedRoute.params.subscribe(
          (params) => {
            this.getPatient(params.id);
          }
        );
      });
  }

  addTherapy(therapyDate: string, mainDifficulties?: string, anaMorbi?: string, anaVitae?: string, anaFamiliae?: string,
    labFindings?: string, labFindingsDate?: string, rtg?: string, rtgDate?: string, nmr?: string, nmrDate?: string, emng?: string,
    emngDate?: string, statusLocalis?: string, diagnosis?: string, recommendation?: string, mediocentric?: string): void {

    const anamnesis: Anamnesis = new Anamnesis(mainDifficulties, anaMorbi, anaVitae, anaFamiliae);
    const diagnostics: Diagnostics = new Diagnostics(labFindings, labFindingsDate, rtg, rtgDate, nmr, nmrDate, emng, emngDate);
    const electroTherapy: ElectroTherapy = new ElectroTherapy(this.ifsModel, this.ddModel, this.gsModel, this.esModel);

    const laserTherapy = [];
    if (this.checkedOne) { laserTherapy.push(LaserTherapyChoices.One); }
    if (this.checkedTwo) { laserTherapy.push(LaserTherapyChoices.Two); }
    if (this.checkedThree) { laserTherapy.push(LaserTherapyChoices.Three); }
    if (this.checkedFour) { laserTherapy.push(LaserTherapyChoices.Four); }
    if (this.checkedFive) { laserTherapy.push(LaserTherapyChoices.Five); }

    const physicalTherapy: PhysicalTherapy = new PhysicalTherapy(this.cryoModel, this.impModel, this.ultraModel, laserTherapy,
      electroTherapy);
    const recommendedTherapy: Therapy = new Therapy(recommendation, mediocentric, physicalTherapy);
    const medicalHistoryItem: MedicalHistoryItem = new MedicalHistoryItem(therapyDate, anamnesis, diagnostics,
      statusLocalis, diagnosis, recommendedTherapy, this.currentPatient._id);

    if (isNullOrUndefined(this.currentPatient.medicalHistory)) {
      this.currentPatient.medicalHistory = [];
    }
    this.currentPatient.medicalHistory.push(medicalHistoryItem);

    this.PatientAPIService.addTherapy(this.currentPatient._id, this.currentPatient._rev,
      this.currentPatient.personalInfo, this.currentPatient.medicalHistory)
      .then((patient: Patient): void => {
        this.currentPatient = patient;
        this.therapyVisible = false;
        this.ActivatedRoute.params.subscribe(
          (params) => {
            this.getPatient(params.id);
          }
        );
      }, (error: Error): void => {
        console.log('Error: ', error);
      });

  }

}
