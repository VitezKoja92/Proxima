import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  styleUrls: ['./patient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientComponent implements OnDestroy {

  currentPatient: Patient;
  therapyVisible: boolean;
  form: FormGroup;

  subs: Subscription[] = [];

  constructor(
    private PatientAPIService: PatientAPIService,
    private ActivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private Router: Router,
    private FormBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.ActivatedRoute.params.subscribe(
      (params) => {
        this.subs.push(this.PatientAPIService.getPatient(params.id)
          .subscribe((patient: Patient) => {
            this.currentPatient = patient;
            this.changeDetectorRef.detectChanges();
          }));
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
  }

  deletePatient() {
    this.subs.push(this.PatientAPIService.deletePatient(this.currentPatient._id, this.currentPatient._rev)
    .subscribe(() => {
      this.Router.navigate(['/find-patient']);
    }));
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
      .subscribe((patient: Patient): void => {
        this.form.reset();
        this.therapyVisible = false;
      });
  }

  deleteMedicalHistoryItem(item: MedicalHistoryItem) {
    const newMedHistory: MedicalHistoryItem[] = this.currentPatient.medicalHistory.filter((medHistoryItem: MedicalHistoryItem) => {
      return medHistoryItem !== item;
    });
    this.currentPatient.medicalHistory = newMedHistory;
    this.subs.push(this.PatientAPIService.removeMedicalHistoryItem(item._id, newMedHistory)
      .subscribe((patient: Patient): void => {
        this.changeDetectorRef.detectChanges();
      }));
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
