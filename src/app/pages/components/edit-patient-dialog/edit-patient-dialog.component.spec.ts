import { Address, MedicalHistoryItem } from './../../../api/models/index';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { EditPatientDialogComponent } from './edit-patient-dialog.component';
import { PatientAPIService } from '../../../api/pouchdb-service/patient-api.service';
import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';
import { MaterialModule } from '../../../modules/material.module';
import { Inject } from '@angular/core';
import { Patient } from '../../../api/models/index';


describe('EditPatientDialogComponent', () => {
  let component: EditPatientDialogComponent;
  let fixture: ComponentFixture<EditPatientDialogComponent>;

  class PatientAPIServiceMock {
    currentPatient: Patient;

    public editPatientInfo(id: string, rev: string, name: string, surname: string, address: Address,
      profession: string, dateOfBirth: Date, medicalHistory: MedicalHistoryItem[]) {
        const currentPatient = {
          _id: 'id',
          _rev: 'rev',
          personalInfo: {
            name: 'name',
            surname: 'surname',
            dateOfBirth: new Date(),
            address: null,
            profession: 'profession'
          },
          medicalHistory: null
        };
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PatientAPIService, useClass: PatientAPIServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        PouchDbBootService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [EditPatientDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component = null;
  });

  xit('should call editPatientInfo method from the PatientAPIService',
    inject([PatientAPIService], (PatientAPIService: PatientAPIService) => {
      spyOn(PatientAPIService, 'editPatientInfo').and.callThrough();
      component.editPersonalInfo('name', 'surname', 'city', 'country', 37000, 'street', 'streetNo', 'profession');
      expect(PatientAPIService.editPatientInfo).toHaveBeenCalled();
    }));

});
