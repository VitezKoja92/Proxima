import { PouchDbBootService } from './../../../api/pouchdb-service/pouchdb-boot.service';
import { PatientAPIService } from './../../../api/pouchdb-service/patient-api.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { FindPatientComponent } from './find-patient.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FindPatientComponent', () => {
  let component: FindPatientComponent;
  let fixture: ComponentFixture<FindPatientComponent>;

  class PatientAPIServiceMock {
    public getAllPatients() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PatientAPIService, useClass: PatientAPIServiceMock },
        PouchDbBootService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule, FormsModule],
      declarations: [FindPatientComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPatientComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component = null;
  });

  it('should call getAllPatients method from the PatientAPIService',
    inject([PatientAPIService], (PatientAPIService: PatientAPIService) => {
      spyOn(PatientAPIService, 'getAllPatients').and.callThrough();
      component.getAllPatients();
      expect(PatientAPIService.getAllPatients).toHaveBeenCalled();
    }));
});
