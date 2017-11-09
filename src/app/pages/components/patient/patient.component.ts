import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  form: FormGroup;

  constructor(
    private PatientAPIService: PatientAPIService,
    private ActivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private Router: Router,
    private FormBuilder: FormBuilder
  ) {
    this.ActivatedRoute.params.subscribe(
      (params) => {
        this.getPatient(params.id);
      }
    );
    this.therapyVisible = false;

    this.form = this.FormBuilder.group({
      'therapyDate': [null, Validators.required],
      'mainDifficulties': [null],
      'anaMorbi': [null],
      'anaVitae': [null],
      'anaFamiliae': [null],
      'labFindings': [null],
      'labFindingsDate': [null],
      'rtg': [null],
      'rtgDate': [null],
      'nmr': [null],
      'nmrDate': [null],
      'emng': [null],
      'emngDate': [null],
      'statusLocalis': [null],
      'diagnosis': [null, Validators.required],
      'recommendation': [null],
      'mediocentric': [null],
      'ifsModel': [null],
      'ddModel': [null],
      'gsModel': [null],
      'esModel': [null],
      'cryoModel': [null],
      'ultraModel': [null],
      'impModel': [null],
      'checkedOne': [null],
      'checkedTwo': [null],
      'checkedThree': [null],
      'checkedFour': [null],
      'checkedFive': [null]
    });
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

  deletePatient() {
    this.PatientAPIService.deletePatient(this.currentPatient._id, this.currentPatient._rev)
    .then(() => {
      this.Router.navigate(['/find-patient']);
    });
  }

  addTherapy(data: any): void {

    const anamnesis: Anamnesis = new Anamnesis(data.mainDifficulties, data.anaMorbi, data.anaVitae, data.anaFamiliae);
    const diagnostics: Diagnostics = new Diagnostics(data.labFindings, data.labFindingsDate,
      data.rtg, data.rtgDate, data.nmr, data.nmrDate, data.emng, data.emngDate);
    const electroTherapy: ElectroTherapy = new ElectroTherapy(data.ifsModel, data.ddModel, data.gsModel, data.esModel);

    const laserTherapy = [];
    if (data.checkedOne) { laserTherapy.push(LaserTherapyChoices.One); }
    if (data.checkedTwo) { laserTherapy.push(LaserTherapyChoices.Two); }
    if (data.checkedThree) { laserTherapy.push(LaserTherapyChoices.Three); }
    if (data.checkedFour) { laserTherapy.push(LaserTherapyChoices.Four); }
    if (data.checkedFive) { laserTherapy.push(LaserTherapyChoices.Five); }

    const physicalTherapy: PhysicalTherapy = new PhysicalTherapy(data.cryoModel, data.impModel, data.ultraModel, laserTherapy,
      electroTherapy);
    const recommendedTherapy: Therapy = new Therapy(data.recommendation, data.mediocentric, physicalTherapy);
    const medicalHistoryItem: MedicalHistoryItem = new MedicalHistoryItem(data.therapyDate, anamnesis, diagnostics,
      data.statusLocalis, data.diagnosis, recommendedTherapy, this.currentPatient._id);

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
